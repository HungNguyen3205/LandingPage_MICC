import type { LeadSubmissionPayload, BackendLeadResponse } from './types';
import { validateLeadSubmission } from './leadValidator';
import { googleSheetsService } from './googleSheetsService';
import { telegramService } from './telegramService';
import { rateLimiter } from './rateLimiter';
import { deliverLead } from './deliverLead';

/**
 * Kiểm tra xem môi trường đã có cấu hình kết nối thật hay chưa
 */
export function hasRealCredentials(): boolean {
  if (process.env.MOCK_MODE === 'true') {
    return true; // Mock mode phục vụ test
  }

  const hasServiceAccount = Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GOOGLE_SHEET_ID
  );

  const hasWebhook = Boolean(
    process.env.GOOGLE_SHEET_WEBHOOK_URL &&
    process.env.GOOGLE_SHEET_WEBHOOK_URL.trim() !== ''
  );

  return hasServiceAccount || hasWebhook;
}

/**
 * Xử lý tiếp nhận Lead
 */
export async function handleLeadSubmission(
  payload: LeadSubmissionPayload,
  clientIp: string = '127.0.0.1'
): Promise<{ status: number; body: BackendLeadResponse }> {
  // 1. Kiểm tra Idempotency Key (tránh submit trùng khi user bấm nhiều lần hoặc retry sau timeout mạng)
  const cachedResponse = rateLimiter.getIdempotentResponse(payload.idempotencyKey);
  if (cachedResponse) {
    return {
      status: cachedResponse.success ? 200 : 400,
      body: cachedResponse,
    };
  }

  // 2. Kiểm tra Rate Limiting (chống flood/spam từ 1 IP)
  if (rateLimiter.isRateLimited(clientIp)) {
    return {
      status: 429,
      body: {
        success: false,
        statusCode: 'RATE_LIMITED',
        message: 'Bạn đã gửi yêu cầu gần đây. Vui lòng đợi trong giây lát trước khi gửi lại.',
      },
    };
  }

  // 3. Kiểm tra validation phía backend
  const validation = validateLeadSubmission(payload);

  // Nếu dính honeypot (bot điền vào ô ẩn)
  if (validation.isSpam) {
    // Trả về thành công giả lập để đánh lừa bot, không lưu vào hệ thống
    return {
      status: 200,
      body: {
        success: true,
        statusCode: 'SUCCESS',
        registrationCode: 'AB-FILTERED',
        message: 'Yêu cầu tư vấn của bạn đã được ghi nhận.',
      },
    };
  }

  if (!validation.isValid || !validation.sanitizedData) {
    return {
      status: 400,
      body: {
        success: false,
        statusCode: 'VALIDATION_ERROR',
        message: Object.values(validation.errors)[0] || 'Dữ liệu không hợp lệ.',
      },
    };
  }

  const leadData = validation.sanitizedData;

  // 4. Kiểm tra Chế độ Demo
  const isDemo = !hasRealCredentials();
  if (isDemo) {
    const demoResponse: BackendLeadResponse = {
      success: false,
      isDemo: true,
      statusCode: 'DEMO_MODE',
      registrationCode: leadData.registrationCode,
      message: 'Thông tin đã được kiểm tra trên bản demo. Chưa có dữ liệu được gửi đến đơn vị tư vấn.',
    };

    rateLimiter.saveIdempotentResponse(payload.idempotencyKey, demoResponse);

    return {
      status: 200,
      body: demoResponse,
    };
  }

  // 5. Gửi Google Sheets + Telegram CÙNG LÚC; trả kết quả ngay khi một kênh nhận được.
  //    Server Node chạy liên tục nên kênh chậm (Apps Script ~2-3s) tự hoàn tất phía sau.
  const delivery = deliverLead({
    sheet: async () => {
      const r = await googleSheetsService.appendLead(leadData);
      if (!r.success) console.error(`[LeadSystem] Lỗi ghi Google Sheets cho mã ${leadData.registrationCode}:`, r.error);
      return r.success;
    },
    telegram: async () => (await telegramService.sendNotification(leadData)).sent,
  });

  if (!(await delivery.firstDelivered)) {
    return {
      status: 502,
      body: {
        success: false,
        statusCode: 'DELIVERY_FAILED',
        message: 'Hệ thống tạm thời chưa nhận được đăng ký. Quý khách vui lòng gọi hotline 0987 069 770 để được hỗ trợ ngay.',
      },
    };
  }
  void delivery.settled.then((results) => {
    leadData.telegramStatus = results.telegram ? 'Đã gửi' : 'Lỗi gửi Telegram (Cần gửi lại)';
  });

  const finalResponse: BackendLeadResponse = {
    success: true,
    isDemo: false,
    statusCode: 'SUCCESS',
    registrationCode: leadData.registrationCode,
    telegramSent: delivery.results.telegram === true,
    message: 'Yêu cầu tư vấn của bạn đã được ghi nhận thành công.',
  };

  // Lưu cache Idempotency
  rateLimiter.saveIdempotentResponse(payload.idempotencyKey, finalResponse);

  return {
    status: 200,
    body: finalResponse,
  };
}

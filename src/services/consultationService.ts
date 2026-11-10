import type { ConsultationFormData, FormSubmissionResult } from '../types';

/**
 * Service quản lý gửi thông tin đăng ký tư vấn cho toàn bộ website (Trang chủ & Trang Liên hệ).
 *
 * Tuyệt đối tuân thủ bảo mật:
 * - Không lưu thông tin cá nhân vào localStorage hoặc URL.
 * - Không gọi Google Sheets hoặc Telegram trực tiếp từ trình duyệt (chống lộ bot token và credentials).
 * - Sử dụng Idempotency Key để tránh duplicate khi bấm liên tiếp hoặc mạng chập chờn.
 * - Truyền tải UTM parameters và trang nguồn phục vụ quản lý lead.
 */
class ConsultationService {
  private apiEndpoint: string;

  constructor() {
    // Ưu tiên biến môi trường VITE_CONSULTATION_API_URL nếu có (ví dụ khi tách domain backend), mặc định dùng endpoint nội bộ /api/consultation
    this.apiEndpoint = import.meta.env.VITE_CONSULTATION_API_URL || '/api/consultation';
  }

  /**
   * Sinh Idempotency Key cho mỗi lần submit để chống gửi trùng lặp
   */
  private generateIdempotencyKey(): string {
    const random = Math.random().toString(36).substring(2, 10);
    const time = Date.now().toString(36);
    return `idem-${time}-${random}`;
  }

  /**
   * Trích xuất các tham số UTM từ URL hiện tại
   */
  private getUtmParams(): { utmSource: string; utmMedium: string; utmCampaign: string } {
    if (typeof window === 'undefined') {
      return { utmSource: '', utmMedium: '', utmCampaign: '' };
    }
    const params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get('utm_source') || '',
      utmMedium: params.get('utm_medium') || '',
      utmCampaign: params.get('utm_campaign') || '',
    };
  }

  /**
   * Kiểm tra xem đang ở chế độ demo hay không (dựa vào cờ môi trường hoặc phản hồi server)
   */
  public isDemoMode(): boolean {
    return import.meta.env.VITE_ENABLE_DEMO_MODE === 'true';
  }

  /**
   * Gửi dữ liệu đăng ký tư vấn đến backend
   */
  public async submitLead(data: ConsultationFormData): Promise<FormSubmissionResult> {
    const utm = this.getUtmParams();
    const idempotencyKey = this.generateIdempotencyKey();
    const pageSource = typeof window !== 'undefined' ? window.location.pathname : '/lien-he';

    const payload = {
      ...data,
      pageSource,
      utmSource: utm.utmSource,
      utmMedium: utm.utmMedium,
      utmCampaign: utm.utmCampaign,
      consentVersion: 'v1.0-20261020',
      idempotencyKey,
    };

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000); // 12s timeout

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const result = (await response.json().catch(() => ({}))) as FormSubmissionResult;

      // Xử lý theo mã trạng thái HTTP
      if (response.status === 429) {
        return {
          success: false,
          statusCode: 'RATE_LIMITED',
          message: result.message || 'Bạn đã gửi yêu cầu gần đây. Vui lòng đợi trong giây lát trước khi gửi lại.',
        };
      }

      if (response.status === 400) {
        return {
          success: false,
          statusCode: 'VALIDATION_ERROR',
          message: result.message || 'Thông tin chưa đúng định dạng. Vui lòng kiểm tra lại các trường.',
        };
      }

      if (response.status === 503) {
        return {
          success: false,
          statusCode: 'SERVICE_UNAVAILABLE',
          message: result.message || 'Hệ thống tiếp nhận đang bận hoặc bảo trì. Quý khách vui lòng thử lại sau.',
        };
      }

      if (!response.ok) {
        return {
          success: false,
          statusCode: 'SERVICE_UNAVAILABLE',
          message: 'Không thể ghi nhận yêu cầu vào lúc này. Quý khách vui lòng thử lại sau hoặc liên hệ hotline.',
        };
      }

      // Xử lý phản hồi từ server (Demo mode hoặc Thành công thật)
      return {
        success: Boolean(result.success),
        isDemo: Boolean(result.isDemo),
        statusCode: result.statusCode,
        registrationCode: result.registrationCode,
        telegramSent: result.telegramSent,
        message:
          result.message ||
          (result.isDemo
            ? 'Thông tin đã được kiểm tra trên bản demo. Chưa có dữ liệu được gửi đến đơn vị tư vấn.'
            : 'Yêu cầu tư vấn của bạn đã được ghi nhận thành công.'),
      };
    } catch (error: unknown) {
      const isAbort = error instanceof Error && error.name === 'AbortError';
      return {
        success: false,
        statusCode: 'SERVICE_UNAVAILABLE',
        message: isAbort
          ? 'Thời gian kết nối quá hạn. Quý khách vui lòng kiểm tra mạng và thử lại.'
          : 'Không thể kết nối đến máy chủ tiếp nhận. Quý khách vui lòng kiểm tra đường truyền mạng.',
      };
    }
  }
}

export const consultationService = new ConsultationService();
export const leadService = consultationService;

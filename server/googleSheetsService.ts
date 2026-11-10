import crypto from 'node:crypto';
import type { SanitizedLeadData } from './types';

export const SHEET_COLUMNS = [
  'Mã đăng ký',
  'Thời gian',
  'Họ tên',
  'Số điện thoại',
  'Email',
  'Sản phẩm quan tâm',
  'Giờ hẹn tư vấn',
  'Nội dung tư vấn',
  'Nguồn tiếp cận',
  'Trạng thái xử lý',
];

export interface AppendRowResult {
  success: boolean;
  error?: string;
  isMock?: boolean;
}

/**
 * Tạo Google OAuth2 Access Token bằng Service Account JWT (sử dụng module crypto có sẵn của Node.js, không cần thêm thư viện ngoài)
 */
async function getGoogleServiceAccountAccessToken(
  clientEmail: string,
  privateKeyRaw: string
): Promise<string> {
  // Chuẩn hóa private key (xử lý newline escape trong biến môi trường)
  const privateKey = privateKeyRaw.replace(/\\n/g, '\n');

  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const claimSet = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const base64UrlEncode = (obj: object): string => {
    return Buffer.from(JSON.stringify(obj))
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };

  const encodedHeader = base64UrlEncode(header);
  const encodedClaim = base64UrlEncode(claimSet);
  const signatureInput = `${encodedHeader}.${encodedClaim}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signatureInput);
  signer.end();
  const signature = signer
    .sign(privateKey, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const jwt = `${signatureInput}.${signature}`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!tokenRes.ok) {
    const errorBody = await tokenRes.text();
    throw new Error(`Không thể lấy Google Access Token: ${tokenRes.status} ${errorBody}`);
  }

  const tokenData = (await tokenRes.json()) as { access_token: string };
  return tokenData.access_token;
}

export class GoogleSheetsService {
  // In-memory mock storage dùng cho kiểm thử tự động
  public mockRows: string[][] = [];

  /**
   * Chuyển đổi dữ liệu Lead thành hàng gồm 10 cột thiết yếu
   */
  public toRowValues(lead: SanitizedLeadData): string[] {
    // Kết hợp nguồn và chiến dịch quảng cáo gọn gàng
    let sourceText = lead.pageSource || '/lien-he';
    if (lead.utmSource) {
      sourceText = lead.utmCampaign
        ? `${lead.utmSource} / ${lead.utmCampaign}`
        : lead.utmSource;
    }

    return [
      lead.registrationCode,
      lead.timestamp,
      lead.fullName,
      lead.phone, // Chuỗi có dấu ' để bảo toàn số 0
      lead.email || 'Chưa cung cấp',
      lead.product,
      lead.preferredTime,
      lead.notes || 'Không có ghi chú thêm',
      sourceText,
      lead.processingStatus || 'Mới tiếp nhận',
    ];
  }

  /**
   * Lưu Lead vào Google Sheets
   */
  public async appendLead(lead: SanitizedLeadData): Promise<AppendRowResult> {
    const rowValues = this.toRowValues(lead);

    // 1. Kiểm tra nếu đang bật Mock Mode (để kiểm thử an toàn)
    const isMock = process.env.MOCK_MODE === 'true';
    if (isMock) {
      this.mockRows.push(rowValues);
      return { success: true, isMock: true };
    }

    // 2. Phương án Google Apps Script Webhook (tiện lợi, triển khai nhanh)
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (webhookUrl && webhookUrl.trim() !== '') {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            registrationCode: lead.registrationCode,
            columns: SHEET_COLUMNS,
            row: rowValues,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!res.ok) {
          throw new Error(`Webhook phản hồi mã lỗi HTTP ${res.status}`);
        }

        return { success: true };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Lỗi kết nối Webhook';
        return { success: false, error: message };
      }
    }

    // 3. Phương án Google Service Account (Google Sheets REST API v4 chính thức)
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const sheetName = process.env.GOOGLE_SHEET_NAME || 'Đăng ký tư vấn';

    if (!clientEmail || !privateKey || !sheetId) {
      // Khi chưa có cấu hình credentials
      return {
        success: false,
        error: 'Chưa cấu hình tài khoản Google Service Account hoặc Webhook',
      };
    }

    try {
      const accessToken = await getGoogleServiceAccountAccessToken(clientEmail, privateKey);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const range = encodeURIComponent(`${sheetName}!A:J`);
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [rowValues],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errDetail = await response.text();
        throw new Error(`Google Sheets API lỗi (${response.status}): ${errDetail}`);
      }

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Lỗi khi gọi Google Sheets API';
      return { success: false, error: message };
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();

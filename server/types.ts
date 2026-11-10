/**
 * Định nghĩa kiểu dữ liệu cho Backend tiếp nhận Lead - VINHOMES
 */

export interface LeadSubmissionPayload {
  fullName: string;
  phone: string;
  email?: string;
  product?: string;
  preferredTime?: string;
  notes?: string;
  consentAgreed: boolean;
  consentVersion?: string;
  pageSource?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  idempotencyKey?: string;
  // Honeypot field (phải để trống đối với người dùng thật)
  _hp_company?: string;
}

export interface LeadValidationResult {
  isValid: boolean;
  isSpam: boolean;
  errors: Record<string, string>;
  sanitizedData?: SanitizedLeadData;
}

export interface SanitizedLeadData {
  registrationCode: string;
  timestamp: string; // Asia/Ho_Chi_Minh
  fullName: string;
  phone: string; // Dạng chuỗi giữ số 0 đầu
  email: string;
  product: string;
  preferredTime: string;
  notes: string;
  pageSource: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  consentAgreedText: string;
  consentVersion: string;
  processingStatus: string;
  telegramStatus: string;
}

export interface BackendLeadResponse {
  success: boolean;
  isDemo?: boolean;
  statusCode?: 'SUCCESS' | 'DEMO_MODE' | 'VALIDATION_ERROR' | 'RATE_LIMITED' | 'SERVICE_UNAVAILABLE';
  registrationCode?: string;
  message: string;
  telegramSent?: boolean;
}

export interface ServerConfig {
  isDemoMode: boolean;
  isMockMode: boolean;
  googleServiceAccountEmail?: string;
  googlePrivateKey?: string;
  googleSheetId?: string;
  googleSheetName?: string;
  googleSheetWebhookUrl?: string;
  telegramBotToken?: string;
  telegramChatId?: string;
}

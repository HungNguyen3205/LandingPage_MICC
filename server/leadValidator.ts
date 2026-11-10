import type { LeadSubmissionPayload, LeadValidationResult, SanitizedLeadData } from './types';

export const VALID_PRODUCTS = [
  'Cần tư vấn thêm',
  'Biệt Thự Đơn Lập (Lâm Phong)',
  'Biệt Thự Song Lập (Bạch Vân)',
  'Nhà Phố Liền Kề (Hồng Châu & Ánh Ngọc)',
  'Shophouse & Căn Hộ',
  'Ocean Villa',
  'Garden Residence',
  'Sky Collection',
];

export const VALID_PREFERRED_TIMES = [
  'Bất kỳ thời gian phù hợp',
  'Buổi sáng',
  'Buổi chiều',
  'Buổi tối',
];

/**
 * Định dạng thời gian chuẩn theo múi giờ Việt Nam (Asia/Ho_Chi_Minh: UTC+7)
 * Định dạng đầu ra: YYYY-MM-DD HH:mm:ss
 */
export function getVietnamTimestamp(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const getPart = (type: string) => parts.find((p) => p.type === type)?.value || '00';
  return `${getPart('year')}-${getPart('month')}-${getPart('day')} ${getPart('hour')}:${getPart('minute')}:${getPart('second')}`;
}

/**
 * Sinh mã đăng ký duy nhất: VH-YYYYMMDD-XXXX (4 ký tự ngẫu nhiên)
 */
export function generateRegistrationCode(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `VH-${y}${m}${d}-${randomSuffix}`;
}

/**
 * Phòng chống tấn công Spreadsheet Formula Injection (CSV/Formula Injection):
 * Nếu một chuỗi văn bản bắt đầu bằng =, +, -, @, tab hoặc xuống dòng,
 * tiền tố dấu nháy đơn ' sẽ được thêm vào để Google Sheets hiểu đây là văn bản thuần,
 * không tự động thực thi công thức tính toán.
 */
export function sanitizeSpreadsheetText(value: string | undefined | null): string {
  if (!value) return '';
  const trimmed = String(value).trim();
  if (/^[=+\-@\t\r]/.test(trimmed)) {
    return `'${trimmed}`;
  }
  return trimmed;
}

/**
 * Định dạng số điện thoại để lưu trữ an toàn trong Google Sheets:
 * Thêm tiền tố ' để đảm bảo Google Sheets lưu dưới dạng chuỗi và giữ nguyên số 0 ở đầu.
 */
export function formatPhoneForSheet(phone: string): string {
  const clean = phone.replace(/[\s.-]/g, '');
  return `'${clean}`;
}

/**
 * Escape văn bản khi gửi qua Telegram (HTML mode)
 */
export function escapeTelegramHtml(text: string | undefined | null): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Kiểm tra và chuẩn hóa dữ liệu gửi lên từ form
 */
export function validateLeadSubmission(payload: LeadSubmissionPayload): LeadValidationResult {
  const errors: Record<string, string> = {};

  // 1. Kiểm tra Honeypot chống bot tự động
  if (payload._hp_company && payload._hp_company.trim() !== '') {
    return {
      isValid: false,
      isSpam: true,
      errors: { _hp_company: 'Spam detected' },
    };
  }

  // 2. Họ và tên
  const fullNameRaw = (payload.fullName || '').trim();
  if (!fullNameRaw) {
    errors.fullName = 'Vui lòng cung cấp họ và tên.';
  } else if (fullNameRaw.length < 2) {
    errors.fullName = 'Họ và tên cần có ít nhất 2 ký tự.';
  } else if (fullNameRaw.length > 100) {
    errors.fullName = 'Họ và tên không được vượt quá 100 ký tự.';
  }

  // 3. Số điện thoại (chấp nhận số Việt Nam 10 số hoặc đầu +84)
  const phoneRaw = (payload.phone || '').replace(/[\s.-]/g, '');
  const vnPhoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
  if (!phoneRaw) {
    errors.phone = 'Vui lòng cung cấp số điện thoại liên hệ.';
  } else if (!vnPhoneRegex.test(phoneRaw)) {
    errors.phone = 'Số điện thoại không hợp lệ (ví dụ: 0912 345 678 hoặc +84 912 345 678).';
  }

  // 4. Email (tùy chọn, nhưng nếu có phải hợp lệ)
  const emailRaw = (payload.email || '').trim();
  if (emailRaw) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailRaw)) {
      errors.email = 'Định dạng email chưa chính xác.';
    } else if (emailRaw.length > 120) {
      errors.email = 'Địa chỉ email quá dài.';
    }
  }

  // 5. Checkbox đồng ý điều khoản (bắt buộc)
  if (!payload.consentAgreed) {
    errors.consentAgreed = 'Bạn cần xác nhận đồng ý để đơn vị tư vấn liên hệ.';
  }

  // 6. Whitelist sản phẩm và khung giờ
  const product = VALID_PRODUCTS.includes(payload.product || '')
    ? payload.product!
    : 'Cần tư vấn thêm';

  const preferredTime = VALID_PREFERRED_TIMES.includes(payload.preferredTime || '')
    ? payload.preferredTime!
    : 'Bất kỳ thời gian phù hợp';

  // 7. Ghi chú (giới hạn 1000 ký tự)
  const rawNotes = (payload.notes || '').slice(0, 1000);

  if (Object.keys(errors).length > 0) {
    return {
      isValid: false,
      isSpam: false,
      errors,
    };
  }

  const now = new Date();
  const registrationCode = generateRegistrationCode(now);
  const timestamp = getVietnamTimestamp(now);

  const sanitizedData: SanitizedLeadData = {
    registrationCode,
    timestamp,
    fullName: sanitizeSpreadsheetText(fullNameRaw),
    phone: formatPhoneForSheet(phoneRaw),
    email: sanitizeSpreadsheetText(emailRaw),
    product: sanitizeSpreadsheetText(product),
    preferredTime: sanitizeSpreadsheetText(preferredTime),
    notes: sanitizeSpreadsheetText(rawNotes),
    pageSource: sanitizeSpreadsheetText(payload.pageSource || '/lien-he'),
    utmSource: sanitizeSpreadsheetText(payload.utmSource || ''),
    utmMedium: sanitizeSpreadsheetText(payload.utmMedium || ''),
    utmCampaign: sanitizeSpreadsheetText(payload.utmCampaign || ''),
    consentAgreedText: 'Đã đồng ý',
    consentVersion: sanitizeSpreadsheetText(payload.consentVersion || 'v1.0-20261020'),
    processingStatus: 'Mới tiếp nhận',
    telegramStatus: 'Chưa gửi',
  };

  return {
    isValid: true,
    isSpam: false,
    errors: {},
    sanitizedData,
  };
}

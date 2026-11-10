/**
 * Mẫu tin Telegram cho lead mới. Dùng chung cho Vercel (api/consultation.ts) và
 * server dev/preview (server/telegramService.ts). Bản PHP (public/api/consultation.php)
 * chép lại đúng bố cục này — sửa ở đây thì sửa cả bên đó.
 *
 * Bố cục: thông tin cần gọi lại ngay (tên, SĐT) ở trên cùng; dòng trống thì ẩn;
 * mã đăng ký / giờ / nguồn để cuối tin, chữ nghiêng nhỏ.
 */

export interface LeadMessageInput {
  projectLabel?: string;
  registrationCode: string;
  fullName: string;
  phone: string;
  email?: string;
  product?: string;
  unit?: string;
  preferredTime?: string;
  notes?: string;
  pageSource?: string;
  utmSource?: string;
  utmCampaign?: string;
  date?: Date;
}

const DIVIDER = '━━━━━━━━━━━━━━━━';

export const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** +84971120038 / 0971120038 → 0971 120 038 */
export const formatPhoneVN = (raw: string): string => {
  let digits = raw.replace(/[^\d+]/g, '').replace(/^'/, '');
  if (digits.startsWith('+84')) digits = '0' + digits.slice(3);
  else if (digits.startsWith('84') && digits.length === 11) digits = '0' + digits.slice(2);
  return digits.length === 10 ? `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}` : digits;
};

/** 22:58 · 10/11/2026 (giờ Việt Nam) */
export const formatTimeVN = (date: Date): string => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric', hour12: false,
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('hour')}:${get('minute')} · ${get('day')}/${get('month')}/${get('year')}`;
};

const PAGE_NAMES: Record<string, string> = { '/': 'Trang chủ', '': 'Trang chủ', '/lien-he': 'Trang liên hệ' };

export function buildLeadMessage(input: LeadMessageInput): string {
  const e = (v?: string) => escapeHtml((v ?? '').trim());
  const lines: string[] = [];

  lines.push('🔔 <b>KHÁCH ĐĂNG KÝ TƯ VẤN MỚI</b>');
  if (input.projectLabel?.trim()) lines.push(`🏝 ${e(input.projectLabel)}`);
  lines.push(DIVIDER, '');

  lines.push(`👤 <b>${e(input.fullName)}</b>`);
  lines.push(`📞 <code>${e(formatPhoneVN(input.phone))}</code>`);
  if (input.email?.trim()) lines.push(`✉️ ${e(input.email)}`);
  lines.push('');

  lines.push(`🏡 <b>Quan tâm:</b> ${e(input.product) || 'Cần tư vấn thêm'}`);
  if (input.unit?.trim()) lines.push(`🔑 <b>Căn chọn:</b> ${e(input.unit)}`);
  lines.push(`🕐 <b>Gọi lại:</b> ${e(input.preferredTime) || 'Bất kỳ lúc nào'}`);

  if (input.notes?.trim()) {
    lines.push('', '💬 <b>Lời nhắn:</b>', `<blockquote>${e(input.notes.slice(0, 600))}</blockquote>`);
  }

  const page = input.pageSource ?? '/';
  const source = [PAGE_NAMES[page] ?? page, input.utmSource, input.utmCampaign].filter((s) => s && s.trim()).join(' · ');
  lines.push('', DIVIDER);
  lines.push(`<i>🆔 ${e(input.registrationCode)}  ·  ${formatTimeVN(input.date ?? new Date())}</i>`);
  lines.push(`<i>🌐 ${e(source)}</i>`);

  return lines.join('\n');
}

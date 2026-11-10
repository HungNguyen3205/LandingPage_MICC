import type { IncomingMessage, ServerResponse } from 'node:http';

function escapeTelegramHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default async function handler(
  req: IncomingMessage & { body?: any },
  res: ServerResponse
) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Idempotency-Key');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }));
    return;
  }

  try {
    let payload: any;
    if (req.body && typeof req.body === 'object') {
      payload = req.body;
    } else {
      const chunks: Uint8Array[] = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const rawText = Buffer.concat(chunks).toString('utf-8');
      payload = rawText ? JSON.parse(rawText) : {};
    }

    // 1. Honeypot chống bot
    if (payload._hp_company) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: true,
        statusCode: 'SUCCESS',
        registrationCode: 'AB-FILTERED',
        message: 'Yêu cầu tư vấn của bạn đã được ghi nhận.'
      }));
      return;
    }

    // 2. Validate dữ liệu
    const fullName = String(payload.fullName || '').trim();
    const phoneRaw = String(payload.phone || '').trim();
    const email = String(payload.email || '').trim();
    const product = String(payload.product || 'Chưa xác định').trim();
    const preferredTime = String(payload.preferredTime || 'Bất kỳ lúc nào').trim();
    const notes = String(payload.notes || '').trim();
    const pageSource = String(payload.pageSource || '/lien-he').trim();
    const utmSource = String(payload.utmSource || '').trim();
    const utmCampaign = String(payload.utmCampaign || '').trim();

    if (fullName.length < 2) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: false,
        statusCode: 'VALIDATION_ERROR',
        message: 'Vui lòng nhập họ và tên hợp lệ (tối thiểu 2 ký tự).'
      }));
      return;
    }

    const cleanPhone = phoneRaw.replace(/[^\d+]/g, '');
    if (!/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/.test(cleanPhone)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: false,
        statusCode: 'VALIDATION_ERROR',
        message: 'Số điện thoại không hợp lệ (cần là số di động Việt Nam 10 chữ số).'
      }));
      return;
    }

    const displayPhone = cleanPhone.startsWith('+84') ? '0' + cleanPhone.slice(3) : cleanPhone;
    const phoneForSheet = "'" + displayPhone;

    // 3. Chuẩn bị thông tin 10 cột
    const now = new Date().toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const randCode = Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const registrationCode = `VH-${dateStr}-${randCode}`;

    let sourceText = pageSource;
    if (utmSource) {
      sourceText = utmCampaign ? `${utmSource} / ${utmCampaign}` : utmSource;
    }

    const rowValues = [
      registrationCode,
      now,
      fullName,
      phoneForSheet,
      email || 'Chưa cung cấp',
      product,
      preferredTime,
      notes || 'Không có ghi chú thêm',
      sourceText,
      'Mới tiếp nhận'
    ];

    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // 4. Gửi vào Google Sheets qua Webhook
    let sheetSuccess = false;
    if (webhookUrl && webhookUrl.trim() !== '') {
      try {
        const sheetRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ row: rowValues }),
        });
        sheetSuccess = sheetRes.ok;
      } catch (sheetErr) {
        console.error('[Google Sheets Error]:', sheetErr);
      }
    }

    // 5. Gửi thông báo đến nhóm Telegram
    let telegramSuccess = false;
    if (botToken && chatId) {
      try {
        const safeName = escapeTelegramHtml(fullName);
        const safePhone = escapeTelegramHtml(displayPhone);
        const safeEmail = email ? escapeTelegramHtml(email) : '<i>Chưa cung cấp</i>';
        const safeProduct = escapeTelegramHtml(product);
        const safeTime = escapeTelegramHtml(preferredTime);
        const safeSource = escapeTelegramHtml(sourceText);
        const safeNotes = notes ? escapeTelegramHtml(notes.slice(0, 500)) : '<i>Không có ghi chú thêm</i>';

        const msg =
          `🌿 <b>ĐĂNG KÝ TƯ VẤN MỚI — VINHOMES</b>\n\n` +
          `▫️ <b>Mã đăng ký:</b> <code>${registrationCode}</code>\n` +
          `▫️ <b>Thời gian:</b> ${now} (Giờ VN)\n` +
          `▫️ <b>Khách hàng:</b> ${safeName}\n` +
          `▫️ <b>Điện thoại:</b> <code>${safePhone}</code>\n` +
          `▫️ <b>Email:</b> ${safeEmail}\n` +
          `▫️ <b>Sản phẩm quan tâm:</b> ${safeProduct}\n` +
          `▫️ <b>Thời gian liên hệ:</b> ${safeTime}\n` +
          `▫️ <b>Trang nguồn:</b> <code>${safeSource}</code>\n\n` +
          `▫️ <b>Nội dung tư vấn:</b>\n` +
          `<blockquote>${safeNotes}</blockquote>`;

        const teleRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: msg,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          }),
        });
        telegramSuccess = teleRes.ok;
      } catch (teleErr) {
        console.error('[Telegram Error]:', teleErr);
      }
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({
      success: true,
      isDemo: false,
      statusCode: 'SUCCESS',
      registrationCode,
      sheetSaved: sheetSuccess,
      telegramSent: telegramSuccess,
      message: 'Yêu cầu tư vấn của bạn đã được ghi nhận thành công.'
    }));
  } catch (err: unknown) {
    console.error('[Consultation API Error]:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      success: false,
      statusCode: 'INTERNAL_ERROR',
      message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'
    }));
  }
}

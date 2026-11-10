import type { IncomingMessage, ServerResponse } from 'node:http';
import { waitUntil } from '@vercel/functions';
import { buildLeadMessage } from '../server/telegramMessage.js';
import { deliverLead, postJson } from '../server/deliverLead.js';

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
    // Căn khách bấm chọn trong bảng giá, ví dụ "VM-03 · Vịnh Mây · Giá TTTĐ 5,781 tỷ"
    const unit = String(payload.unit || '').trim().slice(0, 120);
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
    // Tên dự án gắn vào lead: phân biệt khi nhiều landing page dùng chung bot & sheet
    const projectLabel = (process.env.LEAD_SOURCE_LABEL || '').trim();
    if (projectLabel) {
      sourceText = `[${projectLabel}] ${sourceText}`;
    }

    const rowValues = [
      registrationCode,
      now,
      fullName,
      phoneForSheet,
      email || 'Chưa cung cấp',
      unit ? `${product} · Căn ${unit}` : product,
      preferredTime,
      notes || 'Không có ghi chú thêm',
      sourceText,
      'Mới tiếp nhận'
    ];

    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // 4. Gửi Telegram + Google Sheet CÙNG LÚC; trả kết quả ngay khi một kênh nhận được.
    //    Kênh chậm (Apps Script ~2-3s) chạy tiếp sau khi trả response nhờ waitUntil.
    const channels: Record<string, () => Promise<boolean>> = {};
    if (botToken && chatId) {
      const msg = buildLeadMessage({
        projectLabel, registrationCode, fullName, phone: displayPhone, email,
        product, unit, preferredTime, notes, pageSource, utmSource, utmCampaign,
      });
      channels.telegram = () => postJson(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId, text: msg, parse_mode: 'HTML', disable_web_page_preview: true,
      }, 6000);
    }
    if (webhookUrl && webhookUrl.trim() !== '') {
      channels.sheet = () => postJson(webhookUrl, { row: rowValues }, 9000);
    }

    const delivery = deliverLead(channels);
    waitUntil(delivery.settled.then((results) => {
      if (Object.values(results).some((ok) => !ok)) {
        console.error('[Consultation API] Một kênh gửi lỗi', { registrationCode, results });
      }
    }));
    const delivered = await delivery.firstDelivered;

    // Không kênh nào nhận được lead (thiếu biến môi trường hoặc token sai):
    // báo lỗi để khách gọi hotline thay vì hiện "thành công" rồi mất lead.
    if (!delivered) {
      console.error('[Consultation API] Lead NOT delivered', {
        registrationCode,
        hasWebhook: Boolean(webhookUrl),
        hasTelegram: Boolean(botToken && chatId),
      });
      res.statusCode = 502;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({
        success: false,
        statusCode: 'DELIVERY_FAILED',
        message: 'Hệ thống tạm thời chưa nhận được đăng ký. Quý khách vui lòng gọi hotline 0987 069 770 để được hỗ trợ ngay.',
      }));
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({
      success: true,
      isDemo: false,
      statusCode: 'SUCCESS',
      registrationCode,
      // Kênh nào đã xác nhận tại thời điểm trả kết quả (kênh còn lại vẫn đang chạy)
      delivered: delivery.results,
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

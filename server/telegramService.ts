import { buildLeadMessage } from './telegramMessage';
import type { SanitizedLeadData } from './types';

export interface TelegramSendResult {
  sent: boolean;
  error?: string;
  isMock?: boolean;
}

export class TelegramService {
  // Bộ lưu trữ tin nhắn giả lập để phục vụ kiểm thử tự động
  public mockMessages: Array<{ code: string; text: string }> = [];

  /**
   * Soạn thảo tin nhắn Telegram theo định dạng HTML an toàn
   */
  public buildMessage(lead: SanitizedLeadData): string {
    return buildLeadMessage({
      projectLabel: process.env.LEAD_SOURCE_LABEL,
      registrationCode: lead.registrationCode,
      fullName: lead.fullName,
      phone: lead.phone,
      email: lead.email,
      product: lead.product,
      unit: lead.unit,
      preferredTime: lead.preferredTime,
      notes: lead.notes,
      pageSource: lead.pageSource,
      utmSource: lead.utmSource,
      utmCampaign: lead.utmCampaign,
    });
  }

  /**
   * Gửi thông báo đến nhóm Telegram với cơ chế Timeout và Retry có giới hạn
   */
  public async sendNotification(lead: SanitizedLeadData): Promise<TelegramSendResult> {
    const isMock = process.env.MOCK_MODE === 'true';
    const messageText = this.buildMessage(lead);

    if (isMock) {
      this.mockMessages.push({
        code: lead.registrationCode,
        text: messageText,
      });
      return { sent: true, isMock: true };
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return {
        sent: false,
        error: 'Chưa cấu hình TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID',
      };
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const payload = {
      chat_id: chatId,
      text: messageText,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    };

    // Retry tối đa 2 lần với backoff
    const maxRetries = 2;
    let lastError = '';

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      if (attempt > 0) {
        // Backoff: 500ms lần 1, 1000ms lần 2
        await new Promise((r) => setTimeout(r, attempt * 500));
      }

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (res.ok) {
          return { sent: true };
        }

        const errJson = (await res.json().catch(() => ({}))) as { description?: string };
        lastError = errJson.description || `HTTP ${res.status}`;
      } catch (err: unknown) {
        lastError = err instanceof Error ? err.message : 'Timeout hoặc lỗi mạng Telegram';
      }
    }

    // Bảo mật: Chỉ ghi log mã đăng ký và loại lỗi, không log thông tin cá nhân khách hàng
    console.warn(`[LeadSystem] Telegram thất bại cho mã ${lead.registrationCode}: ${lastError}`);

    return {
      sent: false,
      error: lastError,
    };
  }
}

export const telegramService = new TelegramService();

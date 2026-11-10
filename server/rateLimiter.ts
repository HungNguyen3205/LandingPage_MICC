import type { BackendLeadResponse } from './types';

interface RateLimitRecord {
  timestamps: number[];
}

interface IdempotencyRecord {
  createdAt: number;
  response: BackendLeadResponse;
}

class RateLimiter {
  private ipRecords = new Map<string, RateLimitRecord>();
  private idempotencyRecords = new Map<string, IdempotencyRecord>();
  private readonly maxRequestsPerWindow = 5;
  private readonly windowMs = 10 * 60 * 1000; // 10 phút
  private readonly idempotencyTtlMs = 15 * 60 * 1000; // 15 phút

  constructor() {
    // Tự động dọn dẹp bộ nhớ mỗi 5 phút
    setInterval(() => this.cleanup(), 5 * 60 * 1000).unref();
  }

  /**
   * Kiểm tra xem IP có vượt quá ngưỡng giới hạn gửi hay không
   */
  public isRateLimited(ip: string): boolean {
    const now = Date.now();
    const cleanIp = ip || 'anonymous';
    const record = this.ipRecords.get(cleanIp) || { timestamps: [] };

    // Lọc bỏ các timestamp ngoài khung thời gian 10 phút
    const recent = record.timestamps.filter((ts) => now - ts < this.windowMs);
    recent.push(now);
    this.ipRecords.set(cleanIp, { timestamps: recent });

    return recent.length > this.maxRequestsPerWindow;
  }

  /**
   * Lấy kết quả đã lưu trữ của một Idempotency Key (tránh submit trùng lặp khi retry mạng)
   */
  public getIdempotentResponse(key: string | undefined): BackendLeadResponse | null {
    if (!key) return null;
    const record = this.idempotencyRecords.get(key);
    if (!record) return null;

    if (Date.now() - record.createdAt > this.idempotencyTtlMs) {
      this.idempotencyRecords.delete(key);
      return null;
    }

    return record.response;
  }

  /**
   * Lưu kết quả Idempotency Key
   */
  public saveIdempotentResponse(key: string | undefined, response: BackendLeadResponse): void {
    if (!key) return;
    this.idempotencyRecords.set(key, {
      createdAt: Date.now(),
      response,
    });
  }

  private cleanup(): void {
    const now = Date.now();

    for (const [ip, record] of this.ipRecords.entries()) {
      const recent = record.timestamps.filter((ts) => now - ts < this.windowMs);
      if (recent.length === 0) {
        this.ipRecords.delete(ip);
      } else {
        this.ipRecords.set(ip, { timestamps: recent });
      }
    }

    for (const [key, record] of this.idempotencyRecords.entries()) {
      if (now - record.createdAt > this.idempotencyTtlMs) {
        this.idempotencyRecords.delete(key);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

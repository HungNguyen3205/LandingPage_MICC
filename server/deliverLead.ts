/**
 * Gửi lead tới nhiều kênh (Telegram, Google Sheet) CÙNG LÚC và trả kết quả ngay khi
 * kênh đầu tiên nhận thành công — khách không phải chờ kênh chậm nhất (Apps Script ~2-3s).
 *
 * - `firstDelivered`: resolve true khi một kênh thành công, false khi TẤT CẢ đều lỗi
 *   (lúc đó mới báo lỗi cho khách → không mất lead âm thầm).
 * - `settled`: hoàn tất khi mọi kênh chạy xong. Trên serverless phải giữ promise này sống
 *   sau khi trả response (Vercel: waitUntil) để kênh chậm không bị cắt ngang.
 */
export type Channel = () => Promise<boolean>;

export function deliverLead(channels: Record<string, Channel>) {
  const names = Object.keys(channels);
  const results: Record<string, boolean> = {};

  const runs = names.map((name) =>
    channels[name]()
      .catch((err: unknown) => {
        console.error(`[deliverLead] ${name} lỗi:`, err instanceof Error ? err.message : err);
        return false;
      })
      .then((ok) => {
        results[name] = ok;
        return ok;
      }),
  );

  const firstDelivered = Promise.any(runs.map((run) => run.then((ok) => (ok ? true : Promise.reject(new Error('failed'))))))
    .catch(() => false);

  const settled = Promise.all(runs).then(() => results);

  return { firstDelivered, settled, results };
}

/** fetch có giới hạn thời gian, trả true khi HTTP 2xx/3xx */
export async function postJson(url: string, body: unknown, timeoutMs: number): Promise<boolean> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
    redirect: 'follow',
  });
  return res.ok;
}

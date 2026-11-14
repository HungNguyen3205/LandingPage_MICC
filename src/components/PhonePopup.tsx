import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle2, Loader2, X } from 'lucide-react';
import { leadService } from '../services/consultationService';

/** Popup chiến dịch "Cơ hội cuối năm 2026" chỉ xin số điện thoại. Lead đi chung đường /api/consultation → Telegram + Google Sheet. */

const SHOW_DELAY_MS = 600; // vào web là hiện (chờ một nhịp cho trang kịp hiện)
const HIDDEN_ON = ['/dang-ky-thanh-cong'];
const PHONE_REGEX = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

// Các backend đều bắt buộc họ tên ≥ 2 ký tự: dùng tên tạm để Telegram/Sheet nhận ra lead voucher từ popup
const POPUP_NAME = '🎫 Khách có voucher';
const PAGE_LABELS: Record<string, string> = { '/': 'Trang chủ' };

export const PhonePopup: React.FC = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Mỗi lần tải (hoặc tải lại) trang hiện một lần; chuyển trang trong web thì không bật lại
  const shown = useRef(false);

  const hiddenHere = HIDDEN_ON.includes(pathname);

  // Vào web hoặc tải lại trang là hiện, không ghi nhớ gì trong trình duyệt
  useEffect(() => {
    if (hiddenHere || shown.current) return;
    const timer = window.setTimeout(() => {
      shown.current = true;
      setOpen(true);
    }, SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [hiddenHere]);

  // Chuyển sang trang thành công thì ẩn luôn
  const visible = open && !hiddenHere;

  // Khoá cuộn trang, Esc để đóng
  useEffect(() => {
    if (!visible) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [visible]);

  if (!visible) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phone.replace(/[\s.-]/g, '');
    if (!clean) {
      setError('Vui lòng nhập số điện thoại.');
      inputRef.current?.focus();
      return;
    }
    if (!PHONE_REGEX.test(clean)) {
      setError('Số điện thoại chưa đúng (ví dụ: 0912 345 678).');
      inputRef.current?.focus();
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      const result = await leadService.submitLead({
        fullName: POPUP_NAME,
        phone: clean,
        email: '',
        product: 'Cần tư vấn thêm',
        preferredTime: 'Bất kỳ thời gian phù hợp',
        notes: 'Khách có voucher Vinhomes, để lại SĐT qua popup. Cần gọi lại tư vấn cách sử dụng voucher.',
        consentAgreed: true,
        pageSource: `Popup Voucher · ${PAGE_LABELS[pathname] ?? pathname}`,
        _hp_company: honeypot,
      });

      if (result.success) {
        setDone(
          result.isDemo
            ? 'Bản demo: số đã được kiểm tra nhưng chưa gửi đến chuyên viên.'
            : 'Chuyên viên sẽ gọi lại Anh/Chị sớm nhất để hướng dẫn sử dụng voucher.'
        );
      } else {
        setError(result.message);
      }
    } catch {
      setError('Không thể kết nối. Anh/Chị vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="popup-backdrop fixed inset-0 z-[60] flex items-center justify-center bg-black/65 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      {/* Thẻ vuông đúng tỉ lệ ảnh, luôn vừa màn hình cả chiều ngang lẫn chiều cao; cỡ chữ bên trong co theo thẻ (cqw) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="phone-popup-title"
        aria-describedby="phone-popup-desc"
        className="popup-card relative isolate aspect-square w-[min(480px,calc(100vw-2rem),calc(100dvh-2rem))] overflow-hidden rounded-[22px] bg-sand shadow-[0_30px_80px_-20px_rgba(0,0,0,.75)] ring-1 ring-champagne/50 [container-type:inline-size]"
      >
        {/* Ảnh chiến dịch phủ toàn thẻ; chữ trong ảnh được nhắc lại ở tiêu đề ẩn + alt cho Google và trình đọc màn hình */}
        <img
          src="/images/popup/co-hoi-cuoi-nam-2026.webp"
          srcSet="/images/popup/co-hoi-cuoi-nam-2026-480.webp 480w, /images/popup/co-hoi-cuoi-nam-2026.webp 800w"
          sizes="(max-width: 512px) calc(100vw - 2rem), 480px"
          width={800}
          height={800}
          alt="Cơ hội cuối năm 2026 – Chốt ngay giữ đặc quyền tại Vinhomes Hai Van Bay cùng MICC Group và NexMe, phối cảnh khu biệt thự đồi ven biển"
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <h2 id="phone-popup-title" className="sr-only">
          Cơ hội cuối năm 2026 – Chốt ngay giữ đặc quyền
        </h2>

        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Đóng"
          className="absolute top-[2.4cqw] right-[2.4cqw] z-10 grid h-[max(30px,7.5cqw)] w-[max(30px,7.5cqw)] place-items-center rounded-full bg-white/35 text-forest-dark ring-1 ring-white/60 backdrop-blur-sm transition hover:bg-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
        >
          <X className="h-[max(14px,3.6cqw)] w-[max(14px,3.6cqw)]" strokeWidth={1.75} aria-hidden="true" />
        </button>

        {/* Vùng phong cảnh bên dưới dòng "Chốt ngay giữ đặc quyền": thẻ form căn giữa theo chiều dọc vùng này */}
        <div className="absolute inset-x-[9%] top-[46%] bottom-[5%] flex items-center">
        {/* Thẻ kính xanh rừng viền vàng champagne (tông của vé vàng trong ảnh) */}
        <div className="popup-panel relative w-full rounded-[3.6cqw] bg-gradient-to-b from-forest-dark/80 to-forest-dark/90 p-[max(4px,1cqw)] shadow-[0_24px_50px_-18px_rgba(0,0,0,.75)] ring-1 ring-champagne/60 backdrop-blur-md">
          <div className="relative rounded-[2.8cqw] border border-champagne/25 px-[max(12px,3.6cqw)] pt-[max(10px,2.8cqw)] pb-[max(10px,2.4cqw)] text-center">
            {/* Viên kim cương nhỏ đính trên mép thẻ */}
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-0 h-[max(8px,2cqw)] w-[max(8px,2cqw)] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gradient-to-br from-[#f3dfb2] to-champagne-hover ring-[3px] ring-forest-dark"
            />

            {done ? (
              <div className="popup-fade-in py-[1cqw]" role="status">
                <p className="flex items-center justify-center gap-[1.5cqw] font-serif text-[max(15px,4.2cqw)] leading-tight text-champagne-light">
                  <CheckCircle2 className="h-[1.05em] w-[1.05em] shrink-0 text-champagne" strokeWidth={1.75} aria-hidden="true" />
                  Đã nhận số của Anh/Chị
                </p>
                <p className="mt-[1.2cqw] text-[max(12px,2.9cqw)] leading-snug text-white/75">{done}</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="gold-btn mt-[2.6cqw] inline-flex h-[max(38px,9cqw)] items-center rounded-full px-[6cqw] text-[max(11px,2.6cqw)] font-bold uppercase tracking-[.16em] text-forest-dark transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Tiếp tục xem dự án
                </button>
              </div>
            ) : (
              <>
                <p
                  id="phone-popup-desc"
                  className="mb-[2.2cqw] font-serif text-[max(13px,3.5cqw)] italic leading-tight text-champagne-light"
                >
                  Để lại số điện thoại để được tư vấn
                </p>

                <form onSubmit={handleSubmit} noValidate>
                  {/* Honeypot chống bot */}
                  <div style={{ display: 'none' }} aria-hidden="true">
                    <input
                      type="text"
                      name="_hp_company"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  <label htmlFor="popup-phone" className="sr-only">Số điện thoại</label>
                  {/* Ô nhập và nút vàng gộp thành một viên thuốc */}
                  <div
                    className={`flex h-[max(42px,10cqw)] items-center rounded-full bg-sand-light p-[max(3px,.8cqw)] ring-1 transition focus-within:ring-2 focus-within:ring-champagne ${
                      error ? 'ring-rose-400' : 'ring-champagne/50'
                    }`}
                  >
                    <input
                      ref={inputRef}
                      id="popup-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Số điện thoại"
                      disabled={submitting}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? 'popup-phone-error' : undefined}
                      className="h-full min-w-0 flex-1 bg-transparent pl-[max(14px,3.6cqw)] pr-2 text-base tracking-wide text-forest-dark placeholder:text-ink-light focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="gold-btn cta-shine relative flex h-full shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full px-[max(14px,4cqw)] text-[max(11px,2.6cqw)] font-bold uppercase tracking-[.14em] text-forest-dark transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                          Đang gửi
                        </>
                      ) : (
                        'Nhận tư vấn'
                      )}
                    </button>
                  </div>
                  {error && (
                    <p id="popup-phone-error" className="mt-[1.4cqw] text-[max(11px,2.6cqw)] font-medium text-rose-300" role="alert">
                      {error}
                    </p>
                  )}
                </form>

              </>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

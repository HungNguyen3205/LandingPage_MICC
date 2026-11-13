import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Loader2, ShieldCheck, Ticket, X } from 'lucide-react';
import { leadService } from '../services/consultationService';

/** Popup voucher chỉ xin số điện thoại. Lead đi chung đường /api/consultation → Telegram + Google Sheet. */

const SHOW_DELAY_MS = 600; // vào web là hiện (chờ một nhịp cho trang kịp hiện)
// Chỉ lưu cờ đã xem / đã gửi, không lưu số điện thoại của khách
const SEEN_KEY = 'micc_phone_popup_seen';
const DONE_KEY = 'micc_phone_popup_done';
const HIDDEN_ON = ['/dang-ky-thanh-cong', '/chinh-sach-bao-mat'];
const PHONE_REGEX = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

// Các backend đều bắt buộc họ tên ≥ 2 ký tự: dùng tên tạm để Telegram/Sheet nhận ra lead voucher từ popup
const POPUP_NAME = '🎫 Khách có voucher';
const PAGE_LABELS: Record<string, string> = { '/': 'Trang chủ', '/lien-he': 'Trang liên hệ' };

const safeGet = (store: 'local' | 'session', key: string) => {
  try {
    return (store === 'local' ? localStorage : sessionStorage).getItem(key);
  } catch {
    return null;
  }
};
const safeSet = (store: 'local' | 'session', key: string) => {
  try {
    (store === 'local' ? localStorage : sessionStorage).setItem(key, '1');
  } catch {
    /* trình duyệt chặn storage: bỏ qua */
  }
};

export const PhonePopup: React.FC = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hiddenHere = HIDDEN_ON.includes(pathname);

  // Hiện ngay khi vào web, mỗi phiên một lần; khách đã gửi rồi thì không hiện lại
  useEffect(() => {
    if (hiddenHere || safeGet('local', DONE_KEY) || safeGet('session', SEEN_KEY)) return;
    const timer = window.setTimeout(() => {
      setOpen(true);
      safeSet('session', SEEN_KEY);
    }, SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [hiddenHere]);

  // Chuyển sang trang thành công / chính sách thì ẩn luôn
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
        safeSet('local', DONE_KEY);
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
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="phone-popup-title"
        className="popup-card relative isolate w-full max-w-[400px] overflow-hidden rounded-[22px] shadow-[0_30px_80px_-20px_rgba(0,0,0,.7)] ring-1 ring-champagne/40"
      >
        {/* Nền: ảnh Làng Vân (đã tải sẵn ở hero) phủ lớp xanh rừng chuyển sắc */}
        <img
          src="/images/lang-van/hero-bg.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-top"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-dark/55 via-forest-dark/85 to-forest-dark"
        />

        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Đóng"
          className="absolute top-3 right-3 z-10 rounded-full bg-black/30 p-2 text-white/85 backdrop-blur transition hover:bg-black/50 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="px-6 pt-10 pb-6 text-center text-white sm:px-8">
          {done ? (
            <div className="py-6" role="status">
              <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-champagne" aria-hidden="true" />
              <p className="font-serif text-2xl mb-2">Đã nhận số của Anh/Chị</p>
              <p className="text-sm text-white/80 leading-relaxed">{done}</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-7 w-full rounded-full bg-champagne py-3.5 text-sm font-semibold text-forest-dark transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Tiếp tục xem dự án
              </button>
            </div>
          ) : (
            <>
              {/* Vé voucher */}
              <div className="voucher-ticket relative mx-auto mb-5 flex w-fit items-center gap-2 rounded-lg bg-gradient-to-r from-[#e9cf9a] via-champagne to-[#e9cf9a] px-5 py-2.5 shadow-[0_8px_24px_-8px_rgba(0,0,0,.6)] ring-1 ring-white/40">
                <Ticket className="h-4 w-4 text-forest-dark" aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-[.24em] text-forest-dark">Voucher Vinhomes</span>
              </div>

              <h2 id="phone-popup-title" className="font-serif text-[28px] leading-tight sm:text-[32px] mb-1">
                Anh/Chị đã có voucher
              </h2>
              <p className="font-['Great_Vibes',cursive] text-[40px] leading-none text-champagne drop-shadow mb-4">
                Tận dụng ngay!
              </p>
              <p className="mx-auto mb-6 max-w-[300px] text-sm leading-relaxed text-white/80">
                Để lại số điện thoại, chuyên viên sẽ gọi lại hướng dẫn cách dùng voucher cho căn phù hợp tại Làng Vân.
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
                  placeholder="Nhập số điện thoại của Anh/Chị"
                  disabled={submitting}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'popup-phone-error' : undefined}
                  className={`w-full rounded-full border bg-white/95 px-5 py-3.5 text-center text-base text-forest-dark tracking-wide placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-champagne ${
                    error ? 'border-rose-400' : 'border-transparent'
                  }`}
                />
                {error && (
                  <p id="popup-phone-error" className="mt-2 text-xs text-rose-300" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="cta-shine relative mt-3 flex overflow-hidden w-full items-center justify-center gap-2 rounded-full bg-champagne py-3.5 text-sm sm:text-base font-semibold tracking-wide text-forest-dark shadow-lg transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Đang gửi...
                    </>
                  ) : (
                    'Nhận tư vấn voucher'
                  )}
                </button>
              </form>

              <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-white/15 bg-white/10 p-3 text-left backdrop-blur">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-champagne" aria-hidden="true" />
                <p className="text-[12px] leading-relaxed text-white/80">
                  <strong className="font-semibold text-white">Cam kết bảo mật thông tin khách hàng.</strong>{' '}
                  Số điện thoại chỉ dùng để chuyên viên liên hệ tư vấn, tuyệt đối không chia sẻ cho bên thứ ba.{' '}
                  <Link
                    to="/chinh-sach-bao-mat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-champagne underline underline-offset-2 hover:text-white"
                  >
                    Chính sách bảo mật
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

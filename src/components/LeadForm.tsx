import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { ConsultationFormData } from '../types';
import { leadService } from '../services/consultationService';
import { Send, AlertCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface LeadFormProps {
  preSelectedProduct?: string;
  variant?: 'contact-page' | 'home-dark';
  onSuccessRedirect?: boolean;
}

export const LeadForm: React.FC<LeadFormProps> = ({
  preSelectedProduct = 'Cần tư vấn thêm',
  variant = 'contact-page',
  onSuccessRedirect = true,
}) => {
  const navigate = useNavigate();
  const [isDemoMode, setIsDemoMode] = useState<boolean>(
    import.meta.env.VITE_ENABLE_DEMO_MODE === 'true'
  );

  const [formData, setFormData] = useState<ConsultationFormData>({
    fullName: '',
    phone: '',
    email: '',
    product: preSelectedProduct,
    preferredTime: 'Bất kỳ thời gian phù hợp',
    notes: '',
    consentAgreed: false,
    _hp_company: '', // Honeypot field chống bot tự động
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ConsultationFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'demo' | 'success' | 'error';
    text: string;
  } | null>(null);

  // Focus refs for the first invalid input
  const fullNameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);

  // Sync prop changes during render without useEffect
  const [prevProduct, setPrevProduct] = useState(preSelectedProduct);
  if (preSelectedProduct && preSelectedProduct !== prevProduct) {
    setPrevProduct(preSelectedProduct);
    setFormData((prev) => ({
      ...prev,
      product: preSelectedProduct,
    }));
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ConsultationFormData, string>> = {};
    let firstErrorField: React.RefObject<HTMLInputElement | null> | null = null;

    // 1. Họ và tên: trimmed non-empty, Unicode support
    const trimmedName = formData.fullName.trim();
    if (!trimmedName) {
      newErrors.fullName = 'Vui lòng nhập họ và tên của bạn.';
      if (!firstErrorField) firstErrorField = fullNameRef;
    } else if (trimmedName.length < 2) {
      newErrors.fullName = 'Họ và tên cần có ít nhất 2 ký tự.';
      if (!firstErrorField) firstErrorField = fullNameRef;
    }

    // 2. Số điện thoại: flexible, supports VN prefixes and +84
    const cleanPhone = formData.phone.replace(/[\s.-]/g, '');
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    if (!cleanPhone) {
      newErrors.phone = 'Vui lòng cung cấp số điện thoại liên hệ.';
      if (!firstErrorField) firstErrorField = phoneRef;
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ (ví dụ: 0912 345 678 hoặc +84 912 345 678).';
      if (!firstErrorField) firstErrorField = phoneRef;
    }

    // 3. Email (optional, but if provided, must be valid)
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Định dạng email chưa chính xác.';
        if (!firstErrorField) firstErrorField = emailRef;
      }
    }

    // 4. Consent checkbox: mandatory
    if (!formData.consentAgreed) {
      newErrors.consentAgreed = 'Bạn vui lòng xác nhận đồng ý để đơn vị tư vấn liên hệ.';
      if (!firstErrorField) firstErrorField = consentRef;
    }

    setErrors(newErrors);

    // Focus the first invalid field immediately
    if (firstErrorField && firstErrorField.current) {
      firstErrorField.current.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMessage(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await leadService.submitLead(formData);

      if (result.isDemo) {
        setIsDemoMode(true);
        setFeedbackMessage({
          type: 'demo',
          text: result.message || 'Thông tin đã được kiểm tra trên bản demo. Chưa có dữ liệu được gửi đến đơn vị tư vấn.',
        });
      } else if (result.success) {
        setIsDemoMode(false);
        if (onSuccessRedirect) {
          // Chỉ chuyển sang trang thành công sau khi backend xác nhận lưu thành công bền vững
          const regParam = result.registrationCode ? `?ma=${encodeURIComponent(result.registrationCode)}` : '';
          navigate(`/dang-ky-thanh-cong${regParam}`);
        } else {
          setFeedbackMessage({
            type: 'success',
            text: result.message || 'Yêu cầu tư vấn của bạn đã được ghi nhận thành công.',
          });
        }
      } else {
        setFeedbackMessage({
          type: 'error',
          text: result.message || 'Hệ thống tạm thời bận hoặc có lỗi kết nối. Bạn vui lòng thử lại sau ít phút.',
        });
      }
    } catch {
      setFeedbackMessage({
        type: 'error',
        text: 'Không thể kết nối đến máy chủ tiếp nhận. Bạn vui lòng kiểm tra kết nối mạng và thử lại.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    // Notes limit: 1000 chars
    if (name === 'notes' && typeof val === 'string' && val.length > 1000) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    if (errors[name as keyof ConsultationFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const isDark = variant === 'home-dark';

  return (
    <div
      className={`rounded-luxury shadow-card border transition-all ${
        isDark
          ? 'bg-sand text-ink p-7 sm:p-10 border-champagne/30'
          : 'bg-white text-ink p-7 sm:p-10 border-forest/10'
      }`}
    >
      {/* Form Card Header */}
      <div className="border-b border-forest/10 pb-5 mb-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-forest mb-1">
            Đăng ký nhận tư vấn
          </h2>
          <p className="text-ink-muted text-xs sm:text-[13px]">
            Các trường có dấu <span className="text-rose-600 font-semibold">*</span> là bắt buộc.
          </p>
        </div>

        {/* Demo Mode Badge */}
        {isDemoMode && (
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Form đang ở chế độ demo</span>
          </div>
        )}
      </div>

      {/* Inline Feedback / Status Message */}
      {feedbackMessage && (
        <div
          className={`mb-6 p-4 rounded border text-sm flex items-start space-x-3 transition-all ${
            feedbackMessage.type === 'demo'
              ? 'bg-amber-50/90 border-amber-300 text-amber-900'
              : feedbackMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
          role="alert"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-champagne" />
          <div className="flex-grow">
            <p className="font-medium text-sm leading-snug">{feedbackMessage.text}</p>
            {feedbackMessage.type === 'demo' && (
              <p className="text-xs text-amber-800/85 mt-1">
                Dữ liệu đã được kiểm tra tính hợp lệ trên giao diện. Khi kích hoạt máy chủ chính thức, thông tin sẽ được chuyển tiếp an toàn qua backend.
              </p>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Hidden Honeypot Field (Chống bot spam tự động) */}
        <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
          <label htmlFor="field-_hp_company">Website Company</label>
          <input
            type="text"
            id="field-_hp_company"
            name="_hp_company"
            tabIndex={-1}
            autoComplete="off"
            value={formData._hp_company || ''}
            onChange={handleChange}
          />
        </div>

        {/* Row 1: Họ và tên * & Số điện thoại * */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="field-fullName"
              className="block text-xs font-semibold text-forest uppercase tracking-wider mb-2"
            >
              Họ và tên <span className="text-rose-600">*</span>
            </label>
            <input
              ref={fullNameRef}
              type="text"
              id="field-fullName"
              name="fullName"
              autoComplete="name"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Ví dụ: Nguyễn An Nhiên"
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded bg-white border text-sm text-forest placeholder:text-ink-muted/40 focus:outline-none focus:ring-2 focus:ring-champagne transition-colors ${
                errors.fullName ? 'border-rose-400 bg-rose-50/20' : 'border-forest/15'
              }`}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? 'error-fullName' : undefined}
            />
            {errors.fullName && (
              <p id="error-fullName" className="text-xs text-rose-600 mt-1.5 flex items-center">
                <span className="w-1 h-1 rounded-full bg-rose-600 mr-1.5" />
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="field-phone"
              className="block text-xs font-semibold text-forest uppercase tracking-wider mb-2"
            >
              Số điện thoại <span className="text-rose-600">*</span>
            </label>
            <input
              ref={phoneRef}
              type="tel"
              id="field-phone"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ví dụ: 0912 345 678"
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded bg-white border text-sm text-forest placeholder:text-ink-muted/40 focus:outline-none focus:ring-2 focus:ring-champagne transition-colors ${
                errors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-forest/15'
              }`}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'error-phone' : undefined}
            />
            {errors.phone && (
              <p id="error-phone" className="text-xs text-rose-600 mt-1.5 flex items-center">
                <span className="w-1 h-1 rounded-full bg-rose-600 mr-1.5" />
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Email & Sản phẩm quan tâm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Email */}
          <div>
            <label
              htmlFor="field-email"
              className="block text-xs font-semibold text-forest uppercase tracking-wider mb-2"
            >
              Email <span className="text-ink-muted font-normal text-[11px]">(Không bắt buộc)</span>
            </label>
            <input
              ref={emailRef}
              type="email"
              id="field-email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="dia-chi@email.vn"
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded bg-white border text-sm text-forest placeholder:text-ink-muted/40 focus:outline-none focus:ring-2 focus:ring-champagne transition-colors ${
                errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-forest/15'
              }`}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'error-email' : undefined}
            />
            {errors.email && (
              <p id="error-email" className="text-xs text-rose-600 mt-1.5 flex items-center">
                <span className="w-1 h-1 rounded-full bg-rose-600 mr-1.5" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Interested Product */}
          <div>
            <label
              htmlFor="field-product"
              className="block text-xs font-semibold text-forest uppercase tracking-wider mb-2"
            >
              Sản phẩm quan tâm
            </label>
            <select
              id="field-product"
              name="product"
              value={formData.product}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded bg-white border border-forest/15 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-champagne transition-colors cursor-pointer"
            >
              <option value="Cần tư vấn thêm">Cần tư vấn thêm / Tìm hiểu chung</option>
              <option value="Biệt Thự Đơn Lập (Lâm Phong)">Biệt Thự Đơn Lập (Lâm Phong - Từ 18,1 tỷ)</option>
              <option value="Biệt Thự Song Lập (Bạch Vân)">Biệt Thự Song Lập (Bạch Vân - Từ 9,1 tỷ)</option>
              <option value="Nhà Phố Liền Kề (Hồng Châu & Ánh Ngọc)">Nhà Phố Liền Kề (Hồng Châu & Ánh Ngọc - Từ 7,3 tỷ)</option>
              <option value="Shophouse & Căn Hộ">Shophouse & Căn Hộ Nghỉ Dưỡng</option>
            </select>
          </div>
        </div>

        {/* Row 3: Thời gian liên hệ mong muốn */}
        <div>
          <label
            htmlFor="field-preferredTime"
            className="block text-xs font-semibold text-forest uppercase tracking-wider mb-2"
          >
            Thời gian liên hệ mong muốn
          </label>
          <select
            id="field-preferredTime"
            name="preferredTime"
            value={formData.preferredTime}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full px-4 py-3 rounded bg-white border border-forest/15 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-champagne transition-colors cursor-pointer"
          >
            <option value="Bất kỳ thời gian phù hợp">Bất kỳ thời gian phù hợp (08:30 – 20:30)</option>
            <option value="Buổi sáng">Buổi sáng (08:30 – 11:30)</option>
            <option value="Buổi chiều">Buổi chiều (13:30 – 17:30)</option>
            <option value="Buổi tối">Buổi tối (18:00 – 20:30)</option>
          </select>
        </div>

        {/* Row 4: Nội dung cần tư vấn (max 1,000 chars) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="field-notes"
              className="block text-xs font-semibold text-forest uppercase tracking-wider"
            >
              Nội dung cần tư vấn
            </label>
            <span className="text-[11px] font-mono text-ink-muted">
              {formData.notes.length}/1.000 ký tự
            </span>
          </div>
          <textarea
            id="field-notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            placeholder="Bạn có mong muốn cụ thể nào về hướng căn, tầm nhìn, phân khúc ngân sách hoặc hình thức trao đổi..."
            disabled={isSubmitting}
            maxLength={1000}
            className="w-full px-4 py-3 rounded bg-white border border-forest/15 text-sm text-forest placeholder:text-ink-muted/40 focus:outline-none focus:ring-2 focus:ring-champagne transition-colors resize-none"
          />
        </div>

        {/* Row 5: Consent Checkbox & Privacy Link */}
        <div className="pt-2">
          <label className="flex items-start space-x-3 cursor-pointer group">
            <input
              ref={consentRef}
              type="checkbox"
              id="field-consentAgreed"
              name="consentAgreed"
              checked={formData.consentAgreed}
              onChange={handleChange}
              disabled={isSubmitting}
              className="mt-1 w-4 h-4 rounded border-forest/30 text-forest focus:ring-champagne cursor-pointer"
            />
            <span className="text-xs text-ink-muted leading-relaxed group-hover:text-forest transition-colors">
              Tôi đồng ý để đơn vị tư vấn sử dụng thông tin trên nhằm liên hệ về nhu cầu đã đăng ký.{' '}
              <span className="text-rose-600">*</span>{' '}
              <Link
                to="/chinh-sach-bao-mat"
                className="text-forest hover:text-champagne font-medium underline underline-offset-2 ml-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Xem chính sách bảo mật
              </Link>
            </span>
          </label>
          {errors.consentAgreed && (
            <p className="text-xs text-rose-600 mt-1.5 flex items-center">
              <span className="w-1 h-1 rounded-full bg-rose-600 mr-1.5" />
              {errors.consentAgreed}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-luxury bg-forest hover:bg-forest-light text-white font-medium text-sm sm:text-base tracking-wide transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne disabled:opacity-60 disabled:cursor-not-allowed group active:scale-[0.99]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-champagne" />
                <span>Đang xử lý thông tin...</span>
              </>
            ) : isDemoMode ? (
              <>
                <span>Xem thử đăng ký</span>
                <ArrowRight className="w-4 h-4 text-champagne transition-transform group-hover:translate-x-1" />
              </>
            ) : (
              <>
                <span>Đăng ký nhận tư vấn</span>
                <Send className="w-4 h-4 text-champagne transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

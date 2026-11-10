import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck, Copy, Check } from 'lucide-react';

export const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const registrationCode = searchParams.get('ma') || '';
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Đăng Ký Thành Công | VINHOMES Luxury Residences';
  }, []);

  const handleCopyCode = () => {
    if (!registrationCode) return;
    navigator.clipboard.writeText(registrationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-24 lg:pt-32 pb-24 bg-sand min-h-screen flex items-center justify-center">
      <div className="max-w-xl mx-auto px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-forest text-champagne flex items-center justify-center mx-auto mb-6 shadow-card border border-champagne/30">
          <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
        </div>

        <span className="text-champagne font-mono text-xs tracking-widest uppercase block mb-2">
          YÊU CẦU ĐÃ ĐƯỢC TIẾP NHẬN BỀN VỮNG
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-forest mb-4">
          Cảm ơn bạn đã kết nối cùng Vinhomes
        </h1>

        <p className="text-ink-muted text-sm sm:text-base leading-relaxed mb-6 font-light">
          Hệ thống đã ghi nhận thông tin đăng ký tư vấn của bạn vào danh sách hỗ trợ chính thức. Chuyên viên tư vấn sẽ liên hệ theo đúng khung giờ và sản phẩm bạn quan tâm.
        </p>

        {/* Display Registration Code if provided */}
        {registrationCode && (
          <div className="mb-8 p-4 bg-white rounded-luxury border border-forest/10 shadow-subtle inline-block max-w-sm w-full mx-auto">
            <div className="text-[11px] font-mono uppercase tracking-wider text-ink-muted mb-1 flex items-center justify-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-champagne" />
              <span>Mã tiếp nhận hồ sơ tư vấn</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="font-mono text-base font-semibold text-forest tracking-wider">
                {registrationCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-1 rounded text-ink-muted hover:text-forest transition-colors"
                title="Sao chép mã đăng ký"
                aria-label="Sao chép mã đăng ký"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-ink-muted/80 mt-1">
              Bạn có thể lưu mã này để đối chiếu khi chuyên viên liên hệ hỗ trợ.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-luxury bg-forest hover:bg-forest-light text-white text-sm font-medium tracking-wide transition-colors"
          >
            <span>Trở về Trang chủ</span>
            <ArrowRight className="w-4 h-4 ml-2 text-champagne" />
          </Link>
          <Link
            to="/lien-he"
            className="inline-flex items-center justify-center px-6 py-3 rounded-luxury bg-white border border-forest/15 hover:border-forest/30 text-forest text-sm font-medium tracking-wide transition-colors"
          >
            <span>Gửi thêm yêu cầu khác</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;

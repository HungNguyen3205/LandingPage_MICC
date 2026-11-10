import React from 'react';
import { LeadForm } from './LeadForm';
import { ShieldCheck, CheckCircle2, Info } from 'lucide-react';

interface ConsultationFormProps {
  preSelectedProduct?: string;
}

export const ConsultationForm: React.FC<ConsultationFormProps> = ({ preSelectedProduct }) => {
  return (
    <section id="lien-he" className="py-20 lg:py-28 bg-forest text-white relative overflow-hidden">
      {/* Decorative ambient elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-champagne/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-forest-light/30 blur-3xl pointer-events-none" />

      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left Column: Invitation and Brand Promise (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between pt-2">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest-light/60 border border-champagne/30 text-champagne text-xs font-mono tracking-widest uppercase mb-4">
                <span>07 / ĐĂNG KÝ TƯ VẤN</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-normal text-white leading-[1.2] tracking-tight mb-6">
                Bắt đầu câu chuyện sống của riêng bạn.
              </h2>

              <p className="text-sand/85 text-base leading-relaxed mb-8 font-light">
                Mỗi căn biệt thự và căn hộ tại Vinhomes là một tuyệt tác được tạo tác riêng cho gia chủ yêu chuộng chuẩn mực sống thượng lưu và an nhiên. Đội ngũ tư vấn sẽ gửi đến quý khách trọn bộ tài liệu độc quyền và hỗ trợ giải đáp mọi thắc mắc chu đáo nhất.
              </p>

              {/* Trust & Privacy Points */}
              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex items-start space-x-3 text-sm text-sand/90">
                  <ShieldCheck className="w-5 h-5 text-champagne shrink-0 mt-0.5" />
                  <span>Cam kết bảo mật tuyệt đối thông tin cá nhân của quý khách.</span>
                </div>
                <div className="flex items-start space-x-3 text-sm text-sand/90">
                  <CheckCircle2 className="w-5 h-5 text-champagne shrink-0 mt-0.5" />
                  <span>Tài liệu thông số thiết kế, mặt bằng và định hướng sản phẩm gửi trực tiếp.</span>
                </div>
              </div>
            </div>

            {/* Architecture note for future integration */}
            <div className="mt-10 p-4 rounded-luxury bg-forest-dark/80 border border-champagne/20 text-xs text-sand/75 space-y-1.5">
              <div className="flex items-center space-x-2 text-champagne font-mono font-medium">
                <Info className="w-4 h-4 shrink-0" />
                <span>Kiến trúc tích hợp sẵn sàng:</span>
              </div>
              <p>
                Service layer độc lập, bảo vệ Bot Token an toàn qua Serverless/Webhook và tương thích lưu trữ tự động Google Sheets.
              </p>
            </div>
          </div>

          {/* Right Column: Reusable LeadForm component (7 cols) */}
          <div className="lg:col-span-7">
            <LeadForm
              preSelectedProduct={preSelectedProduct}
              variant="home-dark"
              onSuccessRedirect={false}
            />
          </div>

        </div>
      </div>
    </section>
  );
};

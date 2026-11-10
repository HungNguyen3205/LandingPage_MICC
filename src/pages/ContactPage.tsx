import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { contactConfig, sanitizeProductQueryParam } from '../data/projectData';
import { LeadForm } from '../components/LeadForm';
import {
  ChevronRight,
  Sparkles,
  Building2,
  Phone,
  Mail,
  MapPin,
  ClipboardList,
  UserCheck,
  Compass
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  // Whitelist-validated query parameter handling (?san-pham=ocean-villa, etc.)
  const rawProductParam = searchParams.get('san-pham') || searchParams.get('product');
  const preSelectedProduct = sanitizeProductQueryParam(rawProductParam);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Liên Hệ & Đăng Ký Tư Vấn | VINHOMES Luxury Residences';

    // Meta description update
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      'Liên hệ và đăng ký nhận tư vấn dự án bất động sản cao cấp Vinhomes. Chia sẻ nhu cầu của bạn để nhận thông tin phù hợp về không gian sống và các bộ sưu tập.'
    );
  }, []);

  // Helper to render contact info or graceful missing notice
  const renderInfoItem = (value: string | undefined, placeholderText = 'Thông tin liên hệ chính thức sẽ được cập nhật') => {
    if (value && value.trim() !== '') {
      return <span className="font-medium text-forest">{value}</span>;
    }
    return (
      <span className="text-xs text-ink-muted italic bg-sand px-2.5 py-1 rounded border border-forest/10 inline-block">
        {placeholderText}
      </span>
    );
  };

  return (
    <div className="flex-grow pt-20 lg:pt-24 bg-sand">

      {/* 2. Opening Section: Compact Header & Breadcrumbs (Not pushing form too deep) */}
      <section className="pt-6 sm:pt-8 pb-10 sm:pb-12 border-b border-forest/10 relative overflow-hidden bg-sand">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav aria-label="Đường dẫn trang" className="flex items-center space-x-2 text-xs text-ink-muted mb-6 font-mono">
            <Link to="/" className="hover:text-forest transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-champagne" />
            <span className="text-forest font-medium">Liên hệ</span>
          </nav>

          <div className="max-w-3xl">
            {/* Small Label */}
            <div className="inline-flex items-center space-x-2 text-champagne text-xs font-mono tracking-[0.25em] uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LET’S START A CONVERSATION</span>
            </div>

            {/* H1 Title: Elegantly broken into 2 lines */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[46px] font-normal text-forest leading-[1.2] tracking-tight mb-4">
              Kết nối hôm nay. <br />
              <span className="text-forest-light font-serif">Mở lối không gian sống.</span>
            </h1>

            {/* Description */}
            <p className="text-ink-muted text-base sm:text-lg leading-relaxed max-w-2xl">
              Chia sẻ nhu cầu của bạn để nhận thông tin phù hợp về không gian sống và các bộ sưu tập tại Vinhomes.
            </p>

            {/* Minimalist Champagne Accent Line */}
            <div className="w-20 h-[1.5px] bg-champagne mt-6" />
          </div>

        </div>
      </section>

      {/* 3. Main Contact Area: 2 Columns (40/60 on Desktop, 1 Column on Mobile) */}
      <section className="py-12 sm:py-16 lg:py-20 bg-sand">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

            {/* Column 1: Information (~40% on desktop: 5 of 12 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8 order-2 lg:order-1">

              <div>
                <span className="text-champagne text-xs font-semibold tracking-[0.2em] uppercase block mb-2 font-mono">
                  TƯ VẤN RIÊNG CHO BẠN
                </span>

                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-forest leading-[1.25] mb-4">
                  Một cuộc trò chuyện. <br />
                  Một lựa chọn phù hợp.
                </h2>

                <p className="text-ink-muted text-sm sm:text-[15px] leading-relaxed mb-6 font-light">
                  Mỗi yêu cầu đăng ký được tiếp nhận chu đáo bởi đội ngũ tư vấn am hiểu sâu sắc về kiến trúc, cảnh quan và phong cách sống tại Vinhomes, đảm bảo cung cấp giải pháp an cư và đầu tư tối ưu nhất.
                </p>

                {/* Contact Information Lines (Truthful data only, graceful placeholder when unconfigured) */}
                <div className="bg-white p-6 rounded-luxury border border-forest/10 shadow-subtle space-y-4">

                  {/* Advisor Unit */}
                  <div className="flex items-start space-x-3.5 pb-3.5 border-b border-forest/5">
                    <div className="w-8 h-8 rounded-full bg-sand flex items-center justify-center text-champagne shrink-0 mt-0.5">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-xs sm:text-sm">
                      <span className="text-ink-muted text-[11px] uppercase tracking-wider font-medium">
                        Đơn vị tư vấn
                      </span>
                      {renderInfoItem(contactConfig.advisorUnit)}
                    </div>
                  </div>

                  {/* Hotline */}
                  <div className="flex items-start space-x-3.5 pb-3.5 border-b border-forest/5">
                    <div className="w-8 h-8 rounded-full bg-sand flex items-center justify-center text-champagne shrink-0 mt-0.5">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-xs sm:text-sm">
                      <span className="text-ink-muted text-[11px] uppercase tracking-wider font-medium">
                        Hotline tư vấn
                      </span>
                      {renderInfoItem(contactConfig.hotline)}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-3.5 pb-3.5 border-b border-forest/5">
                    <div className="w-8 h-8 rounded-full bg-sand flex items-center justify-center text-champagne shrink-0 mt-0.5">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-xs sm:text-sm">
                      <span className="text-ink-muted text-[11px] uppercase tracking-wider font-medium">
                        Email liên hệ
                      </span>
                      {renderInfoItem(contactConfig.email)}
                    </div>
                  </div>

                  {/* Office Address */}
                  <div className="flex items-start space-x-3.5">
                    <div className="w-8 h-8 rounded-full bg-sand flex items-center justify-center text-champagne shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-xs sm:text-sm">
                      <span className="text-ink-muted text-[11px] uppercase tracking-wider font-medium">
                        Văn phòng giới thiệu
                      </span>
                      {renderInfoItem(contactConfig.officeAddress)}
                    </div>
                  </div>

                </div>
              </div>

              {/* High-End Architectural Photo (Harmonious with Homepage) */}
              <div className="rounded-luxury overflow-hidden border border-forest/10 shadow-card aspect-[16/11] relative group">
                <img
                  src="/images/micc-nexme.webp"
                  alt="Không gian kiến trúc mở sang trọng tại Vinhomes"
                  loading="lazy"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-5 right-5 text-white pointer-events-none">
                  <span className="text-[10px] font-mono tracking-widest text-champagne uppercase block">
                    VINHOMES LIFESTYLE
                  </span>
                  <span className="font-serif text-sm sm:text-base font-light">
                    Không gian nghỉ dưỡng đón ánh sáng tự nhiên
                  </span>
                </div>
              </div>

            </div>

            {/* Column 2: Lead Form (~60% on desktop: 7 of 12 cols, prioritized first on mobile) */}
            <div className="lg:col-span-7 order-1 lg:order-2" id="form-container">
              <LeadForm
                preSelectedProduct={preSelectedProduct}
                variant="contact-page"
                onSuccessRedirect={false}
              />
            </div>

          </div>

        </div>
      </section>

      {/* 7. Process Explanation Section: 3 Lightweight Steps */}
      <section className="py-16 sm:py-20 bg-[#F4F1E8] border-t border-forest/10">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">

          <div className="max-w-xl mx-auto text-center mb-12 sm:mb-16">
            <span className="text-champagne text-xs font-semibold tracking-[0.25em] uppercase font-mono block mb-2">
              QUY TRÌNH TIẾP NHẬN
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-forest tracking-tight">
              3 Bước Đồng Hành Cùng Bạn
            </h2>
            <p className="text-ink-muted text-xs sm:text-sm mt-2">
              Hành trình tinh gọn, bảo mật và chú trọng đúng mong muốn của từng khách hàng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">

            {/* Step 1 */}
            <div className="bg-white p-6 sm:p-7 rounded-luxury border border-forest/10 shadow-subtle flex flex-col items-start relative group">
              <div className="w-10 h-10 rounded-full bg-forest text-champagne flex items-center justify-center font-serif text-base font-semibold mb-4 shadow-sm">
                1
              </div>
              <div className="flex items-center space-x-2 text-forest font-serif text-lg font-medium mb-2">
                <ClipboardList className="w-4 h-4 text-champagne" />
                <h3>Chia sẻ nhu cầu</h3>
              </div>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-light">
                Điền thông tin về mong muốn không gian, dòng sản phẩm quan tâm và khung giờ thuận tiện để chuyên viên liên hệ.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 sm:p-7 rounded-luxury border border-forest/10 shadow-subtle flex flex-col items-start relative group">
              <div className="w-10 h-10 rounded-full bg-forest text-champagne flex items-center justify-center font-serif text-base font-semibold mb-4 shadow-sm">
                2
              </div>
              <div className="flex items-center space-x-2 text-forest font-serif text-lg font-medium mb-2">
                <UserCheck className="w-4 h-4 text-champagne" />
                <h3>Tiếp nhận thông tin</h3>
              </div>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-light">
                Hệ thống ghi nhận nhu cầu, chuyên viên phụ trách chuẩn bị trọn bộ tài liệu thiết kế, mặt bằng và bảng thông số tương ứng.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 sm:p-7 rounded-luxury border border-forest/10 shadow-subtle flex flex-col items-start relative group">
              <div className="w-10 h-10 rounded-full bg-forest text-champagne flex items-center justify-center font-serif text-base font-semibold mb-4 shadow-sm">
                3
              </div>
              <div className="flex items-center space-x-2 text-forest font-serif text-lg font-medium mb-2">
                <Compass className="w-4 h-4 text-champagne" />
                <h3>Tư vấn lựa chọn phù hợp</h3>
              </div>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-light">
                Chuyên viên trực tiếp giải đáp thắc mắc, phân tích phương án tối ưu và hỗ trợ bạn trong suốt quá trình tìm hiểu dự án.
              </p>
            </div>

          </div>

          <div className="mt-10 text-center">
            <p className="text-[11px] text-ink-muted/80 italic">
              * Thời gian trao đổi cụ thể sẽ được chuyên viên xác nhận trực tiếp khi liên hệ nhằm phù hợp với lịch trình cá nhân của bạn.
            </p>
          </div>

        </div>
      </section>

      {/* 8. Map Section: Strictly conditioned.
          Omitted completely when no real address/coordinates are configured */}
      {contactConfig.officialMapEmbedUrl && (
        <section className="py-12 bg-sand border-t border-forest/10">
          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="font-serif text-xl font-medium text-forest mb-4">Vị trí thực tế</h3>
            <div className="rounded-luxury overflow-hidden border border-forest/10 shadow-subtle aspect-[16/9]">
              <iframe
                title="Bản đồ vị trí văn phòng Vinhomes"
                src={contactConfig.officialMapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default ContactPage;

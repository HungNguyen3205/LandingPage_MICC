import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronDown, ArrowLeft, ShieldAlert } from 'lucide-react';
import { projectMeta, contactConfig, privacyPolicyConfig } from '../data/projectData';

interface SectionItem {
  id: string;
  number: string;
  title: string;
}

const POLICY_SECTIONS: SectionItem[] = [
  { id: 'pham-vi-ap-dung', number: '1', title: 'Phạm vi áp dụng' },
  { id: 'thong-tin-tiep-nhan', number: '2', title: 'Thông tin được tiếp nhận' },
  { id: 'muc-dich-su-dung', number: '3', title: 'Mục đích sử dụng' },
  { id: 'luong-xu-ly-du-kien', number: '4', title: 'Luồng xử lý dự kiến' },
  { id: 'luu-tru-bao-ve', number: '5', title: 'Lưu trữ và bảo vệ dữ liệu' },
  { id: 'quyen-nguoi-dung', number: '6', title: 'Yêu cầu của người dùng' },
  { id: 'cookie-do-luong', number: '7', title: 'Cookie và công cụ đo lường' },
  { id: 'cap-nhat-chinh-sach', number: '8', title: 'Cập nhật chính sách' },
];

export const PrivacyPolicyPage: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('pham-vi-ap-dung');
  const [isMobileTocOpen, setIsMobileTocOpen] = useState<boolean>(false);

  useEffect(() => {
    document.title = 'Chính Sách Bảo Mật | VINHOMES Luxury Residences';

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      'Chính sách bảo mật thông tin khách hàng tại Vinhomes. Minh bạch trong cách tiếp nhận, mục đích sử dụng và luồng xử lý dữ liệu đăng ký tư vấn.'
    );

    // Scroll spy via IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting);
        if (visibleSection) {
          setActiveId(visibleSection.target.id);
        }
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      }
    );

    POLICY_SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    setActiveId(id);
    setIsMobileTocOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeTitle = useMemo(() => {
    return POLICY_SECTIONS.find((s) => s.id === activeId)?.title || 'Mục lục chính sách';
  }, [activeId]);

  return (
    <main className="pt-24 lg:pt-28 pb-24 bg-sand min-h-screen text-ink">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav aria-label="Đường dẫn trang" className="flex items-center space-x-2 text-xs text-ink-muted mb-8 font-mono">
          <Link to="/" className="hover:text-forest transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-champagne" />
          <span className="text-forest font-medium" aria-current="page">
            Chính sách bảo mật
          </span>
        </nav>

        {/* Page Header */}
        <header className="mb-10 pb-8 border-b border-forest/10 max-w-3xl">
          <div className="inline-block px-3 py-1 rounded-full bg-forest/5 border border-forest/10 text-forest text-xs font-mono tracking-widest uppercase mb-4">
            QUYỀN RIÊNG TƯ & MINH BẠCH
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal text-forest leading-[1.2] mb-4">
            Chính sách bảo mật
          </h1>

          <p className="text-ink-muted text-base sm:text-lg leading-relaxed">
            Minh bạch trong cách tiếp nhận và sử dụng thông tin của bạn.
          </p>
        </header>

        {/* Main Layout: Desktop Sidebar TOC (260px) + Main Content (760-840px) */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12 xl:gap-16">

          {/* Mobile TOC (Collapsible Accordion) */}
          <div className="lg:hidden mb-8">
            <div className="bg-white rounded-md border border-forest/15 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left bg-forest/5 hover:bg-forest/10 transition-colors"
                aria-expanded={isMobileTocOpen}
                aria-controls="mobile-toc-list"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-forest font-medium">
                    Mục lục:
                  </span>
                  <span className="text-sm font-serif text-forest truncate max-w-[220px]">
                    {activeTitle}
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-forest/70">
                  <span className="font-mono">8 mục</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isMobileTocOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {isMobileTocOpen && (
                <ul id="mobile-toc-list" className="p-3 space-y-1 bg-white border-t border-forest/10">
                  {POLICY_SECTIONS.map((sec) => {
                    const isActive = activeId === sec.id;
                    return (
                      <li key={sec.id}>
                        <button
                          type="button"
                          onClick={() => scrollToSection(sec.id)}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-baseline space-x-2.5 ${
                            isActive
                              ? 'bg-forest text-white font-medium'
                              : 'text-ink-muted hover:text-forest hover:bg-sand'
                          }`}
                        >
                          <span
                            className={`font-mono text-xs shrink-0 ${
                              isActive ? 'text-champagne' : 'text-champagne/80'
                            }`}
                          >
                            0{sec.number}.
                          </span>
                          <span className="truncate">{sec.title}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Desktop Sticky Sidebar TOC */}
          <aside className="hidden lg:block w-64 xl:w-72 shrink-0 sticky top-28 self-start">
            <div className="bg-white/80 backdrop-blur-sm rounded-luxury border border-forest/10 p-5 shadow-subtle">
              <div className="font-mono text-[11px] uppercase tracking-widest text-forest/70 mb-4 pb-2 border-b border-forest/10">
                Nội dung chính sách
              </div>
              <nav aria-label="Mục lục bài viết" className="space-y-1">
                {POLICY_SECTIONS.map((sec) => {
                  const isActive = activeId === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full text-left px-3 py-2 rounded text-[13px] transition-all flex items-baseline space-x-2.5 group cursor-pointer ${
                        isActive
                          ? 'bg-forest text-white font-medium shadow-xs'
                          : 'text-ink-muted hover:text-forest hover:bg-sand/60'
                      }`}
                    >
                      <span
                        className={`font-mono text-[11px] shrink-0 transition-colors ${
                          isActive ? 'text-champagne' : 'text-champagne/80 group-hover:text-champagne'
                        }`}
                      >
                        0{sec.number}.
                      </span>
                      <span className="leading-snug">{sec.title}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-6 pt-4 border-t border-forest/10 text-[11px] text-ink-muted font-mono">
                Cập nhật: {privacyPolicyConfig.lastUpdatedDate}
              </div>
            </div>
          </aside>

          {/* Main Article Content (Width ~760px - 840px) */}
          <article className="flex-1 max-w-[800px] bg-white rounded-luxury border border-forest/10 shadow-subtle p-6 sm:p-10 lg:p-12 space-y-10 text-[15px] sm:text-base leading-[1.75] text-ink/85">

            {/* Top Mandatory Disclaimer Notice */}
            <div
              role="alert"
              className="bg-amber-50/70 border-l-2 border-champagne p-4 sm:p-5 rounded-r-md flex items-start space-x-3.5 text-xs sm:text-[13px] text-ink-muted leading-relaxed"
            >
              <ShieldAlert className="w-4 h-4 text-champagne shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-forest block mb-1">
                  Thông báo về tính chất tài liệu
                </strong>
                <p>
                  {privacyPolicyConfig.operatorNotice}
                </p>
                <p className="mt-1 text-ink-muted/80 text-[11px]">
                  Văn bản này giải thích quy trình xử lý dữ liệu dự kiến theo thiết kế kỹ thuật của website, không thay thế cho văn bản pháp lý chính thức của chủ đầu tư hay đơn vị phân phối khi dự án chính thức vận hành thương mại.
                </p>
              </div>
            </div>

            {/* Section 1: Phạm vi áp dụng */}
            <section id="pham-vi-ap-dung" className="scroll-mt-28 space-y-3.5">
              <h2 className="font-serif text-xl sm:text-2xl text-forest font-normal flex items-baseline space-x-2">
                <span className="font-mono text-champagne text-base">01.</span>
                <span>Phạm vi áp dụng</span>
              </h2>
              <p>
                Chính sách bảo mật này áp dụng riêng cho các thông tin do người dùng chủ động cung cấp thông qua các biểu mẫu đăng ký nhận tư vấn trên website <strong>{projectMeta.brandName}</strong> (bao gồm form đăng ký tại trang Liên hệ <code className="text-xs bg-sand px-1.5 py-0.5 rounded font-mono text-forest">/lien-he</code> và biểu mẫu tư vấn đặt tại Trang chủ).
              </p>
              <p className="text-ink-muted text-sm">
                Chính sách không áp dụng cho các website, liên kết hoặc dịch vụ của bên thứ ba không thuộc quyền quản lý trực tiếp của Vinhomes.
              </p>
            </section>

            <hr className="border-t border-forest/10" />

            {/* Section 2: Thông tin được tiếp nhận */}
            <section id="thong-tin-tiep-nhan" className="scroll-mt-28 space-y-3.5">
              <h2 className="font-serif text-xl sm:text-2xl text-forest font-normal flex items-baseline space-x-2">
                <span className="font-mono text-champagne text-base">02.</span>
                <span>Thông tin được tiếp nhận</span>
              </h2>
              <p>
                Hệ thống chỉ tiếp nhận các thông tin do người dùng tự nguyện nhập vào biểu mẫu, bao gồm:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-[15px] text-ink-muted">
                <li><strong className="text-ink">Họ và tên</strong> (trường bắt buộc): Phục vụ việc xưng hô và cá nhân hóa quá trình tư vấn.</li>
                <li><strong className="text-ink">Số điện thoại</strong> (trường bắt buộc): Kênh liên lạc trực tiếp để gửi tài liệu và phản hồi nhu cầu.</li>
                <li><strong className="text-ink">Địa chỉ email</strong> (không bắt buộc): Kênh nhận bộ hồ sơ thiết kế hoặc mặt bằng dự án qua thư điện tử.</li>
                <li><strong className="text-ink">Sản phẩm quan tâm</strong>: Lựa chọn trong danh mục (Cần tư vấn thêm / Biệt Thự Đơn Lập Lâm Phong / Biệt Thự Song Lập Bạch Vân / Nhà Phố Liền Kề Hồng Châu & Ánh Ngọc / Shophouse & Căn Hộ).</li>
                <li><strong className="text-ink">Thời gian liên hệ mong muốn</strong>: Khung giờ thuận tiện do người dùng lựa chọn (Bất kỳ / Sáng / Chiều / Tối).</li>
                <li><strong className="text-ink">Nội dung cần tư vấn</strong>: Ghi chú nhu cầu chi tiết (giới hạn tối đa 1.000 ký tự).</li>
                <li><strong className="text-ink">Dữ liệu kỹ thuật phục vụ ghi nhận</strong>: Thời điểm gửi biểu mẫu (timestamp), trang nguồn gửi đăng ký và trạng thái xác nhận đồng ý với điều khoản sử dụng khi hệ thống thực tế có lưu trữ.</li>
              </ul>
              <div className="bg-sand/70 rounded p-3.5 text-xs text-ink-muted border border-forest/10 mt-3">
                <span className="font-medium text-forest block mb-0.5">Cam kết trung thực về việc không thu thập ngầm:</span>
                Mã nguồn website hiện tại không thực hiện các hành vi tự động thu thập địa chỉ IP, nhận diện dấu vân tay thiết bị (device fingerprinting), vị trí tọa độ địa lý hay hành vi cá nhân ngoài những thông tin bạn chủ động điền vào biểu mẫu.
              </div>
            </section>

            <hr className="border-t border-forest/10" />

            {/* Section 3: Mục đích sử dụng */}
            <section id="muc-dich-su-dung" className="scroll-mt-28 space-y-3.5">
              <h2 className="font-serif text-xl sm:text-2xl text-forest font-normal flex items-baseline space-x-2">
                <span className="font-mono text-champagne text-base">03.</span>
                <span>Mục đích sử dụng</span>
              </h2>
              <p>
                Dữ liệu thu thập từ biểu mẫu chỉ được sử dụng cho các mục đích cụ thể sau:
              </p>
              <ol className="list-decimal pl-5 space-y-1.5 text-sm sm:text-[15px] text-ink-muted">
                <li>Tiếp nhận và ghi nhận chính xác nhu cầu tìm hiểu về dự án Vinhomes.</li>
                <li>Chuyên viên tư vấn liên hệ phản hồi, cung cấp thông tin, hình ảnh và giải đáp câu hỏi theo đúng bộ sưu tập và khung thời gian khách hàng đã đăng ký.</li>
                <li>Theo dõi, quản lý tiến độ xử lý yêu cầu tư vấn nhằm đảm bảo quyền lợi và sự chu đáo đối với khách hàng.</li>
              </ol>
              <p className="text-ink-muted text-sm pt-1">
                Website không mặc định người dùng đồng ý nhận các chiến dịch quảng cáo tiếp thị đại trà, và không tự ý chia sẻ dữ liệu cho các bên đối tác tiếp thị bên ngoài cho các mục đích nằm ngoài nhu cầu tư vấn đã đăng ký.
              </p>
            </section>

            <hr className="border-t border-forest/10" />

            {/* Section 4: Luồng xử lý dự kiến */}
            <section id="luong-xu-ly-du-kien" className="scroll-mt-28 space-y-3.5">
              <h2 className="font-serif text-xl sm:text-2xl text-forest font-normal flex items-baseline space-x-2">
                <span className="font-mono text-champagne text-base">04.</span>
                <span>Luồng xử lý dự kiến & Dịch vụ bên thứ ba</span>
              </h2>
              <p>
                Để khách hàng hiểu rõ quy trình kỹ thuật, chúng tôi minh bạch luồng chuyển giao dữ liệu dự kiến:
              </p>
              <div className="space-y-3 text-sm sm:text-[15px] text-ink-muted">
                <p>
                  <strong>1. Khi hệ thống vận hành thực tế được kích hoạt:</strong> Thông tin từ trình duyệt sẽ được gửi qua kết nối mã hóa đến máy chủ backend chuyên dụng. Máy chủ backend sẽ ghi nhận dữ liệu vào bảng tính Google Sheets để đội ngũ quản lý theo dõi và đồng thời gửi thông báo qua Telegram đến chuyên viên phụ trách để kịp thời liên hệ tư vấn.
                </p>
                <p>
                  <strong>2. Về các dịch vụ bên thứ ba:</strong> Google Sheets (do Google LLC cung cấp) và Telegram (do Telegram FZ-LLC cung cấp) là hai nền tảng độc lập. Quyền tiếp cận dữ liệu trên các nền tảng này được giới hạn chặt chẽ, chỉ những cá nhân được đơn vị vận hành cấp quyền nội bộ mới có thể truy cập theo cấu hình thực tế.
                </p>
                <div className="bg-sand p-4 rounded border border-champagne/30 text-xs sm:text-[13px] text-ink-muted">
                  <strong className="text-forest block mb-1">Trạng thái hiện tại trên bản demo:</strong>
                  Website Vinhomes hiện đang hoạt động ở chế độ giới thiệu ý tưởng thiết kế giao diện (demo). Biểu mẫu đăng ký hiện tại <strong>chưa gửi dữ liệu đến Google Sheets, Telegram hay bất kỳ hệ thống lưu trữ bên ngoài nào</strong>. Thông tin điền trong bản demo chỉ phục vụ kiểm tra trải nghiệm người dùng ngay tại trình duyệt.
                </div>
              </div>
            </section>

            <hr className="border-t border-forest/10" />

            {/* Section 5: Lưu trữ và bảo vệ dữ liệu */}
            <section id="luu-tru-bao-ve" className="scroll-mt-28 space-y-3.5">
              <h2 className="font-serif text-xl sm:text-2xl text-forest font-normal flex items-baseline space-x-2">
                <span className="font-mono text-champagne text-base">05.</span>
                <span>Lưu trữ và bảo vệ dữ liệu</span>
              </h2>
              <p>
                Hệ thống tuân thủ các nguyên tắc kỹ thuật sau trong việc bảo vệ dữ liệu:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-[15px] text-ink-muted">
                <li>Sử dụng giao thức mã hóa HTTPS/TLS để bảo vệ dữ liệu khi truyền tải trên mạng.</li>
                <li>Giới hạn số lượng nhân sự có quyền tiếp cận danh sách khách hàng đăng ký theo nguyên tắc phân quyền tối thiểu.</li>
                <li>Bảo mật cấu hình: Các khóa bí mật, mã truy cập hệ thống (tokens, credentials) được lưu trữ tại máy chủ backend, tuyệt đối không lưu trong mã nguồn frontend trên trình duyệt của người dùng.</li>
                <li>Không đưa ra tuyên bố tuyệt đối: Dù áp dụng các biện pháp bảo vệ phù hợp, không một phương thức truyền tải hoặc lưu trữ trên internet nào có thể cam kết an toàn tuyệt đối 100%.</li>
              </ul>

              <div className="pt-2">
                <span className="font-medium text-forest text-sm block mb-1">Thời hạn lưu trữ:</span>
                <span className="inline-block px-2.5 py-1 rounded bg-sand border border-forest/10 font-mono text-xs text-ink-muted">
                  {privacyPolicyConfig.retentionNotice}
                </span>
                <p className="text-xs text-ink-muted mt-1.5">
                  Đơn vị vận hành có trách nhiệm xác định thời hạn lưu trữ cụ thể phù hợp với quy trình chăm sóc khách hàng và quy định hiện hành trước khi tiếp nhận thông tin thực tế.
                </p>
              </div>
            </section>

            <hr className="border-t border-forest/10" />

            {/* Section 6: Yêu cầu của người dùng */}
            <section id="quyen-nguoi-dung" className="scroll-mt-28 space-y-3.5">
              <h2 className="font-serif text-xl sm:text-2xl text-forest font-normal flex items-baseline space-x-2">
                <span className="font-mono text-champagne text-base">06.</span>
                <span>Yêu cầu của người dùng</span>
              </h2>
              <p>
                Người dùng đã để lại thông tin tư vấn có quyền gửi yêu cầu để:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm sm:text-[15px] text-ink-muted">
                <li>Kiểm tra, xác nhận lại thông tin đã đăng ký.</li>
                <li>Yêu cầu điều chỉnh, bổ sung hoặc cập nhật thông tin liên hệ.</li>
                <li>Đề nghị ngừng liên hệ hoặc xóa toàn bộ thông tin cá nhân khỏi danh sách hỗ trợ.</li>
              </ul>

              <div className="pt-2">
                <span className="font-medium text-forest text-sm block mb-1">Kênh tiếp nhận yêu cầu:</span>
                {contactConfig.email ? (
                  <p className="text-sm text-forest font-mono">
                    Email: <a href={`mailto:${contactConfig.email}`} className="underline hover:text-champagne">{contactConfig.email}</a>
                  </p>
                ) : (
                  <span className="inline-block px-2.5 py-1 rounded bg-sand border border-forest/10 font-mono text-xs text-ink-muted">
                    {privacyPolicyConfig.contactNotice}
                  </span>
                )}
                <p className="text-xs text-ink-muted mt-1.5">
                  Không tạo lập email hay số điện thoại chưa được xác thực. Khi đơn vị vận hành công bố thông tin liên hệ chính thức, kênh tiếp nhận sẽ được cập nhật minh bạch tại đây.
                </p>
              </div>
            </section>

            <hr className="border-t border-forest/10" />

            {/* Section 7: Cookie và công cụ đo lường */}
            <section id="cookie-do-luong" className="scroll-mt-28 space-y-3.5">
              <h2 className="font-serif text-xl sm:text-2xl text-forest font-normal flex items-baseline space-x-2">
                <span className="font-mono text-champagne text-base">07.</span>
                <span>Cookie và công cụ đo lường</span>
              </h2>
              <p>
                Mô tả đúng thực trạng kỹ thuật của website Vinhomes:
              </p>
              <p className="text-sm sm:text-[15px] text-ink-muted">
                Website <strong>không cài đặt</strong> các công cụ theo dõi hành vi người dùng của bên thứ ba như Google Analytics, Google Tag Manager, Meta Pixel (Facebook Pixel), TikTok Pixel hay bất kỳ mạng lưới quảng cáo tái tiếp thị (retargeting) nào.
              </p>
              <p className="text-xs text-ink-muted">
                Website chỉ phục vụ các tập tin tĩnh và phông chữ từ Google Fonts nhằm hiển thị giao diện theo đúng tiêu chuẩn thiết kế. Không có cookie theo dõi tiếp thị nào được cài đặt vào trình duyệt của bạn khi truy cập website này.
              </p>
            </section>

            <hr className="border-t border-forest/10" />

            {/* Section 8: Cập nhật chính sách */}
            <section id="cap-nhat-chinh-sach" className="scroll-mt-28 space-y-3.5">
              <h2 className="font-serif text-xl sm:text-2xl text-forest font-normal flex items-baseline space-x-2">
                <span className="font-mono text-champagne text-base">08.</span>
                <span>Cập nhật chính sách</span>
              </h2>
              <p className="text-sm sm:text-[15px] text-ink-muted">
                Nội dung chính sách bảo mật này có thể được bổ sung, hoàn thiện khi dự án Vinhomes hoàn tất thủ tục pháp lý và chính thức triển khai vận hành thương mại. Mọi sửa đổi sẽ được công bố trực tiếp tại trang này cùng ngày cập nhật có hiệu lực.
              </p>
              <div className="font-mono text-xs text-forest/80 pt-1">
                Ngày cập nhật văn bản: <strong>{privacyPolicyConfig.lastUpdatedDate}</strong>
              </div>
            </section>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-forest/10 flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/lien-he"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-sm bg-forest text-white hover:bg-forest-light text-xs font-mono uppercase tracking-wider transition-colors duration-150"
              >
                <ArrowLeft className="w-4 h-4 text-champagne" />
                <span>Quay lại trang Liên hệ</span>
              </Link>

              <Link
                to="/"
                className="text-xs text-ink-muted hover:text-forest transition-colors font-mono"
              >
                Về Trang chủ Vinhomes
              </Link>
            </div>

          </article>

        </div>

      </div>
    </main>
  );
};

export default PrivacyPolicyPage;

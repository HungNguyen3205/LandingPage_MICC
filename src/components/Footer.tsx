import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { projectMeta, navigationItems, consultationCtaConfig, quickContactConfig } from '../data/projectData';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (href: string) => {
    if (href === '/lien-he') {
      if (location.pathname !== '/lien-he') {
        navigate('/lien-he');
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (href.startsWith('/#') || href.startsWith('#')) {
      const hash = href.includes('#') ? `#${href.split('#')[1]}` : href;
      const targetId = hash.replace('#', '');

      if (location.pathname === '/') {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate(`/${hash}`);
      }
    }
  };

  return (
    <footer className="bg-[#0A292A] text-white pt-16 pb-12 border-t border-champagne/20 relative z-20">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/10">

          {/* Brand & Mission Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <Link
              to="/"
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="flex flex-col text-left mb-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne rounded-sm"
              aria-label="VINHOMES - Lên đầu trang"
            >
              <span className="font-serif text-2xl font-bold tracking-[0.2em] text-white">
                {projectMeta.brandName}
              </span>
              <span className="text-[10px] tracking-[0.3em] font-medium text-champagne">
                {projectMeta.brandSubtitle}
              </span>
            </Link>

            <p className="text-sand/75 text-sm leading-relaxed max-w-sm mb-6 font-light">
              Tuyệt tác không gian sống thượng lưu, nơi giao hòa giữa kiến trúc biểu tượng và hệ sinh thái đẳng cấp quốc tế.
            </p>

            <div className="text-xs text-sand/60 italic">
              {projectMeta.secondaryTagline}
            </div>
          </div>

          {/* Quick Navigation Column (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-serif text-base font-medium text-champagne mb-4 tracking-wide uppercase text-xs">
              Điều Hướng Nhanh
            </h4>
            <ul className="space-y-2.5">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className="text-xs sm:text-sm text-sand/80 hover:text-white transition-colors duration-150 flex items-center group cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-champagne/40 mr-2.5 group-hover:bg-champagne transition-colors" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to="/chinh-sach-bao-mat"
                  className="text-xs sm:text-sm text-sand/80 hover:text-white transition-colors duration-150 flex items-center group cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-champagne/40 mr-2.5 group-hover:bg-champagne transition-colors" />
                  <span>Chính sách bảo mật</span>
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick(consultationCtaConfig.href)}
                  className="text-xs sm:text-sm text-champagne hover:text-champagne-light transition-colors duration-150 flex items-center font-medium cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-champagne mr-2.5" />
                  <span>{consultationCtaConfig.label}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Project & Contact Status Column (4 cols) */}
          <div className="lg:col-span-4">
            <h4 className="font-serif text-base font-medium text-champagne mb-4 tracking-wide uppercase text-xs">
              Thông Tin Liên Hệ
            </h4>

            <div className="space-y-3.5 text-xs sm:text-sm text-sand/80 font-light">
              <div>
                <span className="text-sand/50 block text-[11px] uppercase tracking-wider mb-0.5">
                  Văn phòng giới thiệu & Ban quản lý dự án
                </span>
                <a href={`tel:${quickContactConfig.phoneNumber}`} className="inline-block py-1 text-sand/90 font-mono text-sm hover:text-champagne">
                  {projectMeta.contactStatusNotice}
                </a>
              </div>

              <div>
                <span className="text-sand/50 block text-[11px] uppercase tracking-wider mb-0.5">
                  Đường dây tư vấn chính thức
                </span>
                <a href={`tel:${quickContactConfig.phoneNumber}`} className="inline-block py-1 text-sand/90 font-mono text-sm hover:text-champagne">
                  {projectMeta.contactStatusNotice}
                </a>
              </div>

              <div className="pt-2">
                <span className="text-sand/50 block text-[11px] uppercase tracking-wider mb-1">
                  Đăng ký tư vấn trực tuyến
                </span>
                <p className="text-xs text-sand/70 leading-relaxed">
                  Quý khách vui lòng để lại thông tin tại biểu mẫu trực tuyến trên website để được hỗ trợ phản hồi chính thức.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-sand/60 font-light">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1">
            <span>© {CURRENT_YEAR} {projectMeta.brandName}. {projectMeta.designerCredit}.</span>
            <span className="hidden sm:inline text-sand/30">|</span>
            <Link
              to="/chinh-sach-bao-mat"
              className="text-sand/70 hover:text-champagne transition-colors underline-offset-4 hover:underline"
            >
              Chính sách bảo mật
            </Link>
          </div>

          <div className="text-center md:text-right">
            <p className="text-[11px] text-sand/50">
              * {projectMeta.disclaimerShort}
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

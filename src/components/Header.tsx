import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { navigationItems, consultationCtaConfig } from '../data/projectData';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSubPage = location.pathname !== '/';

  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // On home page, background changes after 40px. On sub-pages, it's always off-white.
      setIsScrolled(currentScrollY > 40);

      // Auto-hide when scrolling down, show when scrolling up
      if (isMobileMenuOpen) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (currentScrollY < 120) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current + 8) {
        // Scrolling down past threshold -> hide smoothly
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current - 8) {
        // Scrolling up -> show smoothly
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  // Handle navigation clicks for both home page anchors and sub-pages
  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);

    if (href === '/lien-he') {
      if (location.pathname !== '/lien-he') {
        navigate('/lien-he');
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // Hash links (e.g. /#tong-quan, /#bo-suu-tap, etc.)
    if (href.startsWith('/#') || href.startsWith('#')) {
      const hash = href.includes('#') ? `#${href.split('#')[1]}` : href;
      const targetId = hash.replace('#', '');

      if (location.pathname === '/') {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Navigate to home and then scroll
        navigate(`/${hash}`);
      }
    }
  };

  // On sub-pages, header is always in the scrolled/solid appearance (off-white + dark text)
  const showSolidHeader = isSubPage || isScrolled || isMobileMenuOpen;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          showSolidHeader
            ? 'bg-[#F7F5EF]/95 backdrop-blur-md text-forest py-3.5 shadow-subtle border-b border-forest/10'
            : 'bg-gradient-to-b from-black/60 via-black/20 to-transparent text-white py-5'
        }`}
      >
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="group flex flex-col text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne rounded-sm"
              aria-label="VINHOMES - Trang chủ"
            >
              <span className={`font-serif text-xl sm:text-2xl font-bold tracking-[0.2em] transition-colors duration-200 ${
                showSolidHeader ? 'text-forest' : 'text-white'
              }`}>
                VINHOMES
              </span>
              <span className={`text-[9px] sm:text-[10px] tracking-[0.25em] font-medium transition-colors duration-200 ${
                showSolidHeader ? 'text-ink-muted' : 'text-champagne-light/90'
              }`}>
                HẢI VÂN BAY ĐÀ NẴNG
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8" aria-label="Điều hướng chính">
              {navigationItems.map((item) => {
                const isActive = item.href === '/lien-he' && location.pathname === '/lien-he';

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className={`text-[14px] font-medium tracking-wide transition-colors duration-200 relative py-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-champagne ${
                      isActive
                        ? 'text-forest font-semibold'
                        : showSolidHeader
                        ? 'text-ink hover:text-forest'
                        : 'text-white/90 hover:text-white'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                    <span
                      className={`absolute bottom-0 left-0 h-[1.5px] bg-champagne transition-all duration-200 ${
                        isActive ? 'w-full' : 'w-0 hover:w-full'
                      }`}
                    />
                  </a>
                );
              })}
            </nav>

            {/* Right Action CTA */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                type="button"
                onClick={() => handleNavClick(consultationCtaConfig.href)}
                className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-luxury bg-champagne hover:bg-champagne-hover text-forest-dark text-[13px] sm:text-[14px] font-semibold tracking-wide transition-all duration-200 shadow-sm hover:shadow-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne active:scale-[0.98]"
              >
                <span>{consultationCtaConfig.label}</span>
                <ArrowUpRight className="ml-1.5 w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              {/* Mobile CTA compact */}
              <button
                type="button"
                onClick={() => handleNavClick(consultationCtaConfig.href)}
                className="sm:hidden px-3.5 py-1.5 rounded-luxury bg-champagne text-forest-dark text-xs font-semibold tracking-wide shadow-sm"
              >
                Tư vấn
              </button>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne ${
                  showSolidHeader ? 'text-forest hover:bg-forest/5' : 'text-white hover:bg-white/10'
                }`}
                aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu điều hướng'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" strokeWidth={1.75} />
                ) : (
                  <Menu className="w-6 h-6" strokeWidth={1.75} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-sand border-l border-forest/10 p-6 flex flex-col justify-between shadow-2xl lg:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu di động"
      >
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-forest/10">
            <div className="flex flex-col text-left">
              <span className="font-serif text-lg font-bold tracking-[0.15em] text-forest">
                VINHOMES
              </span>
              <span className="text-[9px] tracking-[0.2em] text-ink-muted font-medium">
                HẢI VÂN BAY ĐÀ NẴNG
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-ink hover:text-forest hover:bg-forest/5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
              aria-label="Đóng menu"
            >
              <X className="w-5 h-5" strokeWidth={1.75} />
            </button>
          </div>

          <nav className="mt-8 flex flex-col space-y-3" aria-label="Menu di động danh sách">
            {navigationItems.map((item) => {
              const isActive = item.href === '/lien-he' && location.pathname === '/lien-he';

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`text-base font-medium py-2.5 px-3 rounded-md transition-colors duration-150 flex items-center justify-between ${
                    isActive
                      ? 'bg-forest text-white'
                      : 'text-ink hover:text-forest hover:bg-forest/5'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span>{item.label}</span>
                  <span className={`font-serif text-sm ${isActive ? 'text-champagne' : 'text-champagne'}`}>
                    →
                  </span>
                </a>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-forest/10 space-y-3">
          <button
            type="button"
            onClick={() => handleNavClick(consultationCtaConfig.href)}
            className="w-full flex items-center justify-center px-5 py-3 rounded-luxury bg-champagne hover:bg-champagne-hover text-forest-dark font-semibold text-sm tracking-wide transition-colors shadow-sm"
          >
            <span>{consultationCtaConfig.label}</span>
            <ArrowUpRight className="ml-1.5 w-4 h-4" />
          </button>
          <p className="text-[11px] text-ink-muted text-center italic">
            Dự án & hình ảnh mang tính chất minh họa
          </p>
        </div>
      </div>
    </>
  );
};

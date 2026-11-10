import React, { useState, useEffect } from 'react';
import { quickContactConfig, consultationCtaConfig } from '../data/projectData';
import { ArrowUp, Phone, MessageCircle } from 'lucide-react';

export const QuickContact: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showMobileBottomBar, setShowMobileBottomBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const isPastHero = scrollY > 450;

      setShowScrollTop(isPastHero);

      // Check if user has reached the form or footer to avoid obscuring form submit button
      const formEl = document.getElementById('lien-he');
      let isOverForm = false;
      if (formEl) {
        const rect = formEl.getBoundingClientRect();
        // If form is visible on screen, hide mobile bottom bar
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          isOverForm = true;
        }
      }

      setShowMobileBottomBar(isPastHero && !isOverForm);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToForm = () => {
    const formEl = document.getElementById('lien-he');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const hasPhone = Boolean(quickContactConfig.phoneNumber && quickContactConfig.phoneNumber.trim() !== '');
  const hasZalo = Boolean(quickContactConfig.zaloUrl && quickContactConfig.zaloUrl.trim() !== '');

  return (
    <>
      {/* Floating Action Buttons (Right side) */}
      <aside aria-label="Hỗ trợ nhanh và cuộn trang" className="fixed bottom-6 right-6 z-30 flex flex-col space-y-3 items-end">

        {/* Zalo Button (Only rendered if real Zalo link is provided in config) */}
        {hasZalo && (
          <a
            href={quickContactConfig.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-[#0068FF] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0068FF]"
            aria-label="Nhắn tin qua Zalo"
          >
            <MessageCircle className="w-6 h-6" />
          </a>
        )}

        {/* Phone Button (Only rendered if real phone number is provided in config) */}
        {hasPhone && (
          <a
            href={`tel:${quickContactConfig.phoneNumber}`}
            className="w-12 h-12 rounded-full bg-forest text-champagne flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 border border-champagne/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-champagne"
            aria-label="Gọi điện thoại tư vấn"
          >
            <Phone className="w-5 h-5" />
          </a>
        )}

        {/* Scroll To Top Button */}
        {quickContactConfig.enableScrollTop && showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="w-11 h-11 rounded-full bg-white text-forest shadow-card border border-forest/10 hover:bg-sand flex items-center justify-center transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
            aria-label="Cuộn lên đầu trang"
          >
            <ArrowUp className="w-5 h-5 text-forest" strokeWidth={2} />
          </button>
        )}
      </aside>

      {/* Mobile Bottom Sticky CTA Bar (Only on mobile screens, disappears when form is reached) */}
      {quickContactConfig.enableMobileBottomBar && (
        <div
          className={`lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-forest-dark/95 backdrop-blur-md border-t border-champagne/25 p-3 px-4 transition-transform duration-300 ease-in-out ${
            showMobileBottomBar ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="flex items-center justify-between space-x-3">
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-champagne font-mono tracking-wider uppercase">
                VINHOMES
              </span>
              <span className="text-xs font-serif text-white truncate max-w-[150px]">
                Bất động sản cao cấp
              </span>
            </div>

            <button
              type="button"
              onClick={scrollToForm}
              className="flex-grow max-w-[200px] py-2.5 px-4 rounded-luxury bg-champagne hover:bg-champagne-hover text-forest-dark text-xs font-semibold tracking-wide shadow-gold transition-colors text-center"
            >
              {consultationCtaConfig.label}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

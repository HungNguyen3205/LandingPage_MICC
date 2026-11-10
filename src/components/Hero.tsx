import React from 'react';
import { ChevronRight } from 'lucide-react';
import { projectMeta, consultationCtaConfig } from '../data/projectData';

export const Hero: React.FC = () => {
  const handleScrollToOverview = (e: React.MouseEvent) => {
    e.preventDefault();
    const overviewEl = document.getElementById('tong-quan');
    if (overviewEl) {
      overviewEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    const formEl = document.getElementById('lien-he');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[92vh] lg:min-h-screen w-full flex items-center justify-start overflow-hidden">
      {/* Background Image with priority loading & subtle overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/vinh-may.webp"
          alt="Toàn cảnh phân khu Vịnh Mây, Vinhomes Hải Vân Bay"
          loading="eager"
          fetchPriority="high"
          className="w-full h-full object-cover object-center transform scale-100 transition-transform duration-1000 ease-out"
        />
        {/* Multilayer gradient overlay: darker on the left text area, preserving architectural light on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest-dark/85 via-forest-dark/50 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-transparent to-black/30" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 w-full max-w-content mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 lg:pt-36 lg:pb-28">
        <div className="max-w-4xl text-left">
          {/* Top Label */}
          <div className="inline-flex items-center space-x-2.5 px-3 py-1.5 rounded-full bg-forest/50 border border-champagne/30 backdrop-blur-md mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-champagne animate-pulse" />
            <span className="text-xs sm:text-[13px] font-medium tracking-[0.2em] text-champagne-light uppercase">
              MICC GROUP · NEXME | VINHOMES HẢI VÂN BAY
            </span>
          </div>

          {/* Main H1 - Single H1 on the page as required */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-normal text-white leading-[1.12] tracking-tight mb-6">
            Vịnh Mây{' '}
            <span className="italic font-normal text-champagne block sm:inline font-serif">
              Hilltop Collection
            </span>
          </h1>

          {/* Subtitle / Description: 2-3 lines max */}
          <p className="text-sand/90 text-base sm:text-lg font-light leading-relaxed max-w-2xl mb-8">
            {projectMeta.secondaryTagline}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3.5 sm:space-y-0 sm:space-x-4">
            <a
              href="#tong-quan"
              onClick={handleScrollToOverview}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-luxury bg-champagne hover:bg-champagne-hover text-forest-dark font-semibold text-sm sm:text-base tracking-wide transition-all duration-200 shadow-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
            >
              <span>Khám phá dự án</span>
              <ChevronRight className="ml-2 w-4 h-4" />
            </a>

            <a
              href={consultationCtaConfig.href}
              onClick={handleScrollToForm}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-luxury bg-white/10 hover:bg-white/20 text-white border border-white/25 hover:border-white/40 font-medium text-sm sm:text-base tracking-wide transition-all duration-200 backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Nhận tư vấn</span>
            </a>
          </div>

          {/* 5 Key Project Statistics Bar from haivanbaydanang.com.vn */}
          <div className="mt-10 pt-7 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            <div className="flex flex-col">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-champagne tracking-tight">1.000+</span>
              <span className="text-[12px] sm:text-xs text-sand/80 uppercase tracking-wider font-light mt-0.5">Sản phẩm</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-champagne tracking-tight">240 ha</span>
              <span className="text-[12px] sm:text-xs text-sand/80 uppercase tracking-wider font-light mt-0.5">Quy mô dự án</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-champagne tracking-tight">2 km</span>
              <span className="text-[12px] sm:text-xs text-sand/80 uppercase tracking-wider font-light mt-0.5">Đường bờ biển</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-champagne tracking-tight">50+</span>
              <span className="text-[12px] sm:text-xs text-sand/80 uppercase tracking-wider font-light mt-0.5">Tiện ích 5 sao</span>
            </div>
            <div className="flex flex-col col-span-2 sm:col-span-1">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-champagne tracking-tight">30.000+</span>
              <span className="text-[12px] sm:text-xs text-sand/80 uppercase tracking-wider font-light mt-0.5">Cư dân tương lai</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center space-y-2 pointer-events-auto">
        <a
          href="#tong-quan"
          onClick={handleScrollToOverview}
          className="group flex flex-col items-center text-white/70 hover:text-white transition-colors duration-200 focus:outline-none"
          aria-label="Cuộn xuống để khám phá dự án"
        >
          <span className="text-[11px] sm:text-xs tracking-[0.25em] uppercase font-light mb-1.5 text-sand/80">
            Cuộn để khám phá
          </span>
          <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center p-1 group-hover:border-champagne transition-colors">
            <span className="w-1 h-2 bg-champagne rounded-full animate-bounce" />
          </div>
        </a>
      </div>
    </section>
  );
};

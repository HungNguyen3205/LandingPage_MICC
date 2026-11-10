import React, { useState } from 'react';
import { amenitiesData } from '../data/projectData';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const Amenities: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentAmenity = amenitiesData[selectedIndex];

  return (
    <section id="tien-ich" className="py-14 sm:py-20 lg:py-28 bg-sand relative overflow-hidden">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <div className="flex items-center space-x-2 text-champagne text-xs sm:text-[13px] font-semibold tracking-[0.25em] uppercase mb-3">
            <span>03 / TIỆN ÍCH & PHONG CÁCH SỐNG</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-normal text-forest leading-[1.2] tracking-tight mb-4">
            Mỗi ngày, một niềm cảm hứng.
          </h2>
          <p className="text-ink-muted text-base leading-relaxed">
            Hệ sinh thái tiện ích được thiết kế theo chuẩn mực nghỉ dưỡng, khơi mở nguồn năng lượng tích cực và sự thư thái trong từng khoảnh khắc.
          </p>
        </div>

        {/* Amenity Interactive Showcase: Asymmetrical Large Image + Deep Green Content Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left Column: Interactive Navigation & Deep Green Detail Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">

            {/* 4 Amenity Category Selectors */}
            <div className="bg-white/70 p-2 rounded-luxury border border-forest/10 shadow-sm flex flex-col space-y-1" role="tablist" aria-label="Danh sách ý tưởng tiện ích">
              {amenitiesData.map((item, index) => {
                const isActive = index === selectedIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelectedIndex(index)}
                    className={`w-full text-left px-4 py-3 rounded-md transition-all duration-200 flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne ${
                      isActive
                        ? 'bg-forest text-white font-medium shadow-sm'
                        : 'text-ink hover:text-forest hover:bg-forest/5'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`text-xs font-mono ${isActive ? 'text-champagne' : 'text-ink-muted'}`}>
                        0{index + 1}
                      </span>
                      <span className="text-sm sm:text-base font-serif tracking-tight">
                        {item.title}
                      </span>
                    </div>

                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-champagne" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Phone: photo right under the tabs */}
            <div className="relative h-56 overflow-hidden rounded-luxury shadow-card sm:h-72 lg:hidden">
              <img key={currentAmenity.id} src={currentAmenity.image} alt={currentAmenity.title} loading="lazy" className="h-full w-full object-cover" />
            </div>

            {/* Deep Green Card with dynamic details */}
            <div className="bg-forest-dark text-white p-7 sm:p-8 rounded-luxury border border-champagne/20 shadow-card flex flex-col justify-between flex-grow">
              <div>
                <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-champagne/15 border border-champagne/30 text-champagne text-[11px] font-mono tracking-wider uppercase mb-4">
                  <Sparkles className="w-3 h-3" />
                  <span>{currentAmenity.tag}</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-[26px] font-medium text-white mb-2 leading-snug">
                  {currentAmenity.title}
                </h3>

                <p className="text-champagne text-sm sm:text-[15px] font-light italic mb-4">
                  "{currentAmenity.tagline}"
                </p>

                <p className="text-sand/80 text-sm leading-relaxed mb-6 font-light">
                  {currentAmenity.description}
                </p>

                <div className="space-y-2.5 pt-4 border-t border-white/10">
                  {currentAmenity.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-sand/90">
                      <CheckCircle2 className="w-4 h-4 text-champagne shrink-0 mt-0.5" strokeWidth={2} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10">
                <p className="text-[11px] text-sand/60 italic">
                  * Ý tưởng thiết kế tiện ích mang tính chất định hướng trải nghiệm sống.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Large Dynamic Photo (7 cols) with smooth fade transition */}
          <div className="hidden lg:block lg:col-span-7 relative min-h-[380px] lg:min-h-full rounded-luxury overflow-hidden shadow-elevated border border-forest/10 group">
            <img
              key={currentAmenity.id}
              src={currentAmenity.image}
              alt={currentAmenity.title}
              loading="lazy"
              className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
            />
            {/* Subtle bottom vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/70 via-transparent to-transparent pointer-events-none" />

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white pointer-events-none">
              <div>
                <span className="text-[11px] text-champagne uppercase tracking-widest block font-mono">
                  KHÔNG GIAN NGHỈ DƯỠNG
                </span>
                <span className="font-serif text-lg sm:text-xl font-light">
                  {currentAmenity.title}
                </span>
              </div>
              <span className="text-xs text-sand/80 bg-forest/70 px-3 py-1 rounded backdrop-blur-sm border border-white/15">
                Ảnh tham khảo phong cách
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

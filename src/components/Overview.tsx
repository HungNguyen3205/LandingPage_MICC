import React from 'react';
import { ChevronRight, Check } from 'lucide-react';

export const Overview: React.FC = () => {
  const handleScrollToCollection = (e: React.MouseEvent) => {
    e.preventDefault();
    const collectionEl = document.getElementById('bo-suu-tap');
    if (collectionEl) {
      collectionEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="tong-quan" className="py-20 lg:py-28 bg-sand relative overflow-hidden">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Asymmetrical Image Composition (7 cols on desktop) */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Large Vertical Image */}
              <div className="relative rounded-luxury overflow-hidden shadow-card border border-forest/5 aspect-[4/5] sm:aspect-[3/4]">
                <img
                  src="/images/hilltop.webp"
                  alt="Phối cảnh minh họa dinh thự Hilltop Collection"
                  loading="lazy"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Offset Overlapping Smaller Image (Luxury interior with natural light) */}
              <div className="hidden sm:block absolute -bottom-8 -right-6 lg:-right-8 w-3/5 rounded-luxury overflow-hidden shadow-elevated border-4 border-sand">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src="/images/vuon-rieng.webp"
                    alt="Phối cảnh minh họa biệt thự với vườn riêng"
                    loading="lazy"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>
              </div>

              {/* Decorative Accent Tag */}
              <div className="absolute top-6 left-6 bg-forest-dark/85 backdrop-blur-md text-champagne px-3.5 py-1.5 rounded text-xs tracking-widest font-mono border border-champagne/30">
                LIFESTYLE SANCTUARY
              </div>
            </div>
          </div>

          {/* Right Column: Story & Narrative Content (6 cols on desktop) */}
          <div className="lg:col-span-6 flex flex-col items-start lg:pl-4">
            {/* Section Index / Label */}
            <div className="flex items-center space-x-2 text-champagne text-xs sm:text-[13px] font-semibold tracking-[0.25em] uppercase mb-4">
              <span>01 / CÂU CHUYỆN VINHOMES HẢI VÂN BAY</span>
            </div>

            {/* Heading: Elegantly structured into 2 lines */}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-normal text-forest leading-[1.2] tracking-tight mb-6">
              Thành phố nghỉ dưỡng. <br />
              <span className="text-forest-light font-serif">Bên vịnh di sản tuyệt mỹ.</span>
            </h2>

            {/* Narrative Body: Authentic project story from haivanbaydanang.com.vn */}
            <div className="text-ink-muted text-base sm:text-[15.5px] leading-relaxed space-y-4 mb-8">
              <p>
                Tọa lạc tại vị trí độc tôn nơi chân đèo Hải Vân hướng trọn vịnh biển Đà Nẵng, <strong className="text-forest font-semibold">Vinhomes Hải Vân Bay</strong> là đại đô thị nghỉ dưỡng sinh thái quy mô 240ha đẳng cấp quốc tế, mở ra biểu tượng sống mới cho giới tinh hoa.
              </p>
              <p>
                Nơi đây dung hòa trọn vẹn giữa nhịp sống phồn vinh của hệ sinh thái Vingroup toàn diện và cảnh sắc thiên nhiên kỳ vĩ: bờ biển riêng 2km phẳng lặng, dòng suối tự nhiên uốn lượn cùng không gian xanh mát quanh năm.
              </p>
            </div>

            {/* 3 Key Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-2 pb-6 border-y border-forest/10 mb-8">
              <div className="flex flex-col">
                <div className="flex items-center space-x-2 text-forest font-serif font-medium text-sm sm:text-base mb-1">
                  <div className="w-4 h-4 rounded-full bg-champagne/20 text-champagne flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>Vịnh di sản 240ha</span>
                </div>
                <p className="text-xs text-ink-muted leading-normal">
                  2km bờ biển riêng và suối tự nhiên.
                </p>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center space-x-2 text-forest font-serif font-medium text-sm sm:text-base mb-1">
                  <div className="w-4 h-4 rounded-full bg-champagne/20 text-champagne flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>Hệ sinh thái Vingroup</span>
                </div>
                <p className="text-xs text-ink-muted leading-normal">
                  Vincom, Vinschool & Vinmec trọn vẹn.
                </p>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center space-x-2 text-forest font-serif font-medium text-sm sm:text-base mb-1">
                  <div className="w-4 h-4 rounded-full bg-champagne/20 text-champagne flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>Đặc quyền thượng lưu</span>
                </div>
                <p className="text-xs text-ink-muted leading-normal">
                  Bến du thuyền quốc tế và clubhouse.
                </p>
              </div>
            </div>

            {/* Action CTA */}
            <a
              href="#bo-suu-tap"
              onClick={handleScrollToCollection}
              className="inline-flex items-center justify-center px-6 py-3 rounded-luxury bg-forest hover:bg-forest-light text-white text-sm font-medium tracking-wide transition-colors duration-200 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
            >
              <span>Khám phá bộ sưu tập</span>
              <ChevronRight className="ml-2 w-4 h-4 text-champagne" />
            </a>

          </div>

        </div>
      </div>
    </section>
  );
};

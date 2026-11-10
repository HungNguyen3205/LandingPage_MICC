import React, { useState } from 'react';
import { galleryData } from '../data/projectData';
import { Lightbox } from './Lightbox';
import { Maximize2 } from 'lucide-react';

export const Gallery: React.FC = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const handleOpenLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="thu-vien" className="py-20 lg:py-28 bg-sand relative overflow-hidden">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div className="max-w-xl">
            <span className="text-champagne text-xs sm:text-[13px] font-semibold tracking-[0.25em] uppercase block mb-3">
              05 / THƯ VIỆN KHÔNG GIAN
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-normal text-forest leading-[1.2] tracking-tight mb-4">
              Không gian kể câu chuyện.
            </h2>
            <p className="text-ink-muted text-base leading-relaxed">
              Từng góc nhìn là một tác phẩm được kết tinh từ ánh sáng tự nhiên, chất liệu bản địa và tình yêu sâu sắc với biển khơi.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <span className="text-xs text-ink-muted italic bg-forest/5 px-3 py-1.5 rounded border border-forest/10">
              * Hình ảnh tham khảo phong cách thiết kế
            </span>
          </div>
        </div>

        {/* Asymmetrical Gallery Grid: 1 large anchor image + 4 complementary images */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {galleryData.map((item, index) => {
            const isFirst = index === 0;
            return (
              <div
                key={item.id}
                onClick={() => handleOpenLightbox(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenLightbox(index);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Xem ảnh lớn: ${item.title}`}
                className={`relative rounded-luxury overflow-hidden group cursor-pointer border border-forest/10 shadow-subtle hover:shadow-card transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne ${
                  isFirst
                    ? 'md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto'
                    : 'aspect-[4/3]'
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Subtle dark gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/85 via-forest-dark/30 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white" />

                {/* Hover details */}
                <div className="absolute inset-x-0 bottom-0 p-5 text-white transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 transition-all duration-300 flex items-end justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-medium text-white mb-0.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-sand/80 font-light">
                      {item.caption}
                    </p>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-champagne text-forest-dark flex items-center justify-center shrink-0 shadow-md">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                {/* Tiny corner index marker */}
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/40 text-sand text-[10px] font-mono tracking-widest backdrop-blur-sm">
                  0{index + 1}
                </span>
              </div>
            );
          })}
        </div>

      </div>

      {/* Lightbox Modal */}
      <Lightbox
        items={galleryData}
        currentIndex={selectedPhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIndex) => setSelectedPhotoIndex(newIndex)}
      />
    </section>
  );
};

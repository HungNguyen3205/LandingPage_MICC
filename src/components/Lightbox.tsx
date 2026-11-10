import React, { useEffect, useRef } from 'react';
import type { GalleryItem } from '../types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  items: GalleryItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  items,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const currentItem = items[currentIndex];

  useEffect(() => {
    if (!isOpen) return;

    // Focus close button on open for accessibility
    setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onNavigate((currentIndex - 1 + items.length) % items.length);
      } else if (e.key === 'ArrowRight') {
        onNavigate((currentIndex + 1) % items.length);
      }
    };

    // Lock body scroll
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentIndex, items.length, onClose, onNavigate]);

  if (!isOpen || !currentItem) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Thư viện hình ảnh: ${currentItem.title}`}
    >
      {/* Top Header Controls */}
      <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-8 sm:right-8 flex items-center justify-between text-white z-50">
        <div className="flex items-center space-x-3">
          <span className="font-mono text-xs sm:text-sm text-champagne">
            {currentIndex + 1} / {items.length}
          </span>
          <span className="text-white/40">|</span>
          <span className="text-xs sm:text-sm text-sand/80 font-light truncate max-w-[200px] sm:max-w-md">
            {currentItem.title}
          </span>
        </div>

        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
          aria-label="Đóng thư viện ảnh (phím Esc)"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.75} />
        </button>
      </div>

      {/* Navigation: Previous Button */}
      <button
        type="button"
        onClick={() => onNavigate((currentIndex - 1 + items.length) % items.length)}
        className="absolute left-2 sm:left-6 z-50 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/10 hover:border-champagne transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
        aria-label="Ảnh trước đó (phím mũi tên trái)"
      >
        <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2} />
      </button>

      {/* Navigation: Next Button */}
      <button
        type="button"
        onClick={() => onNavigate((currentIndex + 1) % items.length)}
        className="absolute right-2 sm:right-6 z-50 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/10 hover:border-champagne transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
        aria-label="Ảnh kế tiếp (phím mũi tên phải)"
      >
        <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2} />
      </button>

      {/* Main Image Container */}
      <div className="relative max-w-5xl w-full max-h-[82vh] flex flex-col items-center justify-center">
        <img
          src={currentItem.image}
          alt={currentItem.title}
          className="max-h-[70vh] sm:max-h-[75vh] w-auto max-w-full object-contain rounded-sm shadow-2xl transition-all duration-300"
        />

        {/* Caption & Reference Tag */}
        <div className="mt-4 text-center max-w-xl px-4">
          <p className="text-white text-sm sm:text-base font-serif font-light mb-1">
            {currentItem.title}
          </p>
          <p className="text-sand/70 text-xs sm:text-sm font-light">
            {currentItem.caption}
          </p>
          <span className="inline-block mt-2 text-[10px] text-sand/50 italic">
            * Hình ảnh tham khảo phong cách thiết kế
          </span>
        </div>
      </div>
    </div>
  );
};

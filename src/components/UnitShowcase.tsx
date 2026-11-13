import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { unitShowcaseData } from '../data/projectData';
import type { GalleryItem } from '../types';
import { Lightbox } from './Lightbox';

const AUTO_MS = 3500;
const imageOf = (code: string, small = false) =>
  `/images/quy-can/${code.toLowerCase()}${small ? '-sm' : ''}.webp`;

const lightboxItems: GalleryItem[] = unitShowcaseData.map((u) => ({
  id: u.code,
  title: `Căn ${u.code}`,
  caption: `${u.type} · ${u.area}`,
  image: imageOf(u.code),
}));

/**
 * Quỹ căn: dải poster trượt ngang từ trái qua phải.
 * Tự chạy sang phải mỗi vài giây, hết dải thì quay về đầu; dừng khi khách rê chuột,
 * chạm, focus bàn phím hoặc section không nằm trên màn hình. Vuốt / nút mũi tên để xem tay.
 */
export const UnitShowcase: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const hovering = useRef(false);
  const inView = useRef(false);
  const pausedUntil = useRef(0);

  const step = useCallback(() => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return 0;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card.offsetWidth + gap;
  }, []);

  const scrollByCards = useCallback((dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    const atStart = track.scrollLeft <= 4;
    if (dir === 1 && atEnd) track.scrollTo({ left: 0, behavior: 'smooth' });
    else if (dir === -1 && atStart) track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
    else track.scrollBy({ left: dir * step(), behavior: 'smooth' });
  }, [step]);

  const pauseFor = (ms: number) => {
    pausedUntil.current = Date.now() + ms;
  };

  // Tự trượt sang phải
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const section = sectionRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      inView.current = entry.isIntersecting;
    }, { threshold: 0.3 });
    if (section) observer.observe(section);

    const timer = window.setInterval(() => {
      if (!inView.current || hovering.current || lightboxOpen || Date.now() < pausedUntil.current) return;
      scrollByCards(1);
    }, AUTO_MS);
    return () => {
      window.clearInterval(timer);
      observer.disconnect();
    };
  }, [scrollByCards, lightboxOpen]);

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setProgress(max > 0 ? track.scrollLeft / max : 0);
    const size = step();
    if (!size) return;
    // Ở cuối dải thì luôn hiện căn cuối (các căn cuối không thể cuộn tới mép trái)
    const atEnd = max > 0 && track.scrollLeft >= max - 4;
    setActive(atEnd ? unitShowcaseData.length - 1 : Math.min(unitShowcaseData.length - 1, Math.round(track.scrollLeft / size)));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section
      id="quy-can"
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-forest-dark py-14 text-white sm:py-20 lg:py-24"
    >
      {/* Ánh vàng mờ phía sau cho nền bớt phẳng */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 inset-0 bg-[radial-gradient(60%_50%_at_15%_0%,rgba(200,164,107,.18),transparent_70%)]"
      />
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.25em] text-champagne sm:text-[13px]">
              Quỹ căn đang mở bán
            </span>
            <h2 className="mb-3 font-serif text-3xl font-normal leading-[1.2] tracking-tight sm:text-4xl lg:text-[44px]">
              {unitShowcaseData.length} căn đẹp, chọn ngay hôm nay.
            </h2>
            <p className="text-base leading-relaxed text-white/70">
              Song lập, đơn lập và liền kề tại Làng Vân. Bấm vào từng căn để xem ảnh lớn: vị trí, mặt bằng và giá chi tiết.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { pauseFor(8000); scrollByCards(-1); }}
              aria-label="Căn trước"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-champagne hover:bg-champagne hover:text-forest-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => { pauseFor(8000); scrollByCards(1); }}
              aria-label="Căn tiếp theo"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-champagne hover:bg-champagne hover:text-forest-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Dải trượt ngang: tràn sát mép màn hình, căn lề trái theo nội dung */}
      <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-24 bg-gradient-to-l from-forest-dark to-transparent sm:block"
      />
      <div
        ref={trackRef}
        onScroll={onScroll}
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') hovering.current = true; }}
        onPointerLeave={() => { hovering.current = false; }}
        onTouchStart={() => pauseFor(8000)}
        onFocus={() => { hovering.current = true; }}
        onBlur={() => { hovering.current = false; }}
        className="unit-track flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pt-2 pb-4 sm:gap-6 sm:px-6 lg:px-[max(2rem,calc((100vw-1240px)/2+2rem))]"
        aria-label="Danh sách quỹ căn, trượt ngang"
      >
        {unitShowcaseData.map((unit, index) => (
          <article
            key={unit.code}
            className="group w-[74vw] max-w-[300px] shrink-0 snap-start rounded-2xl bg-gradient-to-b from-forest-light/70 to-forest/40 p-2.5 ring-1 ring-champagne/20 shadow-[0_24px_48px_-24px_rgba(0,0,0,.9)] transition duration-300 hover:-translate-y-1 hover:ring-champagne/60 sm:w-[280px]"
          >
            <button
              type="button"
              onClick={() => openLightbox(index)}
              aria-label={`Xem ảnh lớn căn ${unit.code}`}
              className="relative block aspect-[1080/1294] w-full overflow-hidden rounded-xl bg-forest focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
            >
              <img
                src={imageOf(unit.code, true)}
                alt={`Căn ${unit.code} – ${unit.type} ${unit.area}`}
                loading="lazy"
                decoding="async"
                width={520}
                height={623}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
              <span className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-[11px] font-semibold text-white opacity-0 backdrop-blur transition duration-300 group-hover:opacity-100">
                <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                Xem ảnh lớn
              </span>
            </button>

            <div className="px-1.5 pt-3.5 pb-1">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-serif text-[22px] leading-none tracking-wide text-white">{unit.code}</h3>
                <span className="text-sm font-semibold text-champagne">{unit.area}</span>
              </div>
              <p className="mt-1.5 text-[13px] text-white/55">
                {unit.type === 'Liền kề' ? 'Nhà phố' : 'Biệt thự'} {unit.type.toLowerCase()} · Làng Vân
              </p>
              <a
                href="#lien-he"
                className="mt-3.5 flex items-center justify-center gap-2 rounded-full border border-champagne/50 py-2.5 text-[13px] font-semibold text-champagne transition hover:border-champagne hover:bg-champagne hover:text-forest-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
              >
                Tư vấn căn này
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
      </div>
      </div>

      {/* Thanh tiến độ trượt */}
      <div className="max-w-content mx-auto mt-5 flex items-center gap-4 px-4 sm:px-6 lg:px-8">
        <span className="shrink-0 font-mono text-sm tracking-widest text-white/60" aria-live="polite">
          <span className="text-champagne">{String(active + 1).padStart(2, '0')}</span> / {String(unitShowcaseData.length).padStart(2, '0')}
        </span>
        <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/10" aria-hidden="true">
          <div
            className="h-full rounded-full bg-champagne transition-[width] duration-300"
            style={{ width: `${Math.max(8, progress * 100)}%` }}
          />
        </div>
      </div>

      <Lightbox
        items={lightboxItems}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
        note="* Giá và chính sách theo thời điểm phát hành, vui lòng liên hệ để cập nhật mới nhất"
      />
    </section>
  );
};

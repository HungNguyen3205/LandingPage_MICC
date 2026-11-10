import { useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';

/**
 * Keeps the visitor oriented toward the lead form:
 * - a thin champagne progress line across the top of the viewport
 * - a floating desktop CTA after the hero, hidden once the form is on screen
 *   (mobile already has QuickContact's bottom bar)
 */
export const JourneyBar = () => {
  const barRef = useRef<HTMLDivElement>(null);
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    let frame = 0;
    let formVisible = false;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
      setShowCta(window.scrollY > window.innerHeight * 0.85 && !formVisible);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };

    const form = document.getElementById('lien-he');
    const observer = form
      ? new IntersectionObserver(([entry]) => { formVisible = entry.isIntersecting; onScroll(); }, { threshold: 0.15 })
      : null;
    if (form) observer?.observe(form);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      observer?.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
        <div ref={barRef} className="h-full origin-left scale-x-0 bg-gradient-to-r from-champagne-muted via-champagne to-champagne-hover" />
      </div>
      <a
        href="#lien-he"
        tabIndex={showCta ? 0 : -1}
        aria-hidden={!showCta}
        className={`cta-shine fixed bottom-6 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-3 overflow-hidden rounded-full border border-champagne/40 bg-forest-dark/90 py-2 pl-5 pr-2 text-sm font-medium text-white shadow-2xl shadow-black/40 backdrop-blur-md transition-all duration-500 lg:flex ${
          showCta ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-8 opacity-0'
        }`}
      >
        <span>Nhận quỹ căn & lịch tham quan Làng Vân</span>
        <span className="flex items-center gap-1.5 rounded-full bg-champagne px-4 py-2 font-semibold text-forest-dark">
          Đăng ký <ArrowDown aria-hidden="true" className="h-4 w-4" />
        </span>
      </a>
    </>
  );
};

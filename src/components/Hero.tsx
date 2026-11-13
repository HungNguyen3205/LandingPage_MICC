import { useEffect, useRef } from 'react';
import { Waves, Trees, FerrisWheel, ChevronDown, type LucideIcon } from 'lucide-react';

type Pillar = { title: string; text: string; icon: LucideIcon };

const pillars: Pillar[] = [
  { title: 'Biển & vịnh', text: 'Bãi biển cát mịn, hoàng hôn trên vịnh và cáp treo ngắm trọn đường bờ biển.', icon: Waves },
  { title: 'Suối & rừng', text: 'Đường mòn phiêu lưu, máng trượt xuyên rừng và suối mát giữa thiên nhiên.', icon: Trees },
  { title: 'Vui chơi giải trí', text: 'Công viên chủ đề, lễ hội đêm và khu vui chơi cho trẻ em mỗi cuối tuần.', icon: FerrisWheel },
];

const TITLE_FONT = "'Playfair Display', 'Noto Serif', Georgia, serif";
const SCRIPT_FONT = "'Great Vibes', 'Dancing Script', cursive";

/**
 * Layered hero: background photo → flowing title → the same photo with only the
 * foreground (islands, forest, town, cable wires) kept via an alpha mask, so the
 * title sits on the sea behind the scenery. On scroll the title drifts slower than
 * the scene and sinks behind the coastline.
 */
export const Hero = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      el.style.setProperty('--hero-y', String(Math.min(window.scrollY, 1200)));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] flex-col items-center justify-start overflow-hidden bg-forest-dark px-4 pb-10 pt-[46svh] text-center text-white sm:min-h-[max(min(980px,100svh),52vw)] sm:justify-end sm:pb-12 sm:pt-32">
      <svg aria-hidden="true" className="absolute inset-x-0 top-0 -z-20 h-[100svh] w-full sm:inset-0 sm:h-full" viewBox="0 0 1536 1024" preserveAspectRatio="xMidYMin slice">
        <defs>
          <linearGradient id="lv-type" x1="0" y1="0" x2="1" y2=".25">
            <stop offset="0" stopColor="#fffdf8" />
            <stop offset=".42" stopColor="#fffdf8" />
            <stop offset=".5" stopColor="#f6dfb4" />
            <stop offset=".58" stopColor="#fffdf8" />
            <stop offset="1" stopColor="#eef3f2" />
            <animateTransform attributeName="gradientTransform" type="translate" values="-1 0; 1 0; 1 0" keyTimes="0; .45; 1" dur="7s" begin="1.6s" repeatCount="indefinite" />
          </linearGradient>
          {/* Filter regions in user space (whole scene + margin), not the text's bounding box:
              iOS WebKit miscomputes the bbox of text with textLength, which clipped the title. */}
          <filter id="lv-glow" filterUnits="userSpaceOnUse" x="-200" y="-200" width="1936" height="1424">
            <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="#081f2b" floodOpacity=".45" />
          </filter>
          <filter id="lv-script-shadow" filterUnits="userSpaceOnUse" x="-200" y="-200" width="1936" height="1424">
            <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#000" floodOpacity=".7" />
          </filter>
        </defs>

        <g className="hero-scene">
          <image href="/images/lang-van/hero-bg.webp" width="1536" height="1024" />

          <g className="hero-parallax">
            {/* Filter đặt ở nhóm ngoài, nhóm animate bên trong không đụng tới thuộc tính filter */}
            <g filter="url(#lv-glow)">
              <g className="hero-title" fill="url(#lv-type)" fontFamily={TITLE_FONT} fontStyle="italic" fontWeight="900" textAnchor="middle">
                <text className="hidden sm:block" x="790" y="292" fontSize="222" textLength="730" lengthAdjust="spacingAndGlyphs">Làng Vân</text>
                <text className="sm:hidden" x="768" y="292" fontSize="138" textLength="430" lengthAdjust="spacingAndGlyphs">Làng Vân</text>
              </g>
            </g>
          </g>

          <image href="/images/lang-van/hero-fg.webp" width="1536" height="1024" />

          <g className="hero-script" filter="url(#lv-script-shadow)" fontFamily={SCRIPT_FONT} fill="#f3d9a6" stroke="#f3d9a6" strokeWidth="1.2" textAnchor="middle">
            <text className="hidden sm:block" x="900" y="352" fontSize="84" transform="rotate(-4 900 352)">Sống như một kỳ nghỉ</text>
            <text className="sm:hidden" x="790" y="372" fontSize="60" transform="rotate(-5 790 372)">Sống như một kỳ nghỉ</text>
          </g>
        </g>
      </svg>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-dark via-forest-dark/30 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-black/40 to-transparent" />

      <div className="hero-copy relative mx-auto w-full max-w-6xl">
        <h1 className="font-serif text-[28px] leading-tight drop-shadow-lg sm:text-5xl">
          Biển xanh, suối mát, <span className="italic text-champagne-light">rừng nhiệt đới</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-[13px] leading-relaxed text-white/90 sm:text-base">
          Sáng tắm biển, chiều đi cáp treo xuyên rừng, tối dạo lễ hội ven hồ. Ngôi nhà thứ hai của gia đình bạn, chỉ hơn 1 giờ bay từ Hà Nội.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href="#lien-he" className="cta-shine relative inline-flex overflow-hidden rounded-full bg-champagne px-5 py-2.5 text-sm font-semibold text-forest-dark shadow-gold hover:bg-champagne-light sm:px-8 sm:py-3.5 sm:text-base">Nhận bảng giá & lịch tham quan</a>
          <a href="#trai-nghiem" className="inline-flex rounded-full border border-white/50 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/20 sm:px-8 sm:py-3.5 sm:text-base">Khám phá Làng Vân</a>
        </div>

        <nav aria-label="Thế mạnh Làng Vân" className="mt-8 hidden grid-cols-3 gap-5 text-left sm:grid">
          {pillars.map(({ title, text, icon: Icon }) => (
            <a key={title} href="#trai-nghiem" className="group flex flex-col items-center gap-2 rounded-2xl border border-white/15 bg-black/45 px-2 py-3 shadow-xl shadow-black/30 backdrop-blur-md transition hover:-translate-y-1 hover:border-champagne/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne motion-reduce:transform-none sm:flex-row sm:gap-4 sm:p-5">
              <Icon aria-hidden="true" className="h-7 w-7 shrink-0 text-champagne transition group-hover:scale-110 sm:h-11 sm:w-11" strokeWidth={1.6} />
              <span>
                <span className="block text-[11px] font-bold uppercase leading-tight tracking-[.08em] sm:text-base sm:tracking-[.14em]">{title}</span>
                <span className="mt-1 hidden text-sm leading-snug text-white/80 sm:block">{text}</span>
              </span>
            </a>
          ))}
        </nav>
        <a href="#trai-nghiem" aria-label="Cuộn xuống" className="mx-auto mt-5 flex w-fit flex-col items-center text-[11px] uppercase tracking-[.25em] text-white/70 hover:text-champagne-light">
          Hình ảnh minh họa
          <ChevronDown aria-hidden="true" className="mt-1 h-5 w-5 animate-bounce motion-reduce:animate-none" />
        </a>
      </div>
    </section>
  );
};

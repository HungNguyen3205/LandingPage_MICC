import { ArrowUpRight } from 'lucide-react';

const featuredZones = [
  { id: 'vinh-may', name: 'Vịnh Mây', image: '/images/trien-nui.webp', position: 'center 72%' },
  { id: 'bach-van', name: 'Bạch Vân', image: '/images/bach-van.webp', position: 'center 58%' },
  { id: 'dao-ngoc', name: 'Đảo Ngọc', image: '/images/dao-ngoc.webp', position: 'center 60%' },
];

export const Hero = () => (
  <section className="relative isolate flex min-h-[min(920px,100svh)] flex-col items-center justify-end overflow-hidden bg-forest-dark px-4 pb-12 pt-36 text-center text-white sm:pb-16">
    <svg aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full" viewBox="0 398 1280 740" preserveAspectRatio="xMidYMid slice">
      <defs>
        <clipPath id="hilltop-foreground">
          <path d="M0 532L60 487 178 499 209 523 310 526 341 552 400 557 438 583 506 590 547 611 600 614 654 650 710 647 766 656 820 659 879 674 927 689 966 711 1006 754 1050 768 1104 790 1150 797 1194 820 1280 839V1280H0Z" />
        </clipPath>
        <linearGradient id="hilltop-type" x2="0%" y2="100%">
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#dceef1" />
        </linearGradient>
      </defs>
      <image href="/images/trien-nui.webp" width="1280" height="1280" />
      <text className="hidden sm:block" x="738" y="567" textAnchor="middle" textLength="715" lengthAdjust="spacingAndGlyphs" fill="url(#hilltop-type)" fontFamily="Arial, sans-serif" fontSize="132" fontWeight="900">VỊNH MÂY</text>
      <text className="sm:hidden" x="640" y="571" textAnchor="middle" textLength="278" lengthAdjust="spacingAndGlyphs" fill="url(#hilltop-type)" fontFamily="Arial, sans-serif" fontSize="64" fontWeight="900">VỊNH MÂY</text>
      <image href="/images/trien-nui.webp" width="1280" height="1280" clipPath="url(#hilltop-foreground)" />
      <rect x="0" y="398" width="1280" height="740" fill="#092c3e" opacity=".18" />
    </svg>
    <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-dark via-forest-dark/25 to-transparent" />
    <div className="relative mx-auto w-full max-w-5xl">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[.24em] text-champagne-light sm:text-sm">MICC Group · NEXME</p>
      <h1 className="font-serif text-4xl sm:text-6xl">Vịnh Mây <span className="block italic text-champagne-light sm:inline">Hilltop Collection</span></h1>
      <p className="mx-auto mt-4 max-w-xl text-sm text-white/90 sm:text-base">Khám phá không gian sống giữa triền núi và vịnh biển tại Vinhomes Hải Vân Bay.</p>
      <a href="#bang-gia" className="mt-7 inline-flex rounded-full bg-champagne px-7 py-3 font-semibold text-forest-dark hover:bg-champagne-light">Xem bảng giá & chính sách</a>
      <nav aria-label="Khám phá phân khu" className="mt-8 grid grid-cols-3 gap-2 sm:gap-4">
        {featuredZones.map((zone, index) => (
          <a key={zone.id} href={`#phan-khu-${zone.id}`} aria-label={`Xem bảng giá và chính sách ${zone.name}`} className="group relative isolate flex min-h-28 items-end overflow-hidden rounded-xl border border-white/30 bg-forest-dark text-left shadow-xl shadow-black/30 transition hover:-translate-y-1 hover:border-champagne focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne motion-reduce:transform-none motion-reduce:transition-none sm:min-h-40">
            <img src={zone.image} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none" style={{ objectPosition: zone.position }} />
            <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/35 to-transparent" />
            <span className="flex w-full items-end justify-between gap-1 px-2 pb-3 sm:px-4 sm:pb-4">
              <span>
                <span className="mb-1 hidden text-[10px] font-semibold uppercase tracking-widest text-champagne-light sm:block">Phân khu 0{index + 1}</span>
                <span className="block font-serif text-sm font-semibold leading-tight sm:text-2xl">{zone.name}</span>
              </span>
              <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-champagne-light sm:h-5 sm:w-5" />
            </span>
          </a>
        ))}
      </nav>
      <p className="mt-4 text-xs text-white/75">Hình ảnh minh họa</p>
    </div>
  </section>
);

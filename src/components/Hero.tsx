export const Hero = () => (
  <section className="relative isolate flex min-h-[min(920px,100svh)] flex-col items-center justify-end overflow-hidden bg-forest-dark px-4 pb-12 pt-36 text-center text-white sm:pb-16">
    <svg aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full" viewBox="0 395 1280 750" preserveAspectRatio="xMidYMid slice">
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
      <rect x="0" y="395" width="1280" height="750" fill="#092c3e" opacity=".24" />
      <text className="hidden sm:block" x="640" y="693" textAnchor="middle" textLength="760" lengthAdjust="spacingAndGlyphs" fill="url(#hilltop-type)" fontFamily="Arial, sans-serif" fontSize="166" fontWeight="900">VỊNH MÂY</text>
      <text className="sm:hidden" x="640" y="693" textAnchor="middle" textLength="330" lengthAdjust="spacingAndGlyphs" fill="url(#hilltop-type)" fontFamily="Arial, sans-serif" fontSize="82" fontWeight="900">VỊNH MÂY</text>
      <image href="/images/trien-nui.webp" width="1280" height="1280" clipPath="url(#hilltop-foreground)" />
    </svg>
    <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-dark via-forest-dark/25 to-transparent" />
    <div className="relative mx-auto w-full max-w-5xl">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[.24em] text-champagne-light sm:text-sm">MICC Group · NEXME</p>
      <h1 className="font-serif text-4xl sm:text-6xl">Vịnh Mây <span className="block italic text-champagne-light sm:inline">Hilltop Collection</span></h1>
      <p className="mx-auto mt-4 max-w-xl text-sm text-white/90 sm:text-base">Khám phá không gian sống giữa triền núi và vịnh biển tại Vinhomes Hải Vân Bay.</p>
      <a href="#bang-gia" className="mt-7 inline-flex rounded-full bg-champagne px-7 py-3 font-semibold text-forest-dark hover:bg-champagne-light">Xem bảng giá & chính sách</a>
      <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4">
        {['Vịnh Mây', 'Bạch Vân', 'Đảo Ngọc'].map((name, index) => (
          <a key={name} href={`#phan-khu-${index}`} className="rounded-xl border border-white/25 bg-forest-dark/65 px-2 py-3 text-sm font-semibold backdrop-blur-sm hover:bg-forest-dark sm:py-4">{name}</a>
        ))}
      </div>
      <p className="mt-4 text-xs text-white/75">Hình ảnh minh họa</p>
    </div>
  </section>
);

import { ArrowRight, MessageCircle } from 'lucide-react';
import { quickContactConfig } from '../data/projectData';

interface StoryCtaProps {
  image: string;
  eyebrow: string;
  title: string;
  script: string;
  text: string;
  cta: string;
  position?: string;
}

/** Full-bleed cinematic band that bridges two sections and points to the lead form. */
export const StoryCta = ({ image, eyebrow, title, script, text, cta, position = 'center' }: StoryCtaProps) => (
  <section className="relative isolate overflow-hidden bg-forest-dark px-4 py-16 text-center text-white sm:py-32">
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-20 bg-cover md:bg-fixed"
      style={{ backgroundImage: `url(${image})`, backgroundPosition: position }}
    />
    <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-dark/80 via-black/45 to-forest-dark/85" />
    <div className="mx-auto max-w-3xl">
      <span className="text-xs font-semibold uppercase tracking-[.3em] text-champagne-light">{eyebrow}</span>
      <p className="mt-4 font-['Great_Vibes'] text-4xl text-champagne-light drop-shadow sm:text-6xl">{script}</p>
      <h2 className="mt-1 font-serif text-3xl leading-tight drop-shadow-lg sm:text-5xl">{title}</h2>
      <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">{text}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a href="#lien-he" className="cta-shine group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-champagne px-7 py-3.5 font-semibold text-forest-dark shadow-gold hover:bg-champagne-light">
          {cta}
          <ArrowRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-1" />
        </a>
        <a href={quickContactConfig.zaloUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/10 px-7 py-3.5 font-semibold backdrop-blur hover:bg-white/20">
          <MessageCircle aria-hidden="true" className="h-4 w-4" />
          Nhắn Zalo
        </a>
      </div>
    </div>
  </section>
);

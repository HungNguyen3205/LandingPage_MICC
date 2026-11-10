import { ArrowRight } from 'lucide-react';
import { experienceData } from '../data/projectData';

const tileLayout = [
  'md:col-span-2 md:row-span-2 md:aspect-auto',
  'md:aspect-[4/3]',
  'md:aspect-[4/3]',
  'md:aspect-[4/3]',
  'md:aspect-[4/3]',
  'md:col-span-2 md:aspect-[2/1]',
  'md:col-span-2 md:aspect-[2/1]',
];

export const Experiences = () => (
  <section id="trai-nghiem" className="relative overflow-hidden bg-forest-dark py-20 text-white lg:py-28">
    <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <span className="mb-3 block text-xs font-semibold uppercase tracking-[.25em] text-champagne sm:text-[13px]">Một ngày ở Làng Vân</span>
          <h2 className="font-serif text-3xl leading-[1.2] tracking-tight sm:text-4xl lg:text-[44px]">
            Từ bình minh trên vịnh <span className="italic text-champagne-light">đến lễ hội đêm.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-sand/75">
            Biển, suối, rừng và cả một thế giới vui chơi nằm ngay trong khu đô thị. Ở đây, mỗi ngày đều là một kỳ nghỉ.
          </p>
        </div>
        <ul className="hidden flex-wrap gap-2 text-xs font-medium md:flex">
          {['Biển', 'Suối & rừng', 'Vui chơi', 'Thiên nhiên'].map((chip) => (
            <li key={chip} className="rounded-full border border-champagne/40 px-3 py-1.5 text-champagne-light">{chip}</li>
          ))}
        </ul>
      </div>

<p className="mb-3 flex items-center gap-2 text-xs font-medium text-champagne-light md:hidden"><span aria-hidden="true" className="h-px w-6 bg-current" />Vuốt ngang để xem thêm →</p>
      <div className="snap-row -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0 md:pb-0">
        {experienceData.map((item, index) => (
          <figure key={item.id} className={`group relative isolate aspect-[4/5] w-[78vw] max-w-sm shrink-0 snap-center overflow-hidden rounded-2xl border border-white/10 shadow-xl shadow-black/30 md:w-auto md:max-w-none ${tileLayout[index] ?? 'md:aspect-[4/3]'}`}>
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-105 motion-reduce:transform-none"
              style={{ objectPosition: item.position ?? 'center' }}
            />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <span className="mb-2 inline-block rounded-full bg-champagne px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-forest-dark">{item.tag}</span>
              <h3 className={`font-serif font-medium leading-snug ${index === 0 ? 'text-xl md:text-3xl' : 'text-xl'}`}>{item.title}</h3>
              <p className={`mt-1 text-sm leading-relaxed text-white/80 ${index === 0 ? 'line-clamp-3 max-w-md md:line-clamp-none' : 'line-clamp-2'}`}>{item.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-2xl border border-champagne/25 bg-white/5 p-6 text-center backdrop-blur sm:flex-row sm:p-8 sm:text-left">
        <div>
          <p className="font-serif text-xl sm:text-2xl">Muốn tự mình trải nghiệm một ngày như thế?</p>
          <p className="mt-1 text-sm text-sand/70">Đăng ký tham quan thực tế, chuyên viên sắp xếp lịch trình và gửi bảng giá trước khi bạn đến.</p>
        </div>
        <a href="#lien-he" className="cta-shine relative inline-flex shrink-0 items-center gap-2 overflow-hidden rounded-full bg-champagne px-7 py-3.5 font-semibold text-forest-dark shadow-gold hover:bg-champagne-light">
          Đặt lịch tham quan <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>
      <p className="mt-6 text-xs italic text-sand/50">* Hình ảnh minh họa. Hoạt động kinh doanh thực hiện theo quy định của Ban Quản lý tại từng thời điểm.</p>
    </div>
  </section>
);

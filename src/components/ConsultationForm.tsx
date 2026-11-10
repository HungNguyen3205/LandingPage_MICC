import React from 'react';
import { LeadForm } from './LeadForm';
import type { SelectedUnit } from '../types';
import { ShieldCheck, PhoneCall, CalendarCheck, FileText } from 'lucide-react';

interface ConsultationFormProps {
  preSelectedProduct?: string;
  selectedUnit?: SelectedUnit | null;
  onClearUnit?: () => void;
}

const steps = [
  { icon: FileText, title: 'Nhận bảng giá & quỹ căn', text: 'Quỹ căn còn trống, chính sách chiết khấu và phương án vay mới nhất.' },
  { icon: PhoneCall, title: 'Chuyên viên gọi lại', text: 'Tư vấn đúng nhu cầu: nghỉ dưỡng, cho thuê hay đầu tư.' },
  { icon: CalendarCheck, title: 'Tham quan Làng Vân', text: 'Hỗ trợ đưa đón, xem biển, cáp treo và từng phân khu thực tế.' },
];

export const ConsultationForm: React.FC<ConsultationFormProps> = ({ preSelectedProduct, selectedUnit, onClearUnit }) => {
  return (
    <section id="lien-he" className="relative isolate overflow-hidden bg-forest-dark py-14 text-white sm:py-20 lg:py-28">
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[url('/images/lang-van/hero-bg.webp')] bg-cover bg-[center_30%] md:bg-fixed" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-dark via-forest-dark/80 to-forest-dark/95" />

      {/* Phone order: intro → form → steps. Desktop: intro + steps left, form right. */}
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-8 items-start">

        <div className="lg:col-span-5 lg:row-start-1">
          <span className="text-xs font-semibold uppercase tracking-[.3em] text-champagne-light">Chương cuối của hành trình</span>
          <p className="mt-4 font-['Great_Vibes'] text-4xl text-champagne-light sm:text-5xl">Hẹn gặp ở Làng Vân</p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-[44px] font-normal leading-[1.2] tracking-tight">
            Hành trình về biển bắt đầu từ đây.
          </h2>
          <p className="mt-5 text-sand/85 text-base leading-relaxed font-light">
            Để lại thông tin, chỉ mất 30 giây. Đội ngũ MICC Group · NEXME sẽ đồng hành cùng bạn từ bảng giá đến ngày nhận nhà.
          </p>
        </div>

        <div className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
          <div className="rounded-2xl ring-1 ring-champagne/30 shadow-2xl shadow-black/50">
            <LeadForm
              preSelectedProduct={preSelectedProduct}
              variant="home-dark"
              onSuccessRedirect={false}
              selectedUnit={selectedUnit}
              onClearUnit={onClearUnit}
            />
          </div>
        </div>

        <div className="lg:col-span-5 lg:row-start-2">
          <ol className="space-y-5">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <li key={title} className="flex gap-4">
                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-champagne/50 bg-champagne/10 text-champagne">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-champagne text-[10px] font-bold text-forest-dark">{index + 1}</span>
                </span>
                <span>
                  <span className="block font-serif text-lg">{title}</span>
                  <span className="block text-sm text-sand/75">{text}</span>
                </span>
              </li>
            ))}
          </ol>

          <p className="mt-8 flex items-start gap-3 border-t border-white/10 pt-6 text-sm text-sand/80">
            <ShieldCheck aria-hidden="true" className="w-5 h-5 text-champagne shrink-0 mt-0.5" />
            Thông tin của bạn chỉ dùng để tư vấn dự án và được bảo mật tuyệt đối.
          </p>
        </div>

      </div>
    </section>
  );
};

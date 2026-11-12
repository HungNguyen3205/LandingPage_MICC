import { useState } from 'react';
import { ArrowRight, Compass, FileImage, Map as MapIcon, ChevronDown } from 'lucide-react';
import type { SelectedUnit } from '../types';

// Unit: [mã căn, loại, diện tích đất m², hướng, giá (tỷ đồng)] — đối chiếu ảnh quỹ căn gốc.
type Unit = [code: string, type: string, land: string, facing: string, price: string];

interface Zone {
  id: string;
  name: string;
  badge: string;
  inspiration?: string;
  image: string;
  priceLabel: string;
  date?: string;
  highlights: { value: string; label: string }[];
  policy: string;
  policyFile: string;
  inventoryFile: string;
  units: Unit[];
}

const zones: Zone[] = [
  {
    id: 'vinh-may', name: 'Vịnh Mây', badge: 'Quỹ độc quyền', inspiration: 'Cảm hứng Malibu Hills', image: '/images/lang-van/ga-cap-treo.webp',
    priceLabel: 'Giá TTTĐ', date: '05/11/2026',
    highlights: [{ value: '13%', label: 'CK dòng tiền/năm' }, { value: '70%', label: 'Vay hỗ trợ lãi suất' }, { value: '0,9%', label: 'Ưu đãi VinClub' }],
    policy: 'Chiết khấu thanh toán sớm 13%/năm, vay 70% với hỗ trợ lãi suất 18 – 60 tháng, bảo lãnh ngân hàng 0,5%, ưu đãi VinClub đến 0,9%.',
    policyFile: '1WjXCHFre2a8-Iuh-70MJV-zZO2fHScVr', inventoryFile: '1_Qpc1FPH7-7RXgpWKpfvotfdbpS7UMLK',
    units: [
      ['VM-03', 'Liền kề', '70', 'Đông Bắc', '5,781'], ['VM-10', 'Liền kề', '75', 'Tây Nam', '6,537'], ['VM-11', 'Liền kề', '105', 'Đông Bắc', '7,221'],
      ['ĐLHV-445', 'Liền kề', '80', 'Tây Nam', '7,676'], ['ĐLHV-447', 'Liền kề', '80', 'Tây Nam', '7,676'],
      ['VM4-42', 'Đơn lập', '283,8', 'Tây Nam', '17,589'], ['VM6-16', 'Đơn lập', '329,6', 'Tây Nam', '45,516'],
    ],
  },
  {
    id: 'bach-van', name: 'Bạch Vân', badge: 'Quỹ chung', inspiration: 'Giữa hồ & suối cảnh quan', image: '/images/lang-van/ho-canh-quan.webp',
    priceLabel: 'Giá Full',
    highlights: [{ value: '13%', label: 'CK dòng tiền/năm' }, { value: '10%', label: 'Ưu đãi về ở sớm' }, { value: '0,9%', label: 'Ưu đãi VinClub' }],
    policy: 'Áp dụng cho quỹ căn giãn xây và thô xây luôn. Chiết khấu thanh toán sớm 13%/năm; ưu đãi về ở sớm 10% dành cho 345 căn thô xây luôn; VinClub 0,5% – 0,9%.',
    policyFile: '1qjhViAxsH3voOxT6W9xN5hK2ylaUFVCm', inventoryFile: '1z9UoYbPUZtLOjP0raAP-o7e6p0U6DDu7',
    units: [
      ['ĐLHV-180', 'Liền kề', '80', 'Tây Bắc', '8,592'], ['ĐLHV-176', 'Liền kề', '80,1', 'Tây Bắc', '8,621'], ['ĐLHV-201', 'Liền kề', '80', 'Tây Nam', '8,735'],
      ['ĐLHV-210', 'Liền kề', '80', 'Tây Bắc', '8,735'], ['ĐLHV-203', 'Liền kề', '80', 'Tây Nam', '8,756'], ['ĐLHV-369', 'Liền kề', '80', 'Đông Nam', '9,041'],
      ['ĐLHV-224', 'Liền kề', '80', 'Tây Bắc', '9,325'], ['ĐLHV-169', 'Liền kề', '80', 'Tây Nam', '9,396'],
    ],
  },
  {
    id: 'dao-ngoc', name: 'Đảo Ngọc', badge: 'Quỹ chung', inspiration: 'Cảm hứng Costa Smeralda', image: '/images/lang-van/cap-treo-bien.webp',
    priceLabel: 'Giá Full', date: '06/11/2026',
    highlights: [{ value: '13%', label: 'CK dòng tiền/năm' }, { value: '10%', label: 'Ưu đãi về ở sớm' }, { value: '7%', label: 'Cam kết thuê/năm' }],
    policy: 'Quỹ căn hoàn thiện xây luôn khu 3. Ưu đãi về ở sớm 10% và cam kết tiền thuê 7%/năm áp dụng có điều kiện theo danh sách căn.',
    policyFile: '1UpRznYtSCbLUEemcXtS7nqANIqpryy4U', inventoryFile: '1tkL6oTUG4vRcg3UU9CJnk6NcTK_0fDCh',
    units: [
      ['LV4-16', 'Liền kề', '80', 'Tây Nam', '11,080'], ['SV1-36', 'Liền kề', '80', 'Tây Nam', '11,167'], ['LV4-29', 'Liền kề', '80', 'Đông Bắc', '11,315'],
      ['LV6-18', 'Liền kề', '80', 'Tây Nam', '11,704'], ['HC5-24', 'Liền kề', '70', 'Đông Bắc', '11,923'], ['HC5-14', 'Liền kề', '70', 'Đông Bắc', '11,936'],
      ['AN5-22', 'Liền kề', '70', 'Đông Bắc', '11,950'], ['LV6-33', 'Liền kề', '80', 'Tây Nam', '11,952'], ['AN3-12', 'Liền kề', '70', 'Đông Bắc', '12,025'],
      ['AN5-05', 'Liền kề', '70', 'Tây Nam', '12,148'], ['AN3-21', 'Liền kề', '70', 'Tây Nam', '12,180'], ['AN5-08', 'Liền kề', '70', 'Đông Bắc', '12,181'],
      ['AN5-26', 'Liền kề', '70', 'Đông Bắc', '12,313'], ['AN3-03', 'Liền kề', '70', 'Tây Nam', '12,378'], ['AN5-25', 'Liền kề', '70', 'Tây Nam', '12,379'],
      ['SV5-23', 'Liền kề', '70', 'Đông Bắc', '12,933'], ['SV5-29', 'Liền kề', '70', 'Đông Bắc', '13,169'], ['SV5-31', 'Liền kề', '70', 'Đông Bắc', '13,527'],
    ],
  },
];

const PREVIEW_ROWS = 8;
const driveFile = (id: string) => `https://drive.google.com/file/d/${id}/view`;

type OnSelectUnit = (unit: SelectedUnit) => void;

const toSelectedUnit = (zone: Zone, [code, type, , , price]: Unit): SelectedUnit => ({
  code, type, price, zone: zone.name, priceLabel: zone.priceLabel,
  productName: type === 'Đơn lập' ? `Biệt Thự Đơn Lập ${zone.name}` : `Liền Kề ${zone.name}`,
});

interface Handlers { onSelectUnit?: OnSelectUnit; onSelectProduct?: (productName: string) => void }

const ZoneCard = ({ zone, index, onSelectUnit, onSelectProduct, hiddenOnMobile }: { zone: Zone; index: number; hiddenOnMobile: boolean } & Handlers) => {
  const [expanded, setExpanded] = useState(false);
  const rows = expanded ? zone.units : zone.units.slice(0, PREVIEW_ROWS);
  const hidden = zone.units.length - PREVIEW_ROWS;

  return (
    <article id={`phan-khu-${zone.id}`} role="tabpanel" className={`group/card ${hiddenOnMobile ? 'hidden lg:flex' : 'flex'} scroll-mt-32 flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_30px_60px_-30px_rgba(10,41,42,.35)] ring-1 ring-champagne/30 transition duration-500 hover:-translate-y-1 hover:shadow-[0_40px_70px_-30px_rgba(10,41,42,.45)] motion-reduce:transform-none`}>
      {/* Cover */}
      <div className="relative isolate h-48 overflow-hidden sm:h-52">
        <img src={zone.image} alt="" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-1000 group-hover/card:scale-105 motion-reduce:transform-none" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-dark via-forest-dark/40 to-black/10" />
        <div className="flex h-full flex-col justify-between p-5 text-white">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] tracking-[.3em] text-champagne-light">0{index + 1}</span>
            <span className="rounded-full border border-champagne/60 bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.2em] text-champagne-light backdrop-blur">{zone.badge}</span>
          </div>
          <div>
            {zone.inspiration && <p className="font-['Great_Vibes'] text-2xl leading-none text-champagne-light">{zone.inspiration}</p>}
            <h3 className="mt-1 font-serif text-3xl tracking-tight sm:text-[34px]">{zone.name}</h3>
            <p className="mt-1 text-xs text-white/75">
              Từ <span className="font-serif text-base text-champagne-light">{zone.units[0][4]} tỷ</span>
              <span className="mx-2 text-white/40">·</span>{zone.units.length} căn đang mở bán
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Policy highlights */}
        <dl className="grid grid-cols-3 divide-x divide-champagne/25 rounded-xl bg-gradient-to-b from-[#fbf6ec] to-[#f5ecdb] py-3 text-center ring-1 ring-champagne/30">
          {zone.highlights.map((h) => (
            <div key={h.label} className="px-1">
              <dt className="sr-only">{h.label}</dt>
              <dd className="font-serif text-2xl font-semibold text-[#9a7438]">{h.value}</dd>
              <dd className="mt-0.5 text-[10px] font-medium uppercase leading-tight tracking-wide text-ink-muted">{h.label}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[13px] leading-relaxed text-ink-muted">{zone.policy}</p>

        {/* Price list */}
        <div className="mt-5" role="region" aria-label={`Bảng giá ${zone.name}`}>
          <div className="flex items-end justify-between border-b border-forest/80 pb-2 text-[10px] font-semibold uppercase tracking-[.2em] text-forest">
            <span>Mã căn · Diện tích · Hướng</span>
            <span>{zone.priceLabel} (tỷ)</span>
          </div>
          <ul>
            {rows.map((unit) => {
              const [code, type, land, facing, price] = unit;
              return (
              <li key={code}>
                <a href="#lien-he" onClick={() => onSelectUnit?.(toSelectedUnit(zone, unit))} aria-label={`Nhận tư vấn căn ${code}, ${zone.priceLabel} ${price} tỷ`} className="group/row -mx-2 flex items-center justify-between gap-3 rounded-lg border-b border-dashed border-forest/10 px-2 py-2.5 transition hover:bg-[#faf5ea]">
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="font-semibold tracking-wide text-forest-dark">{code}</span>
                      {type !== 'Liền kề' && <span className="rounded bg-forest px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-champagne-light">{type}</span>}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1 text-[11px] text-ink-muted">
                      {land} m² đất <Compass aria-hidden="true" className="ml-1 h-3 w-3 text-champagne" /> {facing}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="font-serif text-xl font-semibold tabular-nums text-forest-dark">{price}</span>
                    <ArrowRight aria-hidden="true" className="h-4 w-4 -translate-x-1 text-champagne opacity-0 transition group-hover/row:translate-x-0 group-hover/row:opacity-100" />
                  </span>
                </a>
              </li>
              );
            })}
          </ul>
          {hidden > 0 && (
            <button type="button" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold uppercase tracking-[.15em] text-forest ring-1 ring-forest/15 transition hover:bg-forest hover:text-white">
              {expanded ? 'Thu gọn' : `Xem thêm ${hidden} căn`}
              <ChevronDown aria-hidden="true" className={`h-4 w-4 transition ${expanded ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-6">
          <a href="#lien-he" onClick={() => onSelectProduct?.(`Liền Kề ${zone.name}`)} className="cta-shine relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-forest-dark py-3.5 text-sm font-semibold text-white transition hover:bg-forest">
            Giữ chỗ căn {zone.name} <ArrowRight aria-hidden="true" className="h-4 w-4 text-champagne" />
          </a>
          <div className="mt-3 flex items-center justify-between text-[11px] text-ink-muted">
            <span>{zone.date ? `Cập nhật ${zone.date}` : 'Theo tài liệu quỹ căn'}</span>
            <span className="flex gap-3">
              <a className="inline-flex items-center gap-1 hover:text-forest" href={driveFile(zone.policyFile)} target="_blank" rel="noopener noreferrer"><FileImage aria-hidden="true" className="h-3.5 w-3.5" />Chính sách</a>
              <a className="inline-flex items-center gap-1 hover:text-forest" href={driveFile(zone.inventoryFile)} target="_blank" rel="noopener noreferrer"><MapIcon aria-hidden="true" className="h-3.5 w-3.5" />Mặt bằng</a>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export const SalesPolicy = ({ onSelectUnit, onSelectProduct }: Handlers) => {
  const [activeZone, setActiveZone] = useState(zones[0].id);
  return (
  <section id="bang-gia" className="relative scroll-mt-24 bg-gradient-to-b from-sand to-[#efe9dc] px-4 py-14 sm:px-8 sm:py-20 lg:py-28">
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-80 overflow-hidden"><div className="absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-champagne/15 blur-3xl" /></div>
    <div className="relative mx-auto max-w-content">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[.3em] text-champagne-hover">Bảng giá cập nhật · Tháng 11/2026</p>
        <h2 className="mt-3 font-serif text-3xl text-forest-dark sm:text-5xl">Quỹ căn & chính sách bán hàng</h2>
        <div aria-hidden="true" className="gold-line mx-auto mt-5 w-40" />
        <p className="mt-5 text-sm leading-relaxed text-ink-muted">Giá tham khảo theo tài liệu từng phân khu, đơn vị tỷ đồng. Vịnh Mây niêm yết giá TTTĐ, Bạch Vân và Đảo Ngọc niêm yết giá Full. Bấm vào mã căn để nhận báo giá chi tiết và tình trạng căn mới nhất.</p>
      </div>
      {/* Phone: pick a zone instead of scrolling through all three tables */}
      <div role="tablist" aria-label="Chọn phân khu" className="sticky top-0 z-20 -mx-4 mt-8 grid grid-cols-3 gap-1.5 bg-[#f3eee3]/95 px-4 py-2 backdrop-blur lg:hidden">
        {zones.map((zone) => {
          const active = zone.id === activeZone;
          return (
            <button key={zone.id} type="button" role="tab" aria-selected={active} onClick={() => setActiveZone(zone.id)}
              className={`rounded-xl px-1 py-2 text-center transition ${active ? 'bg-forest-dark text-white shadow-lg' : 'bg-white text-forest ring-1 ring-forest/10'}`}>
              <span className="block font-serif text-[15px] leading-tight">{zone.name}</span>
              <span className={`block text-[11px] ${active ? 'text-champagne-light' : 'text-ink-muted'}`}>từ {zone.units[0][4]} tỷ</span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 grid items-start gap-6 lg:mt-12 lg:grid-cols-3">
        {zones.map((zone, index) => <ZoneCard key={zone.id} zone={zone} index={index} hiddenOnMobile={zone.id !== activeZone} onSelectUnit={onSelectUnit} onSelectProduct={onSelectProduct} />)}
      </div>
      <p className="mt-8 text-center text-xs leading-relaxed text-ink-muted">Chính sách áp dụng từ 05/10/2026 đến khi có chính sách thay thế. Giá và tình trạng căn có thể thay đổi, vui lòng xác nhận với chuyên viên trước khi giao dịch.</p>
    </div>
  </section>
  );
};

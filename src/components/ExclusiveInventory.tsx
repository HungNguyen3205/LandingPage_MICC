import { useMemo, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, Compass, Images, MapPin, Maximize2, Ruler } from 'lucide-react';
import { inventoryUnits, inventoryZones } from '../data/exclusiveInventory';
import type { InventoryUnit, InventoryZone, InventoryZoneId } from '../data/exclusiveInventory';
import type { GalleryItem, SelectedUnit } from '../types';
import { Lightbox } from './Lightbox';

const PRICE_LABEL = 'Giá TTTĐ';
const vnNumber = (n: number) => String(n).replace('.', ',');
const priceText = (n: number) => n.toFixed(3).replace('.', ',');
const img = (slug: string, suffix = '') => `/images/quy-hang/${slug}${suffix}.webp`;

const unitsOf = (zone: InventoryZoneId) =>
  inventoryUnits.filter((u) => u.zone === zone).sort((a, b) => a.price - b.price);

// Bộ lọc chỉ hiện khi phân khu có căn khớp và không phải toàn bộ căn
type FilterId = 'all' | 'lien-ke' | 'goc' | 'biet-thu' | 'hoan-thien';
const filters: { id: FilterId; label: string; test: (u: InventoryUnit) => boolean }[] = [
  { id: 'all', label: 'Tất cả', test: () => true },
  { id: 'lien-ke', label: 'Liền kề', test: (u) => u.kind === 'Liền kề' },
  { id: 'goc', label: 'Căn góc', test: (u) => u.kind === 'Liền kề góc' },
  { id: 'biet-thu', label: 'Biệt thự', test: (u) => u.kind === 'Biệt thự đơn lập' },
  { id: 'hoan-thien', label: 'Hoàn thiện sẵn', test: (u) => u.handover === 'Hoàn thiện' },
];

const productNameOf = (u: InventoryUnit, zone: InventoryZone) => {
  if (u.kind === 'Biệt thự đơn lập') return zone.id === 'vinh-may' ? 'Biệt Thự Đơn Lập Vịnh Mây' : 'Cần tư vấn thêm';
  return `Liền Kề ${zone.name}`;
};

const galleryOf = (u: InventoryUnit): GalleryItem[] => {
  const caption = `${u.kind} · ${vnNumber(u.land)} m² đất · Hướng ${u.facing} · ${PRICE_LABEL} ${priceText(u.price)} tỷ`;
  return [
    { id: u.slug, title: `Căn ${u.code}`, caption, image: img(u.slug) },
    ...u.extras.map((label, i) => ({ id: `${u.slug}-${i + 1}`, title: `${u.code} · ${label}`, caption, image: img(u.slug, `-${i + 1}`) })),
  ];
};

interface Props {
  onSelectUnit?: (unit: SelectedUnit) => void;
}

/**
 * Quỹ hàng độc quyền: 3 tab phân khu → lọc nhanh → lưới poster căn (giá tăng dần).
 * Mỗi lần chỉ hiện vài căn, bấm "Xem thêm" để mở tiếp, tránh dồn 54 căn lên một màn hình.
 */
export const ExclusiveInventory = ({ onSelectUnit }: Props) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [zoneId, setZoneId] = useState<InventoryZoneId>('bach-van');
  const [filter, setFilter] = useState<FilterId>('all');
  const zone = inventoryZones.find((z) => z.id === zoneId)!;
  // Điện thoại: thẻ ngang xếp 1 cột nên mỗi lần chỉ mở 4 căn cho đỡ dài
  const [isPhone] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches);
  const pageSizeOf = (z: InventoryZone) => (z.portrait ? 8 : isPhone ? 4 : 6);
  const pageSize = pageSizeOf(zone);
  const [visible, setVisible] = useState(pageSize);
  const [gallery, setGallery] = useState<GalleryItem[] | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const zoneUnits = useMemo(() => unitsOf(zoneId), [zoneId]);
  const zoneFilters = filters.filter((f) => {
    if (f.id === 'all') return true;
    const n = zoneUnits.filter(f.test).length;
    return n > 0 && n < zoneUnits.length;
  });
  const activeFilter = filters.find((f) => f.id === filter)!;
  const shown = zoneUnits.filter(activeFilter.test);
  const remaining = shown.length - visible;

  const total = inventoryUnits.length;
  const minPrice = Math.min(...inventoryUnits.map((u) => u.price));

  const pickZone = (id: InventoryZoneId) => {
    setZoneId(id);
    setFilter('all');
    setVisible(pageSizeOf(inventoryZones.find((z) => z.id === id)!));
  };

  const pickFilter = (id: FilterId) => {
    setFilter(id);
    setVisible(pageSize);
  };

  const collapse = () => {
    setVisible(pageSize);
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openGallery = (u: InventoryUnit) => {
    setGallery(galleryOf(u));
    setGalleryIndex(0);
  };

  const selectUnit = (u: InventoryUnit) =>
    onSelectUnit?.({
      code: u.code,
      zone: zone.name,
      type: u.kind,
      price: priceText(u.price),
      priceLabel: PRICE_LABEL,
      productName: productNameOf(u, zone),
    });

  return (
    <section
      id="quy-can"
      ref={sectionRef}
      className="scroll-mt-20 bg-sand py-16 text-ink sm:py-20 lg:py-24"
    >
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề */}
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
          <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.25em] text-champagne-hover sm:text-[13px]">
            Quỹ hàng độc quyền · MICC Group
          </span>
          <h2 className="mb-3 font-serif text-3xl font-normal leading-[1.2] tracking-tight text-forest sm:text-4xl lg:text-[44px]">
            {total} căn tại 3 phân khu, từ {vnNumber(minPrice)} tỷ.
          </h2>
          <p className="text-base leading-relaxed text-ink-muted">
            Chọn phân khu, lọc theo nhu cầu, bấm vào ảnh để xem trọn thông tin, giá và mặt bằng của từng căn.
          </p>
        </div>

        {/* Tab phân khu */}
        <div role="tablist" aria-label="Chọn phân khu" className="grid grid-cols-3 gap-2 sm:gap-4">
          {inventoryZones.map((z) => {
            const list = unitsOf(z.id);
            const active = z.id === zoneId;
            return (
              <button
                key={z.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls="quy-can-panel"
                onClick={() => pickZone(z.id)}
                className={`group relative isolate h-24 overflow-hidden rounded-xl text-left text-white transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-sand sm:h-32 lg:h-36 ${
                  active ? 'ring-2 ring-champagne shadow-gold' : 'opacity-80 hover:opacity-100'
                }`}
              >
                <img
                  src={z.cover}
                  alt=""
                  loading="lazy"
                  className={`absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-105 ${active ? '' : 'grayscale-[40%]'}`}
                />
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 -z-10 bg-gradient-to-t ${active ? 'from-forest-dark/95 via-forest-dark/45' : 'from-forest-dark/90 via-forest-dark/60'} to-transparent`}
                />
                <span className="flex h-full flex-col justify-end p-2.5 sm:p-4">
                  <span className="hidden text-[11px] italic text-champagne-light/90 sm:block">{z.tagline}</span>
                  <span className="font-serif text-base leading-tight sm:text-2xl">{z.name}</span>
                  <span className="mt-0.5 text-[10px] text-white/75 sm:text-xs">
                    {list.length} căn
                    <span className="hidden sm:inline"> · từ {vnNumber(list[0].price)} tỷ</span>
                  </span>
                </span>
                {active && <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] bg-champagne" />}
              </button>
            );
          })}
        </div>

        {/* Bộ lọc */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 sm:mt-8">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Lọc loại căn">
            {zoneFilters.map((f) => {
              const count = zoneUnits.filter(f.test).length;
              const active = f.id === filter;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => pickFilter(f.id)}
                  className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne ${
                    active
                      ? 'bg-forest text-white'
                      : 'bg-white text-ink-muted ring-1 ring-forest/10 hover:text-forest hover:ring-champagne'
                  }`}
                >
                  {f.label} <span className={active ? 'text-champagne-light' : 'text-ink-light'}>{count}</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-ink-light">Sắp xếp theo giá tăng dần</p>
        </div>

        {/* Lưới căn */}
        <div
          id="quy-can-panel"
          role="tabpanel"
          aria-label={`Quỹ căn ${zone.name}`}
          className={`mt-5 grid gap-3 sm:gap-5 ${zone.portrait ? 'grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3'}`}
        >
          {shown.slice(0, visible).map((u) => (
            <UnitCard key={u.code} unit={u} zone={zone} onOpen={() => openGallery(u)} onSelect={() => selectUnit(u)} />
          ))}
        </div>

        {/* Xem thêm / thu gọn */}
        {shown.length > pageSize && (
          <div className="mt-8 flex justify-center">
            {remaining > 0 ? (
              <button
                type="button"
                onClick={() => setVisible((v) => v + pageSize)}
                className="flex items-center gap-2 rounded-full border border-forest/20 bg-white px-6 py-3 text-sm font-semibold text-forest transition hover:border-champagne hover:shadow-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
              >
                Xem thêm {Math.min(pageSize, remaining)} căn
                {remaining > pageSize && <span className="font-normal text-ink-light">· còn {remaining}</span>}
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={collapse}
                className="text-sm font-semibold text-ink-muted underline-offset-4 hover:text-forest hover:underline"
              >
                Thu gọn danh sách
              </button>
            )}
          </div>
        )}

        <p className="mt-8 text-center text-xs leading-relaxed text-ink-light">
          {PRICE_LABEL}: giá thanh toán theo tiến độ, đã gồm VAT và KPBT, tạm tính làm tròn. Quỹ căn và giá thay đổi theo thời điểm, vui lòng liên hệ để kiểm tra căn còn trống.
        </p>
      </div>

      <Lightbox
        items={gallery ?? []}
        currentIndex={galleryIndex}
        isOpen={gallery !== null}
        onClose={() => setGallery(null)}
        onNavigate={setGalleryIndex}
        note="* Giá và chính sách theo thời điểm phát hành, vui lòng liên hệ để cập nhật mới nhất"
      />
    </section>
  );
};

const UnitCard = ({ unit: u, zone, onOpen, onSelect }: { unit: InventoryUnit; zone: InventoryZone; onOpen: () => void; onSelect: () => void }) => {
  const compact = zone.portrait;
  const photos = u.extras.length + 1;
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-champagne/25 transition duration-300 hover:-translate-y-1 hover:shadow-elevated hover:ring-champagne/60 motion-reduce:transform-none">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Xem chi tiết căn ${u.code}`}
        className="relative block w-full overflow-hidden bg-forest-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-champagne"
        style={{ aspectRatio: zone.ratio }}
      >
        <img
          src={img(u.slug, '-sm')}
          alt={`Căn ${u.code} – ${u.kind} ${vnNumber(u.land)} m², ${zone.name}`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        {u.handover === 'Hoàn thiện' && (
          <span className="absolute left-2 top-2 rounded-full bg-champagne px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-forest-dark shadow">
            Hoàn thiện sẵn
          </span>
        )}
        {photos > 1 && (
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
            <Images className="h-3 w-3" aria-hidden="true" />
            {photos} ảnh
          </span>
        )}
        <span className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-semibold text-white opacity-0 backdrop-blur transition duration-300 group-hover:opacity-100">
          <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
          Xem chi tiết
        </span>
      </button>

      <div className={`flex flex-1 flex-col ${compact ? 'p-3 sm:p-4' : 'p-4 sm:p-5'}`}>
        <div className={`flex justify-between gap-2 ${compact ? 'flex-col sm:flex-row sm:items-baseline' : 'items-baseline'}`}>
          <h3 className={`font-serif leading-none tracking-wide text-forest ${compact ? 'text-lg sm:text-xl' : 'text-[22px]'}`}>{u.code}</h3>
          <p className="whitespace-nowrap text-right leading-none">
            <span className={`font-serif font-semibold text-[#9a7438] ${compact ? 'text-base sm:text-lg' : 'text-xl'}`}>{priceText(u.price)}</span>
            <span className="ml-1 text-xs text-ink-muted">tỷ</span>
          </p>
        </div>

        <ul className={`mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-ink-muted ${compact ? 'text-[11px] sm:text-xs' : 'text-[13px]'}`}>
          <li className="flex items-center gap-1">
            <Ruler className="h-3.5 w-3.5 text-champagne-hover" aria-hidden="true" />
            {vnNumber(u.land)} m²
          </li>
          <li className="flex items-center gap-1">
            <Compass className="h-3.5 w-3.5 text-champagne-hover" aria-hidden="true" />
            {u.facing}
          </li>
          <li className={compact ? 'hidden sm:block' : ''}>{u.kind === 'Liền kề' ? u.handover : u.kind}</li>
        </ul>

        {u.location && !compact && (
          <p className="mt-2 flex items-start gap-1.5 text-[13px] leading-snug text-ink-muted">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-champagne-hover" aria-hidden="true" />
            <span className="line-clamp-1">{u.location}</span>
          </p>
        )}

        <div aria-hidden="true" className={`flex-1 ${compact ? 'min-h-3' : 'min-h-4'}`} />
        <a
          href="#lien-he"
          onClick={onSelect}
          aria-label={`Nhận báo giá căn ${u.code}`}
          className={`flex items-center justify-center gap-1.5 rounded-full border border-forest/15 font-semibold text-forest transition hover:border-forest hover:bg-forest hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne ${
            compact ? 'py-2 text-xs' : 'py-2.5 text-[13px]'
          }`}
        >
          Nhận báo giá
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
};

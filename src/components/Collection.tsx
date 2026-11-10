import React, { useState } from 'react';
import { productsData } from '../data/projectData';
import type { ProductCategory, ProductItem } from '../types';
import {
  ArrowRight,
  Maximize2,
  Tag,
  RotateCw,
  Building2,
  ShieldCheck,
  Sparkles,
  Check,
  Home
} from 'lucide-react';

interface CollectionProps {
  onSelectProduct: (productName: string) => void;
}

interface ProductCardProps {
  product: ProductItem;
  onSelect: (product: ProductItem) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Desktop Hover: Di chuột vào thẻ là lật sang mặt sau
  const handleMouseEnter = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      setIsFlipped(true);
    }
  };

  // Desktop Hover Out: Rê chuột ra ngoài là lật về mặt trước
  const handleMouseLeave = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      setIsFlipped(false);
    }
  };

  // Chạm trên Điện thoại / Bấm trên Desktop:
  const handleCardClick = () => {
    const isTouch = typeof window !== 'undefined' && !window.matchMedia('(hover: hover)').matches;
    if (isTouch) {
      // Trên điện thoại cảm ứng: Chạm vào thẻ là lật xoay 180 độ; chạm lần nữa là lật lại!
      setIsFlipped((prev) => !prev);
    } else {
      // Trên desktop: Giữ vững trạng thái lật để xem chi tiết
      setIsFlipped(true);
    }
  };

  // Nút lật lại mặt trước (ở cả mặt sau và góc thẻ)
  const handleFlipBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(false);
  };

  // Nút xem thông số ở mặt trước
  const handleFrontFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(true);
  };

  // Nút CTA nhận bảng giá: chọn sản phẩm và cuộn xuống form
  const handleCtaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(product);
  };

  return (
    <div
      className="perspective-1200 w-full h-[550px] group cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      aria-label={`Thẻ sản phẩm ${product.name}. Chạm hoặc di chuột để xem chi tiết thông số và lật thẻ.`}
    >
      <div
        className="w-full h-full relative transform-style-3d transition-transform duration-500 ease-in-out"
        style={{
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* ======================================================== */}
        {/* MẶT TRƯỚC (FRONT FACE - SHOWCASE VIEW)                    */}
        {/* ======================================================== */}
        <article className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-luxury overflow-hidden border border-forest/15 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">

          {/* Top: Image Section */}
          <div className="relative h-[225px] w-full overflow-hidden bg-sand-muted shrink-0">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Subtle dark gradient scrim on top and bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

            {/* Top-left: Category Badge */}
            <div className="absolute top-3.5 left-3.5 bg-forest-dark/90 backdrop-blur-md text-champagne text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-sm border border-champagne/30 shadow-sm">
              {product.categoryLabel}
            </div>

            {/* Top-right: Flip Hint Badge */}
            <button
              type="button"
              onClick={handleFrontFlip}
              className="absolute top-3.5 right-3.5 bg-black/50 hover:bg-forest text-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide flex items-center space-x-1.5 border border-white/20 transition-all shadow-sm"
              title="Nhấn để lật thẻ xem thông số"
            >
              <RotateCw className="w-3 h-3 text-champagne transition-transform group-hover:rotate-180 duration-500" />
              <span className="hidden sm:inline">Lật thẻ</span>
            </button>

            {/* Bottom-left: Area Tag */}
            <div className="absolute bottom-3.5 left-3.5 bg-white/95 backdrop-blur-md text-forest text-xs font-semibold px-2.5 py-1 rounded flex items-center space-x-1.5 shadow-sm border border-forest/10">
              <Maximize2 className="w-3.5 h-3.5 text-champagne" />
              <span>{product.area}</span>
            </div>

            {/* Bottom-right: Subdivision Tag */}
            <div className="absolute bottom-3.5 right-3.5 bg-champagne/90 backdrop-blur-md text-forest-dark text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow-sm">
              {product.tags[product.tags.length - 1] || 'Đang mở bán'}
            </div>
          </div>

          {/* Middle: Details Body */}
          <div className="p-5 flex flex-col flex-grow justify-between">
            <div>
              {/* Product Title (2-line fixed height) */}
              <h3 className="font-serif text-[19px] sm:text-[20px] font-normal text-forest leading-[1.3] line-clamp-2 h-[50px] mb-1 group-hover:text-forest-light transition-colors">
                {product.name}
              </h3>

              {/* Sub-label: Phân khu */}
              <span className="text-[11px] font-mono tracking-wider text-champagne uppercase block mb-2 line-clamp-1">
                {product.specs?.subdivision || 'Vinhomes Hải Vân Bay'}
              </span>

              {/* Brief Description (2-line fixed height) */}
              <p className="text-ink-muted text-xs leading-relaxed line-clamp-2 h-[34px] mb-3">
                {product.description}
              </p>

              {/* Feature Tags (Curated 4 tags) */}
              <div className="grid grid-cols-2 gap-1.5 mb-2">
                {product.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center text-[10.5px] text-ink-muted bg-sand px-2 py-1 rounded border border-forest/5 truncate"
                  >
                    <Tag className="w-2.5 h-2.5 mr-1 text-champagne shrink-0" />
                    <span className="truncate">{tag}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom: Price & Flip Action Row */}
            <div className="pt-3.5 border-t border-forest/10 flex items-center justify-between mt-auto">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-ink-muted/80">
                  Giá tham khảo
                </span>
                <span className="font-serif text-lg sm:text-[19px] font-bold text-forest leading-tight">
                  {product.priceNote}
                </span>
              </div>

              <button
                type="button"
                onClick={handleFrontFlip}
                className="inline-flex items-center justify-center px-3.5 py-2 rounded-luxury bg-forest hover:bg-forest-light text-white text-xs font-medium tracking-wide transition-all duration-200 shadow-sm group/btn focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
              >
                <span>Xem thông số</span>
                <RotateCw className="ml-1.5 w-3.5 h-3.5 text-champagne transition-transform group-hover/btn:rotate-180 duration-500" />
              </button>
            </div>
          </div>

        </article>

        {/* ======================================================== */}
        {/* MẶT SAU (BACK FACE - ARCHITECTURAL DOSSIER & ACTION)     */}
        {/* ======================================================== */}
        <article className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-b from-[#0A292A] via-[#123C3B] to-[#072021] text-white rounded-luxury overflow-hidden border border-champagne/40 shadow-elevated p-5 sm:p-6 flex flex-col justify-between">

          {/* Back Top: Header Info */}
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-3">
              <span className="text-champagne font-mono text-[10px] tracking-[0.2em] uppercase">
                THÔNG SỐ & MẶT BẰNG CHI TIẾT
              </span>
              <button
                type="button"
                onClick={handleFlipBack}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-champagne transition-colors"
                title="Lật lại mặt trước"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Back Product Name */}
            <h3 className="font-serif text-xl font-normal text-white mb-0.5 leading-snug line-clamp-1">
              {product.name}
            </h3>
            <p className="text-[11px] text-champagne-light/80 font-light mb-3 line-clamp-1">
              {product.specs?.subdivision}
            </p>

            {/* 4 Architectural Specifications (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-2 mb-3.5">
              <div className="bg-white/5 border border-white/10 rounded p-2 flex flex-col">
                <span className="text-[10px] text-sand/60 font-mono uppercase flex items-center space-x-1">
                  <Maximize2 className="w-2.5 h-2.5 text-champagne mr-1" />
                  Diện tích
                </span>
                <span className="text-xs font-semibold text-white mt-0.5 truncate">
                  {product.area}
                </span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded p-2 flex flex-col">
                <span className="text-[10px] text-sand/60 font-mono uppercase flex items-center space-x-1">
                  <Building2 className="w-2.5 h-2.5 text-champagne mr-1" />
                  Quy mô
                </span>
                <span className="text-xs font-semibold text-white mt-0.5 truncate">
                  {product.specs?.floors || '3 tầng'}
                </span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded p-2 flex flex-col">
                <span className="text-[10px] text-sand/60 font-mono uppercase flex items-center space-x-1">
                  <Home className="w-2.5 h-2.5 text-champagne mr-1" />
                  Công năng
                </span>
                <span className="text-xs font-semibold text-white mt-0.5 truncate">
                  {product.specs?.bedrooms || '3-4 Phòng ngủ'}
                </span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded p-2 flex flex-col">
                <span className="text-[10px] text-sand/60 font-mono uppercase flex items-center space-x-1">
                  <ShieldCheck className="w-2.5 h-2.5 text-champagne mr-1" />
                  Pháp lý
                </span>
                <span className="text-xs font-semibold text-white mt-0.5 truncate">
                  {product.specs?.legal || 'Sổ hồng lâu dài'}
                </span>
              </div>
            </div>

            {/* Sales Policies Box */}
            <div className="bg-champagne/10 border border-champagne/30 rounded p-2.5 sm:p-3 mb-2">
              <div className="flex items-center space-x-1.5 text-champagne text-[10px] font-mono tracking-wider uppercase mb-1.5 font-semibold">
                <Sparkles className="w-3 h-3 text-champagne shrink-0" />
                <span>CHÍNH SÁCH BÁN HÀNG ĐẶC QUYỀN</span>
              </div>
              <ul className="space-y-1 text-[11px] text-sand/90 font-light">
                {product.specs?.policies.map((policy) => (
                  <li key={policy} className="flex items-start space-x-1.5 leading-tight">
                    <Check className="w-3 h-3 text-champagne shrink-0 mt-0.5 stroke-[2.5]" />
                    <span className="line-clamp-1">{policy}</span>
                  </li>
                )) || (
                  <li className="flex items-start space-x-1.5">
                    <Check className="w-3 h-3 text-champagne shrink-0 mt-0.5" />
                    <span>Hỗ trợ lãi suất 0% 24 tháng, vay 80%</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Back Bottom: Price & Primary CTA */}
          <div className="pt-2 border-t border-white/10 mt-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-sand/60 uppercase font-mono">Giá tham khảo</span>
              <span className="text-sm font-bold text-champagne font-serif">{product.priceNote}</span>
            </div>

            <button
              type="button"
              onClick={handleCtaClick}
              className="w-full py-2.5 px-4 rounded-luxury bg-champagne hover:bg-champagne-hover text-forest-dark font-semibold text-xs sm:text-sm tracking-wide transition-all duration-200 shadow-gold flex items-center justify-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
            >
              <span>Nhận Bảng Giá & Mặt Bằng</span>
              <ArrowRight className="w-4 h-4 text-forest-dark" />
            </button>

            <button
              type="button"
              onClick={handleFlipBack}
              className="w-full text-center text-[10.5px] text-sand/60 hover:text-champagne transition-colors mt-2 flex items-center justify-center space-x-1"
            >
              <RotateCw className="w-3 h-3 text-champagne/70" />
              <span>Chạm để quay lại mặt trước</span>
            </button>
          </div>

        </article>
      </div>
    </div>
  );
};

export const Collection: React.FC<CollectionProps> = ({ onSelectProduct }) => {
  const [activeTab, setActiveTab] = useState<ProductCategory>('all');

  const filteredProducts = productsData.filter((product) => {
    if (activeTab === 'all') return true;
    return product.category === activeTab;
  });

  const handleSelectProduct = (product: ProductItem) => {
    onSelectProduct(product.name);
    const formElement = document.getElementById('lien-he');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="bo-suu-tap" className="py-20 lg:py-28 bg-[#F4F1E8] relative">
      <span id="san-pham" className="sr-only" aria-hidden="true" />
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14">
          <div className="max-w-xl">
            <span className="text-champagne text-xs sm:text-[13px] font-semibold tracking-[0.25em] uppercase block mb-3">
              02 / BỘ SƯU TẬP
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-normal text-forest leading-[1.2] tracking-tight mb-4">
              Chọn dấu ấn của riêng bạn.
            </h2>
            <p className="text-ink-muted text-base leading-relaxed">
              Tập hợp các không gian sống nghỉ dưỡng giới hạn tại Vinhomes Hải Vân Bay, được định hình bởi sự tinh tế và tính riêng tư tuyệt đối.
            </p>
          </div>

          {/* Interactive Flip Hint & Price Notice */}
          <div className="mt-6 md:mt-0 flex flex-col md:items-end space-y-2">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-forest text-champagne-light text-xs font-medium border border-champagne/30 shadow-sm">
              <RotateCw className="w-3.5 h-3.5 mr-2 text-champagne animate-spin-slow" />
              <span>Di chuột hoặc chạm vào thẻ để lật xem thông số & chính sách</span>
            </div>
            <span className="text-[11px] text-ink-muted">
              * Mức giá công bố tham khảo theo bảng giá phân phối chính thức
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 sm:space-x-3 mb-10 overflow-x-auto pb-2 scrollbar-none" role="tablist" aria-label="Bộ lọc dòng sản phẩm">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2.5 rounded-luxury text-sm font-medium tracking-wide transition-all duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne ${
              activeTab === 'all'
                ? 'bg-forest text-white shadow-sm'
                : 'bg-white/80 text-ink-muted hover:text-forest hover:bg-white border border-forest/10'
            }`}
          >
            Tất cả ({productsData.length})
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'villa'}
            onClick={() => setActiveTab('villa')}
            className={`px-5 py-2.5 rounded-luxury text-sm font-medium tracking-wide transition-all duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne ${
              activeTab === 'villa'
                ? 'bg-forest text-white shadow-sm'
                : 'bg-white/80 text-ink-muted hover:text-forest hover:bg-white border border-forest/10'
            }`}
          >
            Biệt thự ({productsData.filter((p) => p.category === 'villa').length})
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'townhouse'}
            onClick={() => setActiveTab('townhouse')}
            className={`px-5 py-2.5 rounded-luxury text-sm font-medium tracking-wide transition-all duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne ${
              activeTab === 'townhouse'
                ? 'bg-forest text-white shadow-sm'
                : 'bg-white/80 text-ink-muted hover:text-forest hover:bg-white border border-forest/10'
            }`}
          >
            Nhà liền kề ({productsData.filter((p) => p.category === 'townhouse').length})
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'shophouse'}
            onClick={() => setActiveTab('shophouse')}
            className={`px-5 py-2.5 rounded-luxury text-sm font-medium tracking-wide transition-all duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne ${
              activeTab === 'shophouse'
                ? 'bg-forest text-white shadow-sm'
                : 'bg-white/80 text-ink-muted hover:text-forest hover:bg-white border border-forest/10'
            }`}
          >
            Thương mại & Căn hộ ({productsData.filter((p) => p.category === 'shophouse').length})
          </button>
        </div>

        {/* Product Cards Grid with 3D Flip System */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={handleSelectProduct}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

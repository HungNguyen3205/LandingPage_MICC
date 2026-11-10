import React from 'react';
import { Compass, Waves, Building2, Palmtree, MapPin } from 'lucide-react';

export const Location: React.FC = () => {
  return (
    <section id="vi-tri" className="py-20 lg:py-28 bg-[#F4F1E8] relative overflow-hidden">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <div className="flex items-center space-x-2 text-champagne text-xs sm:text-[13px] font-semibold tracking-[0.25em] uppercase mb-3">
            <span>04 / VỊ TRÍ & LIÊN KẾT KHÔNG GIAN</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-normal text-forest leading-[1.2] tracking-tight mb-4">
            Tựa sơn hướng hải. <br />
            <span className="text-forest-light font-serif">Tâm điểm giao thương Tây Bắc Đà Nẵng.</span>
          </h2>
          <p className="text-ink-muted text-base leading-relaxed">
            Tọa lạc kề cận vịnh Hải Vân nguyên sơ và cung đèo di sản tráng lệ, Vinhomes Hải Vân Bay sở hữu vị thế phong thủy thịnh vượng hiếm có, kết nối đồng bộ qua trục đại lộ Nguyễn Tất Thành nối dài và hệ thống cao tốc đối ngoại.
          </p>
        </div>

        {/* 2-Column Content: Left Details & Pillars, Right Visual & Illustrative Schematic */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

          {/* Left: 3 Core Connection Axes + Travel Times */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white p-5 sm:p-6 rounded-luxury border border-forest/10 shadow-subtle flex items-start space-x-4">
              <div className="w-11 h-11 rounded-full bg-sand flex items-center justify-center text-forest shrink-0 border border-forest/10">
                <Waves className="w-5 h-5 text-champagne" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-forest mb-1">
                  Thiên nhiên & Vịnh biển Hải Vân
                </h3>
                <p className="text-ink-muted text-sm leading-relaxed">
                  2km bờ biển riêng tư phẳng lặng, đón gió đại dương thanh mát và tầm nhìn ôm trọn vịnh biển di sản.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-luxury border border-forest/10 shadow-subtle flex items-start space-x-4">
              <div className="w-11 h-11 rounded-full bg-sand flex items-center justify-center text-forest shrink-0 border border-forest/10">
                <Building2 className="w-5 h-5 text-champagne" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-forest mb-1">
                  Nhịp sống Trung tâm Đô thị
                </h3>
                <p className="text-ink-muted text-sm leading-relaxed">
                  Thuận tiện di chuyển vào trung tâm quận Liên Chiểu và các cây cầu biểu tượng bắc qua dòng sông Hàn.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-luxury border border-forest/10 shadow-subtle flex items-start space-x-4">
              <div className="w-11 h-11 rounded-full bg-sand flex items-center justify-center text-forest shrink-0 border border-forest/10">
                <Palmtree className="w-5 h-5 text-champagne" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-forest mb-1">
                  Cung đường Di sản Miền Trung
                </h3>
                <p className="text-ink-muted text-sm leading-relaxed">
                  Cửa ngõ kết nối cố đô Huế, vịnh Lăng Cô, thánh địa Mỹ Sơn và di sản văn hóa thế giới Phố cổ Hội An.
                </p>
              </div>
            </div>

            {/* Travel Time Milestones from haivanbaydanang.com.vn */}
            <div className="bg-white p-5 sm:p-6 rounded-luxury border border-forest/10 shadow-subtle">
              <h3 className="font-serif text-xs font-semibold text-forest mb-3.5 uppercase tracking-wider text-champagne">
                Thời Gian Kết Nối Trọng Điểm
              </h3>
              <div className="grid grid-cols-2 gap-3.5">
                <div className="border-l-2 border-champagne pl-3 py-0.5">
                  <span className="font-serif text-lg sm:text-xl font-bold text-forest block leading-tight">15 Phút</span>
                  <span className="text-xs text-ink-muted">Ga Đà Nẵng</span>
                </div>
                <div className="border-l-2 border-champagne pl-3 py-0.5">
                  <span className="font-serif text-lg sm:text-xl font-bold text-forest block leading-tight">20 Phút</span>
                  <span className="text-xs text-ink-muted">Trung tâm TP Đà Nẵng</span>
                </div>
                <div className="border-l-2 border-champagne pl-3 py-0.5">
                  <span className="font-serif text-lg sm:text-xl font-bold text-forest block leading-tight">25 Phút</span>
                  <span className="text-xs text-ink-muted">Phố cổ Hội An</span>
                </div>
                <div className="border-l-2 border-champagne pl-3 py-0.5">
                  <span className="font-serif text-lg sm:text-xl font-bold text-forest block leading-tight">30 Phút</span>
                  <span className="text-xs text-ink-muted">Sân bay Quốc tế Đà Nẵng</span>
                </div>
              </div>
            </div>

            {/* Official notice */}
            <div className="p-3.5 rounded bg-forest/5 border border-forest/10 flex items-center space-x-3 text-xs text-ink-muted">
              <Compass className="w-4 h-4 text-champagne shrink-0" />
              <span>
                <strong>Vị trí:</strong> Vịnh Hải Vân, Đường Nguyễn Tất Thành nối dài, Q. Liên Chiểu, TP. Đà Nẵng.
              </span>
            </div>
          </div>

          {/* Right: Evocative Coastline Photo & Illustrative Schematic Layout */}
          <div className="lg:col-span-7 flex flex-col space-y-6">

            {/* Evocative Landscape Image */}
            <div className="relative rounded-luxury overflow-hidden shadow-card border border-forest/10 aspect-[16/9]">
              <img
                src="/images/dao-ngoc.webp"
                alt="Toàn cảnh phân khu Đảo Ngọc từ trên cao"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white">
                <div>
                  <span className="text-[11px] font-mono tracking-widest text-champagne uppercase block">
                    CẢM HỨNG ĐỊA ĐIỂM
                  </span>
                  <span className="font-serif text-lg font-light">
                    Vịnh biển Hải Vân Đà Nẵng
                  </span>
                </div>
                <span className="text-xs text-sand/80 bg-forest-dark/70 px-2.5 py-1 rounded border border-white/10">
                  Cảnh quan thực tế
                </span>
              </div>
            </div>

            {/* Minimalist Architectural Illustrative Schematic Diagram */}
            <div className="bg-forest-dark text-white p-6 sm:p-7 rounded-luxury border border-champagne/20 shadow-subtle relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-champagne" />
                  <span className="text-xs font-mono tracking-widest uppercase text-champagne">
                    SƠ ĐỒ TỔ CHỨC KHÔNG GIAN DỰ ÁN
                  </span>
                </div>
                <span className="text-[11px] text-sand/60 italic">Quy mô 240ha</span>
              </div>

              {/* Vector diagram showing concept axes */}
              <div className="relative py-4 px-2 sm:px-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">

                  {/* Axis 1 */}
                  <div className="p-3 rounded bg-white/5 border border-white/10 flex flex-col items-center">
                    <span className="text-champagne font-mono text-xs mb-1">TRỤC BIỂN & DU THUYỀN</span>
                    <span className="font-serif text-sm text-sand font-medium">2km Bờ Biển Riêng</span>
                    <span className="text-[11px] text-sand/60 mt-1">Bến du thuyền & Beach Club</span>
                  </div>

                  {/* Core Sanctuary */}
                  <div className="p-3.5 rounded bg-champagne/15 border border-champagne/40 flex flex-col items-center shadow-gold">
                    <span className="text-champagne font-mono text-xs font-bold mb-1">VINHOMES HẢI VÂN BAY</span>
                    <span className="font-serif text-base text-white font-semibold">Tâm Điểm Nghỉ Dưỡng</span>
                    <span className="text-[11px] text-champagne-light/90 mt-1">Biệt thự • Liền kề • Shophouse</span>
                  </div>

                  {/* Axis 2 */}
                  <div className="p-3 rounded bg-white/5 border border-white/10 flex flex-col items-center">
                    <span className="text-champagne font-mono text-xs mb-1">HỆ TIỆN ÍCH VINGROUP</span>
                    <span className="font-serif text-sm text-sand font-medium">Vincom • Vinschool • Vinmec</span>
                    <span className="text-[11px] text-sand/60 mt-1">Chuẩn mực sống 5 sao</span>
                  </div>

                </div>

                <div className="mt-4 text-center">
                  <p className="text-[11px] text-sand/60">
                    * Sơ đồ phác họa mô hình tổ chức không gian định hướng. Thông tin bản đồ chi tiết sẽ được công bố kèm hồ sơ quy hoạch dự án.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

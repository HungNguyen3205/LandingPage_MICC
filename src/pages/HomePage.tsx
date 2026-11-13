import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { ValueStrip } from '../components/ValueStrip';
import { Overview } from '../components/Overview';
import { Collection } from '../components/Collection';
import { Amenities } from '../components/Amenities';
import { Location } from '../components/Location';
import { Gallery } from '../components/Gallery';
import { Experiences } from '../components/Experiences';
import { StoryCta } from '../components/StoryCta';
import { JourneyBar } from '../components/JourneyBar';
import { SalesPolicy } from '../components/SalesPolicy';
import { UnitShowcase } from '../components/UnitShowcase';
import { featureFlags } from '../data/projectData';
import { FAQ } from '../components/FAQ';
import { ConsultationForm } from '../components/ConsultationForm';
import type { SelectedUnit } from '../types';

/** Fade-up each section's content the first time it scrolls into view. */
const useScrollReveal = (root: React.RefObject<HTMLDivElement | null>) => {
  useEffect(() => {
    const container = root.current;
    if (!container || !('IntersectionObserver' in window)) return;
    const targets = Array.from(container.querySelectorAll<HTMLElement>(':scope > section:not(:first-of-type) > div:not([aria-hidden])'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    targets.forEach((el) => {
      // Content already on screen (e.g. arriving via a hash link) shows immediately.
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.setAttribute('data-reveal', '');
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, [root]);
};

export const HomePage: React.FC = () => {
  const [selectedProductForConsultation, setSelectedProductForConsultation] = useState<string>('Cần tư vấn thêm');
  const [selectedUnit, setSelectedUnit] = useState<SelectedUnit | null>(null);
  const location = useLocation();
  const flowRef = useRef<HTMLDivElement>(null);
  useScrollReveal(flowRef);

  // Handle hash scrolling when arriving from other pages (e.g. /#tong-quan, /#bo-suu-tap, etc.)
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash]);

  const handleSelectProduct = (productName: string) => {
    setSelectedUnit(null);
    setSelectedProductForConsultation(productName);
  };

  const handleSelectUnit = (unit: SelectedUnit) => {
    setSelectedUnit(unit);
    setSelectedProductForConsultation(unit.productName);
  };

  return (
    <div ref={flowRef} className="flex-grow">
      <JourneyBar />

      {/* Hero: layered "Làng Vân" title */}
      <Hero />

      {/* 4 thế mạnh: biển, suối, vui chơi, thiên nhiên */}
      <ValueStrip />

      {/* Một ngày ở Làng Vân */}
      <Experiences />

      {/* Quỹ căn: poster từng căn trượt ngang */}
      {featureFlags.showUnitShowcase && <UnitShowcase />}

      {/* Bridge → lead form */}
      <StoryCta
        image="/images/lang-van/glamping-hoang-hon.webp"
        position="70% center"
        eyebrow="Cuối tuần này"
        script="Về với biển"
        title="Đưa cả nhà đến Làng Vân."
        text="Đặt lịch tham quan thực tế: chuyên viên hỗ trợ đưa đón, dẫn đi ngắm biển, cáp treo và từng phân khu, gửi kèm bảng giá mới nhất."
        cta="Đặt lịch tham quan"
      />

      {/* 01. Overview & Project Narrative */}
      <Overview />

      {/* 02. Product Collection */}
      <Collection onSelectProduct={handleSelectProduct} />
      {/* Tạm ẩn theo yêu cầu khách — bật lại bằng featureFlags.showPriceList trong projectData.ts */}
      {featureFlags.showPriceList && (
        <SalesPolicy onSelectUnit={handleSelectUnit} onSelectProduct={handleSelectProduct} />
      )}

      {/* Bridge → lead form */}
      <StoryCta
        image="/images/lang-van/ga-cap-treo.webp"
        eyebrow="Quỹ căn cập nhật mỗi ngày"
        script="Giữ chỗ hôm nay"
        title="Căn đẹp view biển không chờ ai."
        text="Để lại số điện thoại để nhận quỹ căn còn trống, chính sách chiết khấu và phương án vay mới nhất ngay trong ngày."
        cta="Nhận quỹ căn mới nhất"
      />

      {/* 03. Amenities & Lifestyle Showcase */}
      <Amenities />

      {/* 04. Location & Concept Connectivity */}
      <Location />

      {/* 05. Gallery & Interactive Lightbox */}
      <Gallery />

      {/* 06. Frequently Asked Questions */}
      <FAQ />

      {/* 07. Consultation Lead Form */}
      <ConsultationForm
        preSelectedProduct={selectedProductForConsultation}
        selectedUnit={selectedUnit}
        onClearUnit={() => setSelectedUnit(null)}
      />
    </div>
  );
};

export default HomePage;

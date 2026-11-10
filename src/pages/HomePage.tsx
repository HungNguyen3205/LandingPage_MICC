import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { ValueStrip } from '../components/ValueStrip';
import { Overview } from '../components/Overview';
import { Collection } from '../components/Collection';
import { Amenities } from '../components/Amenities';
import { Location } from '../components/Location';
import { Gallery } from '../components/Gallery';
import { FAQ } from '../components/FAQ';
import { ConsultationForm } from '../components/ConsultationForm';

export const HomePage: React.FC = () => {
  const [selectedProductForConsultation, setSelectedProductForConsultation] = useState<string>('Cần tư vấn thêm');
  const location = useLocation();

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
    setSelectedProductForConsultation(productName);
  };

  return (
    <div className="flex-grow">
      {/* Hero Section */}
      <Hero />

      {/* Value Strip */}
      <ValueStrip />

      {/* 01. Overview & Project Narrative */}
      <Overview />

      {/* 02. Product Collection */}
      <Collection onSelectProduct={handleSelectProduct} />

      {/* 03. Amenities & Lifestyle Showcase */}
      <Amenities />

      {/* 04. Location & Concept Connectivity */}
      <Location />

      {/* 05. Gallery & Interactive Lightbox */}
      <Gallery />

      {/* 06. Frequently Asked Questions */}
      <FAQ />

      {/* 07. Consultation Lead Form */}
      <ConsultationForm preSelectedProduct={selectedProductForConsultation} />
    </div>
  );
};

export default HomePage;

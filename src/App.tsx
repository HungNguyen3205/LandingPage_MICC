import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { QuickContact } from './components/QuickContact';
import { PhonePopup } from './components/PhonePopup';
import { HomePage } from './pages/HomePage';
import { SuccessPage } from './pages/SuccessPage';
import { NotFoundPage } from './pages/NotFoundPage';

/**
 * Automatically scrolls to top on route change unless there is a hash anchor
 */
const ScrollToTopOnRoute: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-sand text-ink selection:bg-champagne/30 selection:text-forest-dark flex flex-col font-sans">
        {/* Scroll restoration helper */}
        <ScrollToTopOnRoute />

        {/* Shared Header across all pages */}
        <Header />

        {/* Dynamic Page Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Trang liên hệ & chính sách cũ đã bỏ: link cũ chuyển về form đăng ký trên trang chủ */}
            <Route path="/lien-he" element={<Navigate to="/#lien-he" replace />} />
            <Route path="/chinh-sach-bao-mat" element={<Navigate to="/" replace />} />
            <Route path="/dang-ky-thanh-cong" element={<SuccessPage />} />
            {/* 404 Route for any unmatched paths */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Shared Footer across all pages */}
        <Footer />

        {/* Shared Floating Actions & Quick Contact */}
        <QuickContact />

        {/* Popup xin số điện thoại → Telegram + Google Sheet */}
        <PhonePopup />
      </div>
    </BrowserRouter>
  );
}

export default App;

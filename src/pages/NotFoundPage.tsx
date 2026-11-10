import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowRight, Compass } from 'lucide-react';
import { projectMeta } from '../data/projectData';

export const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = '404 - Không Tìm Thấy Trang | VINHOMES';

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      'Đường dẫn bạn yêu cầu không tồn tại hoặc đã thay đổi tại Vinhomes. Mời bạn trở về Trang chủ hoặc liên hệ để được hỗ trợ.'
    );
  }, []);

  return (
    <div className="pt-28 sm:pt-32 pb-24 bg-sand min-h-[82vh] flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">

        {/* Subtle Brand Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest/5 border border-forest/10 text-forest text-[11px] font-mono tracking-widest uppercase mb-4 sm:mb-6">
          <Compass className="w-3.5 h-3.5 text-champagne" />
          <span>{projectMeta.brandName} • 404 NOT FOUND</span>
        </div>

        {/* Large Serif 404 in Deep Forest Blue-Green */}
        <div className="relative select-none">
          <span className="font-serif text-8xl sm:text-9xl lg:text-[132px] font-light text-forest tracking-tight leading-none">
            404
          </span>
        </div>

        {/* Champagne Architectural Accent Line */}
        <div className="flex items-center justify-center space-x-3 my-5 sm:my-6" aria-hidden="true">
          <div className="h-px w-10 sm:w-16 bg-champagne/40" />
          <div className="w-2 h-2 rotate-45 border border-champagne bg-sand" />
          <div className="h-px w-10 sm:w-16 bg-champagne/40" />
        </div>

        {/* Heading */}
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-normal text-forest leading-[1.25] mb-4">
          Không gian bạn tìm chưa có ở đây.
        </h1>

        {/* Description */}
        <p className="text-ink-muted text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-8 sm:mb-10 font-light">
          Đường dẫn có thể đã thay đổi. Mời bạn trở về Trang chủ hoặc liên hệ để được hỗ trợ.
        </p>

        {/* Actions: Main button "Về Trang chủ" + Secondary button "Liên hệ tư vấn" */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full max-w-xs sm:max-w-none mx-auto">
          {/* Main Button */}
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-sm bg-forest text-white hover:bg-forest-light text-xs font-mono uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow group cursor-pointer"
          >
            <Home className="w-4 h-4 text-champagne group-hover:-translate-y-0.5 transition-transform duration-200" />
            <span>Về Trang chủ</span>
          </Link>

          {/* Secondary Button */}
          <Link
            to="/lien-he"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-sm bg-transparent border border-champagne text-forest hover:bg-champagne/10 text-xs font-mono uppercase tracking-wider transition-all duration-200 group cursor-pointer"
          >
            <span>Liên hệ tư vấn</span>
            <ArrowRight className="w-4 h-4 text-champagne group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFoundPage;

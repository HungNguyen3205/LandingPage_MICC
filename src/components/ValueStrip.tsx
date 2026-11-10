import React from 'react';
import { valueItems } from '../data/projectData';
import { Sparkles, Trees, Waves, Compass } from 'lucide-react';

const iconMap = {
  Sparkles: Sparkles,
  Trees: Trees,
  Waves: Waves,
  Compass: Compass,
};

export const ValueStrip: React.FC = () => {
  return (
    <section className="bg-forest text-white py-10 lg:py-14 border-t border-champagne/20 relative z-20">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-0 lg:divide-x lg:divide-white/10">
          {valueItems.map((item, index) => {
            const IconComponent = iconMap[item.iconName];
            return (
              <div
                key={item.id}
                className={`flex flex-col items-start ${
                  index !== 0 ? 'lg:pl-8' : ''
                } ${index !== valueItems.length - 1 ? 'lg:pr-8' : ''} group`}
              >
                {/* Thin stroke icon with champagne touch */}
                <div className="w-10 h-10 rounded-full bg-forest-light flex items-center justify-center mb-3.5 text-champagne border border-champagne/25 group-hover:border-champagne group-hover:bg-champagne/10 transition-colors duration-200">
                  <IconComponent className="w-5 h-5" strokeWidth={1.4} />
                </div>

                <h3 className="font-serif text-base sm:text-lg font-medium text-white mb-1.5 tracking-tight">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-[13px] text-sand/75 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

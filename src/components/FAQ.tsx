import React, { useState } from 'react';
import { faqData } from '../data/projectData';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQ: React.FC = () => {
  // Allow multiple or single open accordion; starting with first item open
  const [openIds, setOpenIds] = useState<string[]>([faqData[0].id]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-20 lg:py-28 bg-[#F4F1E8] border-t border-forest/10 relative">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <div className="flex items-center space-x-2 text-champagne text-xs sm:text-[13px] font-semibold tracking-[0.25em] uppercase mb-3">
            <HelpCircle className="w-4 h-4" />
            <span>06 / THẮC MẮC THƯỜNG GẶP</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-normal text-forest leading-[1.2] tracking-tight mb-4">
            Giải đáp thông tin dự án.
          </h2>
          <p className="text-ink-muted text-base leading-relaxed">
            Các câu hỏi phổ biến về sản phẩm, định hướng phát triển và phương thức tiếp cận thông tin chính thức từ Vinhomes.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="max-w-3xl space-y-4">
          {faqData.map((item, index) => {
            const isOpen = openIds.includes(item.id);
            const questionId = `faq-question-${item.id}`;
            const answerId = `faq-answer-${item.id}`;

            return (
              <div
                key={item.id}
                className="bg-white rounded-luxury border border-forest/10 shadow-subtle overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  id={questionId}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => toggleItem(item.id)}
                  className="w-full text-left px-6 py-5 sm:py-6 flex items-center justify-between space-x-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-champagne font-mono text-xs font-semibold">
                      0{index + 1}
                    </span>
                    <span className="font-serif text-base sm:text-lg text-forest font-medium leading-snug">
                      {item.question}
                    </span>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-full bg-sand flex items-center justify-center text-forest shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-forest text-white' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={questionId}
                  className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-96 pb-6 pt-1 opacity-100' : 'max-h-0 pb-0 opacity-0'
                  }`}
                >
                  <div className="pl-6 sm:pl-7 border-l-2 border-champagne/40">
                    <p className="text-sm sm:text-[15px] text-ink-muted leading-relaxed font-light">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

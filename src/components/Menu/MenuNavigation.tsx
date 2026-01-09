import { useTranslation } from 'react-i18next';

interface MenuNavigationProps {
  totalCategories: number;
  activeIndex: number;
  onNavigate: (index: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

const MenuNavigation = ({
  totalCategories,
  activeIndex,
  onNavigate,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
}: MenuNavigationProps) => {
  const { i18n } = useTranslation();

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 pointer-events-auto">
      <div className="flex items-center gap-4 bg-black/50 backdrop-blur-md rounded-full px-6 py-4">
        {/* Previous Button */}
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className={`p-2 rounded-full transition-all ${
            hasPrevious
              ? 'bg-white/20 hover:bg-white/30 text-white'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
          }`}
          aria-label={i18n.language === 'ar' ? 'السابق' : 'Previous'}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Category Indicators */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalCategories }).map((_, index) => (
            <button
              key={index}
              onClick={() => onNavigate(index)}
              className={`transition-all ${
                index === activeIndex
                  ? 'w-8 h-2 bg-yellow-400 rounded-full'
                  : 'w-2 h-2 bg-white/30 rounded-full hover:bg-white/50'
              }`}
              aria-label={`${i18n.language === 'ar' ? 'الفئة' : 'Category'} ${index + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={!hasNext}
          className={`p-2 rounded-full transition-all ${
            hasNext
              ? 'bg-white/20 hover:bg-white/30 text-white'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
          }`}
          aria-label={i18n.language === 'ar' ? 'التالي' : 'Next'}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MenuNavigation;


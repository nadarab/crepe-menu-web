import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { firestoreService } from '../../services/firebase/firestoreService';
import type { Category } from '../../types/category';

const MenuSection = () => {
  const { i18n } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const itemsPerPage = 3;

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await firestoreService.getCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load menu');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const goToNextCategory = () => {
    if (activeCategoryIndex < categories.length - 1) {
      setActiveCategoryIndex(activeCategoryIndex + 1);
      setActiveItemIndex(0);
    }
  };

  const goToPreviousCategory = () => {
    if (activeCategoryIndex > 0) {
      setActiveCategoryIndex(activeCategoryIndex - 1);
      setActiveItemIndex(0);
    }
  };

  const goToNextItems = () => {
    const activeCategory = categories[activeCategoryIndex];
    const totalItems = activeCategory?.items?.length || 0;
    const maxIndex = Math.ceil(totalItems / itemsPerPage) - 1;
    
    if (activeItemIndex < maxIndex) {
      setActiveItemIndex(activeItemIndex + 1);
    }
  };

  const goToPreviousItems = () => {
    if (activeItemIndex > 0) {
      setActiveItemIndex(activeItemIndex - 1);
    }
  };

  if (loading) {
    return (
      <section id="menu" className="relative min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-white text-lg">
            {i18n.language === 'ar' ? 'جاري تحميل القائمة...' : 'Loading menu...'}
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="menu" className="relative min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl mb-4">{error}</p>
          <button
            onClick={loadCategories}
            className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors font-semibold"
          >
            {i18n.language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section id="menu" className="relative min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl">
            {i18n.language === 'ar' ? 'لا توجد عناصر في القائمة' : 'No menu items available'}
          </p>
        </div>
      </section>
    );
  }

  const activeCategory = categories[activeCategoryIndex];
  const items = activeCategory?.items || [];
  const startIndex = activeItemIndex * itemsPerPage;
  // Show 4 items (3 full + 1 half visible) if available
  const visibleItems = items.slice(startIndex, startIndex + 4);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  return (
    <section id="menu" className="relative min-h-screen bg-[#1a1a1a] overflow-hidden"
      style={{
        clipPath: 'inset(0)',
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/Backgrounds/BackgroundLap.png"
          alt="Background"
          className="hidden md:block w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <img
          src="/images/Backgrounds/Backgroundphone.png"
          alt="Background"
          className="block md:hidden w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Decorative shapes (fallback) */}
      <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 z-0">
        <div className="absolute top-20 right-10 w-64 h-64 bg-gray-700 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-20 w-96 h-96 bg-gray-800 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col overflow-hidden">
        {/* Main Hero Image - Left Side (Very Large, Left Half Cut Off, Flush with Bottom) */}
        <div className="absolute -left-[20%] md:-left-[25%] lg:-left-[30%] bottom-0 w-[80%] md:w-[75%] lg:w-[70%] h-full z-10 flex items-end">
          <AnimatePresence mode="wait">
            <motion.div
              key={`image-${activeCategory?.id}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              {activeCategory?.mainImage ? (
                <img
                  src={activeCategory.mainImage}
                  alt={activeCategory.title[i18n.language as 'en' | 'ar']}
                  className="w-full h-auto object-contain object-bottom drop-shadow-2xl"
                  style={{
                    maxHeight: '100%',
                  }}
                />
              ) : (
                <div className="w-full h-96 bg-gray-800/50 rounded-lg flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Title Section - Right of Image, Above Menu Items */}
        <div className="absolute top-[20%] md:top-[25%] left-[32%] md:left-[28%] lg:left-[25%] max-w-md lg:max-w-lg z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className={i18n.language === 'ar' ? 'text-right' : 'text-left'}
            >
              {/* Category Title */}
              <h2
                className={`text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white mb-3 ${
                  i18n.language === 'ar' ? 'font-tajawal' : 'font-dancing'
                }`}
                style={{
                  letterSpacing: '0.02em',
                  fontWeight: 400,
                }}
              >
                {activeCategory?.title[i18n.language as 'en' | 'ar']}
              </h2>

              {/* Description */}
              <p
                className={`text-white text-sm md:text-base lg:text-lg mb-4 opacity-80 ${
                  i18n.language === 'ar' ? 'font-tajawal' : 'font-bree'
                }`}
              >
                {activeCategory?.description[i18n.language as 'en' | 'ar']}
              </p>

              {/* Tagline */}
              {activeCategory?.tagline && (
                <h3
                  className={`text-white text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-wider ${
                    i18n.language === 'ar' ? 'font-tajawal' : 'font-bree'
                  }`}
                >
                  {activeCategory.tagline[i18n.language as 'en' | 'ar']}
                </h3>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Menu Items Carousel - Bottom Right (Smaller Cards) */}
        <div className="absolute right-0 bottom-6 md:bottom-8 lg:bottom-10 left-[35%] md:left-auto z-20 pr-0 overflow-hidden w-[30.5rem] md:w-[37rem] lg:w-[43.5rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`items-${activeCategory?.id}-${activeItemIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="flex gap-8 md:gap-12 lg:gap-16 justify-start pb-4 md:pb-0 pr-0"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                paddingRight: '0',
              }}
            >
              {visibleItems.map((item, index) => (
                <div
                  key={item.id}
                  className="min-w-[110px] w-28 md:w-32 lg:w-36 flex flex-col items-center flex-shrink-0 relative"
                >
                  {/* Item Image - On Top of Card */}
                  <div className="w-full h-32 md:h-36 lg:h-40 mb-[-5.5rem] md:mb-[-6.5rem] lg:mb-[-7rem] relative z-10 flex items-end justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name[i18n.language as 'en' | 'ar']}
                        className="w-full h-full object-contain drop-shadow-lg"
                        style={{
                          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))',
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Item Card - Info Section with Directional Shadow */}
                  <div 
                    className="w-full pt-16 md:pt-20 lg:pt-24 pb-4 md:pb-5 px-2 md:px-3 flex flex-col items-center text-center relative rounded-3xl"
                    style={{
                      background: '#ffffff',
                      boxShadow: `
                        10px 10px 30px rgba(255, 255, 255, 0.12),
                        7px 7px 20px rgba(255, 255, 255, 0.08)
                      `,
                      position: 'relative',
                    }}
                  >
                    {/* Light Right Edge Shadow - Gradual Fade */}
                    <div
                      className="absolute top-0 right-0 h-full pointer-events-none"
                      style={{
                        width: '40px',
                        background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.03) 20%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.12) 60%, rgba(255,255,255,0.08) 80%, rgba(255,255,255,0) 100%)',
                        transform: 'translateX(50%)',
                        zIndex: -1,
                        filter: 'blur(12px)',
                        borderRadius: '0 20px 20px 0',
                      }}
                    />
                    
                    {/* Light Bottom Edge Shadow - Gradual Fade */}
                    <div
                      className="absolute bottom-0 left-0 w-full pointer-events-none"
                      style={{
                        height: '40px',
                        background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.03) 20%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.12) 60%, rgba(255,255,255,0.08) 80%, rgba(255,255,255,0) 100%)',
                        transform: 'translateY(50%)',
                        zIndex: -1,
                        filter: 'blur(12px)',
                        borderRadius: '0 0 20px 20px',
                      }}
                    />
                    
                    {/* Spacer for image overlap */}
                    <div className="h-2 md:h-2.5 lg:h-3"></div>
                    
                    {/* Item Name */}
                    <h4
                      className={`text-[10px] md:text-xs font-bold text-gray-900 uppercase mb-0.5 leading-tight line-clamp-2 ${
                        i18n.language === 'ar' ? 'font-tajawal' : 'font-bree'
                      }`}
                    >
                      {item.name[i18n.language as 'en' | 'ar']}
                    </h4>

                    {/* Price */}
                    {item.price !== undefined && (
                      <p className="text-xs md:text-sm font-semibold text-gray-700">
                        {item.price} JD
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination Dots & Navigation */}
          {items.length > itemsPerPage && (
            <div className="flex items-center justify-center gap-4 mt-6 md:mt-8">
              {/* Pagination Dots */}
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveItemIndex(index)}
                    className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full transition-all"
                    style={{
                      backgroundColor: index === activeItemIndex ? '#e5e5e5' : '#4a4a4a',
                    }}
                  />
                ))}
              </div>

              {/* Double Right Arrow Navigation */}
              <button
                onClick={goToNextItems}
                disabled={activeItemIndex >= totalPages - 1}
                className="transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  color: '#e5e5e5',
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                }}
              >
                <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5.5 5l7 7-7 7V5z M13 5l7 7-7 7V5z" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Category Navigation Arrows - Sides */}
        <div className="absolute top-1/2 left-4 md:left-8 transform -translate-y-1/2 z-20">
          <button
            onClick={goToPreviousCategory}
            disabled={activeCategoryIndex === 0}
            className="text-white hover:text-yellow-400 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <div className="absolute top-1/2 right-4 md:right-8 transform -translate-y-1/2 z-20">
          <button
            onClick={goToNextCategory}
            disabled={activeCategoryIndex >= categories.length - 1}
            className="text-white hover:text-yellow-400 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Category Indicator - Bottom Center */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveCategoryIndex(index);
                setActiveItemIndex(0);
              }}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
                index === activeCategoryIndex
                  ? 'bg-yellow-400 scale-125'
                  : 'bg-gray-500 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;

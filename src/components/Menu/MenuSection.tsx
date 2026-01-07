import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { firestoreService } from '../../services/firebase/firestoreService';
import type { Category } from '../../types/category';
import MenuNavigation from './MenuNavigation';

const MenuSection = () => {
  const { i18n } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    // Set up Intersection Observer for scroll detection
    const observers: IntersectionObserver[] = [];

    sectionRefs.current.forEach((section, index) => {
      if (!section) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              setActiveCategoryIndex(index);
            }
          });
        },
        {
          threshold: [0, 0.25, 0.5, 0.75, 1],
          rootMargin: '-20% 0px -20% 0px',
        }
      );

      observer.observe(section);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [categories]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await firestoreService.getCategories();
      setCategories(data);
      // Initialize refs array
      sectionRefs.current = new Array(data.length).fill(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load menu');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToCategory = (index: number) => {
    const section = sectionRefs.current[index];
    if (section && containerRef.current) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToNext = () => {
    if (activeCategoryIndex < categories.length - 1) {
      scrollToCategory(activeCategoryIndex + 1);
    }
  };

  const scrollToPrevious = () => {
    if (activeCategoryIndex > 0) {
      scrollToCategory(activeCategoryIndex - 1);
    }
  };

  if (loading) {
    return (
      <section id="menu" className="relative min-h-screen bg-gray-900 flex items-center justify-center">
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
      <section id="menu" className="relative min-h-screen bg-gray-900 flex items-center justify-center">
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
      <section id="menu" className="relative min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl">
            {i18n.language === 'ar' ? 'لا توجد عناصر في القائمة' : 'No menu items available'}
          </p>
        </div>
      </section>
    );
  }

  const activeCategory = categories[activeCategoryIndex];

  return (
    <section id="menu" className="relative min-h-screen bg-gray-900 overflow-hidden">
      {/* Fixed Content Display Area */}
      <div className="fixed top-0 left-0 right-0 bottom-0 pointer-events-none z-10">
        <div className="container mx-auto h-full flex flex-col justify-center px-6 md:px-12">
          {/* Main Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory?.id}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-2xl mx-auto mb-8"
            >
              {activeCategory?.mainImage ? (
                <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-2xl">
                  <img
                    src={activeCategory.mainImage}
                    alt={activeCategory.title[i18n.language as 'en' | 'ar']}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
              ) : (
                <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-2xl bg-gray-800 flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Title */}
          <AnimatePresence mode="wait">
            <motion.h2
              key={`title-${activeCategory?.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-4 ${
                i18n.language === 'ar' ? 'font-tajawal' : 'font-bree'
              }`}
            >
              {activeCategory?.title[i18n.language as 'en' | 'ar']}
            </motion.h2>
          </AnimatePresence>

          {/* Description */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`desc-${activeCategory?.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className={`text-lg md:text-xl text-gray-300 text-center max-w-2xl mx-auto mb-8 ${
                i18n.language === 'ar' ? 'font-tajawal' : 'font-bree'
              }`}
            >
              {activeCategory?.description[i18n.language as 'en' | 'ar']}
            </motion.p>
          </AnimatePresence>

          {/* Items Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`items-${activeCategory?.id}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto"
            >
              {activeCategory?.items?.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 hover:bg-white/20 transition-colors cursor-pointer"
                >
                  {item.image && (
                    <div className="w-full h-24 md:h-32 rounded-lg overflow-hidden mb-2">
                      <img
                        src={item.image}
                        alt={item.name[i18n.language as 'en' | 'ar']}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className={`text-sm md:text-base font-semibold text-white mb-1 ${
                    i18n.language === 'ar' ? 'font-tajawal' : 'font-bree'
                  }`}>
                    {item.name[i18n.language as 'en' | 'ar']}
                  </h3>
                  {item.price !== undefined && (
                    <p className="text-yellow-400 font-bold text-sm md:text-base">
                      {item.price} JD
                    </p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Scrollable Sections (invisible triggers for scroll detection) */}
      <div ref={containerRef} className="relative z-0" style={{ scrollSnapType: 'y mandatory' }}>
        {categories.map((category, index) => (
          <div
            key={category.id}
            ref={(el) => {
              sectionRefs.current[index] = el;
            }}
            className="min-h-screen"
            style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
          />
        ))}
      </div>

      {/* Navigation */}
      <MenuNavigation
        totalCategories={categories.length}
        activeIndex={activeCategoryIndex}
        onNavigate={scrollToCategory}
        onNext={scrollToNext}
        onPrevious={scrollToPrevious}
        hasNext={activeCategoryIndex < categories.length - 1}
        hasPrevious={activeCategoryIndex > 0}
      />
    </section>
  );
};

export default MenuSection;


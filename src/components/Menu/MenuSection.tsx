import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import type { Category } from '../../types/category';

interface MenuSectionProps {
  categories: Category[];
  categoryItemPages: Record<string, number>;
  onSetItemPage: (categoryId: string, page: number) => void;
}

const MenuSection = ({ categories, categoryItemPages, onSetItemPage }: MenuSectionProps) => {
  const { t, i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const itemsPerPage = 3; // 3 items per page

  // Detect screen size for responsive item count
  const [isXL, setIsXL] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsXL(typeof window !== 'undefined' && window.innerWidth >= 1280);
      setIsSmallScreen(typeof window !== 'undefined' && window.innerWidth < 750);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Detect mobile device for performance optimization
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
  
  // Disable scroll-triggered animations on mobile for better performance
  const disableScrollAnimations = isMobile;

  // Animation variants - Optimized for mobile performance
  // Disable animations if user prefers reduced motion or on mobile
  const categoryVariants = {
    hidden: { opacity: (shouldReduceMotion || disableScrollAnimations) ? 1 : 0, y: (shouldReduceMotion || disableScrollAnimations) ? 0 : 30 },
    visible: { 
      opacity: 1, 
      y: 0
    }
  };

  const containerVariants = {
    hidden: { opacity: (shouldReduceMotion || disableScrollAnimations) ? 1 : 0 },
    visible: {
      opacity: 1
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: (shouldReduceMotion || disableScrollAnimations) ? 1 : 0,
      y: (shouldReduceMotion || disableScrollAnimations) ? 0 : 15
    },
    visible: { 
      opacity: 1,
      y: 0
    }
  };

  return (
    <>
      {categories.map((category) => {
          const items = category?.items || [];
          const currentPage = categoryItemPages[category.id] || 0;
          const totalPages = Math.ceil(items.length / itemsPerPage);
          const startIndex = currentPage * itemsPerPage;
          // Desktop: Show 4 items, XL: Show 6 items
          const desktopItemCount = isXL ? 6 : 4;
          const visibleItemsDesktop = items.slice(startIndex, startIndex + desktopItemCount);

          const goToNextPage = () => {
            if (currentPage < totalPages - 1) {
              onSetItemPage(category.id, currentPage + 1);
            }
          };

          return (
          <div 
            key={category.id} 
            className="relative lg:min-h-screen"
          >
              {/* Desktop: Individual background for each category */}
              <div className="hidden lg:block absolute inset-0 z-0">
                <div className="sticky top-0 h-screen w-full">
                  <img
                    src="/images/Backgrounds/BackgroundLap.png"
                    alt="Background"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/50"></div>
                </div>
              </div>

              {/* Decorative shapes (fallback) - Desktop only */}
              <div className="hidden lg:block absolute right-0 top-0 w-1/3 h-screen opacity-10 z-0 pointer-events-none">
                <div className="absolute top-20 right-10 w-64 h-64 bg-gray-700 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 right-20 w-96 h-96 bg-gray-800 rounded-full blur-3xl"></div>
              </div>

              {/* Content wrapper with z-index and animation */}
              <motion.div 
                className="relative z-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={categoryVariants}
                transition={{ 
                  duration: shouldReduceMotion ? 0 : 0.5, 
                  ease: [0.22, 0.61, 0.36, 1] 
                }}
              >{/* Mobile & Tablet Layout */}
              <div className="lg:hidden flex flex-col px-2 xs:px-3 sm:px-4 py-3 sm:py-4">
                {/* Image and Text Container - Side by Side */}
                <div className="flex gap-2 xs:gap-3 sm:gap-4 mb-3 sm:mb-4 min-h-[240px] sm:min-h-[300px] md:min-h-[340px]">
                  {/* Main Image - Left */}
                  <div className="w-1/2 flex items-center justify-center">
                    {category?.mainImage && category.mainImage.trim() !== '' ? (
                      <img
                        src={category.mainImage}
                        alt={category.title[i18n.language as 'en' | 'ar']}
                        className="w-full h-auto object-contain drop-shadow-2xl"
                        style={{
                          maxHeight: 'clamp(180px, 40vw, 300px)',
                        }}
                      />
                    ) : (
                      <div className="w-full h-32 xs:h-40 sm:h-48 bg-gray-800/30 rounded-lg flex items-center justify-center">
                        <svg className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Text Section - Right */}
                  <div className="w-1/2 flex flex-col justify-center min-w-0">
                    <div className={i18n.language === 'ar' ? 'text-right' : 'text-left'}>
                      {/* Category Title */}
                      <h2
                        className={`text-white mb-0.5 xs:mb-1 break-words ${
                          i18n.language === 'ar' ? 'font-tajawal text-xl xs:text-2xl sm:text-3xl md:text-4xl' : 'font-dancing text-2xl xs:text-3xl sm:text-3xl md:text-4xl'
                        }`}
                        style={{
                          letterSpacing: '0.02em',
                          fontWeight: 400,
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                        }}
                      >
                        {category?.title[i18n.language as 'en' | 'ar']}
                      </h2>

                      {/* Description */}
                      <p
                        className={`text-white mb-1 xs:mb-1.5 ${
                          i18n.language === 'ar' ? 'font-tajawal text-xs xs:text-sm sm:text-base md:text-base' : 'font-cairo text-xs xs:text-sm sm:text-base md:text-base'
                        }`}
                        style={{
                          fontWeight: 300,
                        }}
                      >
                        {category?.description[i18n.language as 'en' | 'ar']}
                      </p>

                      {/* Extras */}
                      {category?.extras && category.extras[i18n.language as 'en' | 'ar'] && (
                        <div
                          className={`text-white mb-1 xs:mb-1.5 ${
                            i18n.language === 'ar' ? 'font-tajawal text-xs xs:text-sm sm:text-base md:text-lg' : 'font-cairo text-xs xs:text-sm sm:text-base md:text-lg'
                          }`}
                          style={{
                            fontWeight: 700,
                          }}
                        >
                          {category.extras[i18n.language as 'en' | 'ar'].split('\n').map((line, index) => (
                            <p key={index} className="mb-1">
                              {line}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Tagline */}
                      {category?.tagline && (
                        <h3
                          className={`text-white font-bold uppercase tracking-wider line-clamp-1 ${
                            i18n.language === 'ar' ? 'font-tajawal text-[10px] xs:text-xs sm:text-sm md:text-base' : 'font-bree text-[10px] xs:text-xs sm:text-sm md:text-base'
                          }`}
                        >
                          {category.tagline[i18n.language as 'en' | 'ar']}
                        </h3>
                      )}
                    </div>
                  </div>
                </div>

              {/* Menu Items - Horizontal Scrollable */}
              <div 
                className="w-full overflow-x-auto overflow-y-visible" 
                dir="ltr"
                style={{
                  scrollBehavior: 'smooth',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                <motion.div 
                  key={`mobile-${category.id}`}
                  className="flex gap-3 xs:gap-4 sm:gap-4 md:gap-5"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={containerVariants}
                    transition={{ 
                      staggerChildren: shouldReduceMotion ? 0 : 0.08, 
                      delayChildren: shouldReduceMotion ? 0 : 0.05 
                    }}
                    style={{
                      width: 'max-content',
                    }}
                  >
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        className={`flex flex-col items-center h-full flex-shrink-0 ${
                          isSmallScreen ? 'w-[110px]' : 'w-[85px] xs:w-[90px] sm:w-[100px] md:w-[110px]'
                        }`}
                        variants={itemVariants}
                        transition={{ 
                          duration: shouldReduceMotion ? 0 : 0.35, 
                          ease: [0.22, 0.61, 0.36, 1] 
                        }}
                      >
                        {/* Item Image - On Top of Card */}
                        <div className={`w-full relative z-10 flex items-end justify-center ${
                          isSmallScreen 
                            ? 'h-28 mb-[-3.5rem]' 
                            : 'h-[70px] xs:h-24 sm:h-28 md:h-36 mb-[-2.5rem] xs:mb-[-3rem] sm:mb-[-3.5rem] md:mb-[-4.5rem]'
                        }`}>
                          {item.image && item.image.trim() !== '' ? (
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
                              <svg className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-gray-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Item Card - Info Section */}
                        <div 
                          className={`w-full flex flex-col items-center justify-center text-center relative rounded-xl xs:rounded-2xl sm:rounded-2xl md:rounded-3xl ${
                            isSmallScreen
                              ? 'px-2 pt-[3.5rem] pb-3'
                              : 'px-1 xs:px-1.5 sm:px-1.5 md:px-2 pt-[3rem] xs:pt-[3.5rem] sm:pt-[3.5rem] md:pt-[4.5rem] pb-2 xs:pb-[0.75rem]'
                          }`}
                          style={{
                            background: '#ffffff',
                            boxShadow: `
                              10px 10px 30px rgba(255, 255, 255, 0.12),
                              7px 7px 20px rgba(255, 255, 255, 0.08)
                            `,
                            minHeight: '65px',
                          }}
                        >
                          {/* Item Name */}
                          <h4
                            className={`font-bold text-black uppercase leading-tight line-clamp-3 ${
                              i18n.language === 'ar' 
                                ? `font-tajawal ${isSmallScreen ? 'text-xs' : 'text-[9px] xs:text-[10px] sm:text-xs md:text-sm'}` 
                                : `font-cairo ${isSmallScreen ? 'text-[10px]' : 'text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs'}`
                            }`}
                            style={{
                              minHeight: '3em',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              marginBottom: '0.25rem',
                              fontWeight: 700
                            }}
                          >
                            {item.name[i18n.language as 'en' | 'ar']}
                          </h4>

                          {/* Prices - Size-specific */}
                          {(item.priceM !== undefined || item.priceL !== undefined || item.priceLiter !== undefined) ? (
                            <div className={`flex flex-col items-center justify-center gap-0.5 ${
                              i18n.language === 'ar' 
                                ? isSmallScreen ? 'text-[10px]' : 'text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs'
                                : isSmallScreen ? 'text-[9px]' : 'text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px]'
                            }`}>
                              {item.priceM !== undefined && (
                                <span className={`font-semibold text-black whitespace-nowrap ${
                                  i18n.language === 'ar' ? 'font-tajawal' : 'font-cairo'
                                }`}>
                                  M: {item.priceM} JD
                                </span>
                              )}
                              {item.priceL !== undefined && (
                                <span className={`font-semibold text-black whitespace-nowrap ${
                                  i18n.language === 'ar' ? 'font-tajawal' : 'font-cairo'
                                }`}>
                                  L: {item.priceL} JD
                                </span>
                              )}
                              {item.priceLiter !== undefined && (
                                <span className={`font-semibold text-black whitespace-nowrap ${
                                  i18n.language === 'ar' ? 'font-tajawal' : 'font-cairo'
                                }`}>
                                  Ltr: {item.priceLiter} JD
                                </span>
                              )}
                            </div>
                          ) : item.price !== undefined ? (
                            <p className={`font-semibold text-black ${
                              i18n.language === 'ar' 
                                ? `font-tajawal ${isSmallScreen ? 'text-xs' : 'text-[9px] xs:text-[10px] sm:text-xs md:text-sm'}` 
                                : `font-cairo ${isSmallScreen ? 'text-[10px]' : 'text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs'}`
                            }`}>
                              {item.price} JD
                            </p>
                          ) : null}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
              </div>

              {/* Order Now Button - Mobile */}
              <div className="flex justify-center mt-4 sm:mt-6">
                <a
                  href="https://www.talabat.com/ar/jordan/eng-crepe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-6 sm:px-8 py-2 sm:py-3 text-black font-bold uppercase rounded-lg transition-colors inline-block text-center ${
                    i18n.language === 'ar' ? 'font-tajawal' : 'font-cairo'
                  }`}
                  style={{
                    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                    backgroundColor: '#fbbf24',
                    border: 'none',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f59e0b'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fbbf24'}
                >
                  {t('orderNow')}
                </a>
              </div>
            </div>

              {/* Desktop Layout */}
              <div className="hidden lg:block min-h-screen relative py-12">
                {/* Main Hero Image - Left Side */}
                <div className="absolute -left-[30%] bottom-0 w-[70%] h-full z-10 flex items-end">
                  {category?.mainImage ? (
                    <img
                      src={category.mainImage}
                      alt={category.title[i18n.language as 'en' | 'ar']}
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
        </div>

        {/* Title Section */}
                <div className="absolute top-[12%] md:top-[15%] lg:top-[10%] left-[38%] max-w-xl lg:max-w-2xl z-20">
                  <div className={i18n.language === 'ar' ? 'text-right' : 'text-left'}>
              {/* Category Title */}
              <h2
                      className={`text-7xl text-white mb-1 md:mb-2 lg:mb-4 whitespace-nowrap -ml-8 ${
                  i18n.language === 'ar' ? 'font-tajawal' : 'font-dancing'
                }`}
                style={{
                  letterSpacing: '0.02em',
                  fontWeight: 400,
                }}
              >
                      {category?.title[i18n.language as 'en' | 'ar']}
              </h2>

              {/* Description */}
              <p
                      className={`text-white text-lg mb-2 line-clamp-4 ${
                        i18n.language === 'ar' ? 'font-tajawal' : 'font-cairo'
                }`}
                      style={{
                        fontWeight: 300,
                      }}
              >
                      {category?.description[i18n.language as 'en' | 'ar']}
              </p>

              {/* Extras with Order Now Button (if extras exists) */}
                    {category?.extras && category.extras[i18n.language as 'en' | 'ar'] ? (
                <div className="flex items-start gap-4 mb-2">
                  <div
                        className={`text-white text-base flex-1 ${
                    i18n.language === 'ar' ? 'font-tajawal' : 'font-cairo'
                  }`}
                        style={{
                          fontWeight: 700,
                        }}
                >
                  {category.extras[i18n.language as 'en' | 'ar'].split('\n').map((line, index) => (
                    <p key={index} className="mb-1">
                      {line}
                    </p>
                  ))}
                </div>
                {/* Order Now Button - Desktop */}
                <div className="flex-shrink-0">
                  <a
                    href="https://www.talabat.com/ar/jordan/eng-crepe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-8 py-3 text-black font-bold uppercase rounded-lg transition-colors text-lg inline-block text-center ${
                      i18n.language === 'ar' ? 'font-tajawal' : 'font-cairo'
                    }`}
                    style={{
                      backgroundColor: '#fbbf24',
                      border: 'none',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f59e0b'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fbbf24'}
                  >
                    {t('orderNow')}
                  </a>
                </div>
              </div>
              ) : (
                /* Order Now Button - Desktop (if no extras) */
                <div className="mb-2">
                  <a
                    href="https://www.talabat.com/ar/jordan/eng-crepe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-8 py-3 text-black font-bold uppercase rounded-lg transition-colors text-lg inline-block ${
                      i18n.language === 'ar' ? 'font-tajawal' : 'font-cairo'
                    }`}
                    style={{
                      backgroundColor: '#fbbf24',
                      border: 'none',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f59e0b'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fbbf24'}
                  >
                    {t('orderNow')}
                  </a>
                </div>
              )}

              {/* Tagline */}
                    {category?.tagline && (
                <h3
                        className={`text-white text-3xl font-bold uppercase tracking-wider line-clamp-1 ${
                    i18n.language === 'ar' ? 'font-tajawal' : 'font-bree'
                  }`}
                >
                        {category.tagline[i18n.language as 'en' | 'ar']}
                </h3>
              )}
                  </div>
        </div>

              {/* Menu Items - Right Side */}
              <div className="absolute right-0 bottom-3 w-[43.5rem] overflow-hidden z-20" dir="ltr">
                <div className="pb-4">
                    <motion.div 
                      key={`desktop-${category.id}-page-${currentPage}`}
                      className="flex gap-16 lg:gap-12 pr-0 justify-start"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      variants={containerVariants}
                      transition={{ 
                        staggerChildren: shouldReduceMotion ? 0 : 0.1, 
                        delayChildren: shouldReduceMotion ? 0 : 0.05 
                      }}
                    >
                      {visibleItemsDesktop.map((item) => (
                        <motion.div
                    key={item.id}
                          className="min-w-[110px] w-36 flex flex-col items-center flex-shrink-0"
                          variants={itemVariants}
                          transition={{ 
                            duration: shouldReduceMotion ? 0 : 0.4, 
                            ease: [0.22, 0.61, 0.36, 1] 
                          }}
                  >
                    {/* Item Image - On Top of Card */}
                          <div className="w-full h-40 mb-[-6rem] relative z-10 flex items-end justify-center px-4">
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

                          {/* Item Card - Info Section */}
                    <div 
                            className="w-full pt-24 pb-5 px-3 flex flex-col items-center text-center relative rounded-3xl"
                      style={{
                        background: '#ffffff',
                        boxShadow: `
                          10px 10px 30px rgba(255, 255, 255, 0.12),
                          7px 7px 20px rgba(255, 255, 255, 0.08)
                        `,
                            }}
                    >
                      {/* Item Name */}
                      <h4
                              className={`text-sm font-bold text-black uppercase mb-0.5 leading-tight line-clamp-2 ${
                          i18n.language === 'ar' ? 'font-tajawal' : 'font-cairo'
                        }`}
                        style={{
                          fontWeight: 900
                        }}
                      >
                        {item.name[i18n.language as 'en' | 'ar']}
                      </h4>

                      {/* Prices - Size-specific */}
                      {(item.priceM !== undefined || item.priceL !== undefined || item.priceLiter !== undefined) ? (
                        <div className="flex flex-col items-center justify-center gap-0.5 text-[10px]">
                          {item.priceM !== undefined && (
                            <span className={`font-bold text-black whitespace-nowrap ${
                              i18n.language === 'ar' ? 'font-tajawal' : 'font-cairo'
                            }`}>
                              M: {item.priceM} JD
                            </span>
                          )}
                          {item.priceL !== undefined && (
                            <span className={`font-bold text-black whitespace-nowrap ${
                              i18n.language === 'ar' ? 'font-tajawal' : 'font-cairo'
                            }`}>
                              L: {item.priceL} JD
                            </span>
                          )}
                          {item.priceLiter !== undefined && (
                            <span className={`font-bold text-black whitespace-nowrap ${
                              i18n.language === 'ar' ? 'font-tajawal' : 'font-cairo'
                            }`}>
                              Ltr: {item.priceLiter} JD
                            </span>
                          )}
                        </div>
                      ) : item.price !== undefined ? (
                        <p className={`text-sm font-bold text-black ${
                          i18n.language === 'ar' ? 'font-tajawal' : 'font-cairo'
                        }`}>
                          {item.price} JD
                        </p>
                      ) : null}
                    </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>

                  {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-1">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                          onClick={() => onSetItemPage(category.id, index)}
                  className={`transition-all p-0 ${
                            index === currentPage ? 'border-2 border-white' : 'border-0'
                  }`}
                  style={{
                            backgroundColor: index === currentPage ? '#e5e5e5' : '#4a4a4a',
                    width: '32px',
                    height: '12px',
                    borderRadius: '999px',
                  }}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}

              <button
                onClick={goToNextPage}
                        disabled={currentPage >= totalPages - 1}
                className="transition-opacity disabled:opacity-30 disabled:cursor-not-allowed ml-2"
                style={{
                  color: '#e5e5e5',
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                }}
                aria-label="Next page"
              >
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5.5 5l7 7-7 7V5z M13 5l7 7-7 7V5z" />
                </svg>
              </button>
            </div>
          )}
        </div>
          </div>
              </motion.div>
              </div>
          );
        })}
    </>
  );
};

export default MenuSection;
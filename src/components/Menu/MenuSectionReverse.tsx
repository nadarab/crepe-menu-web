import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { firestoreService } from '../../services/firebase/firestoreService';
import type { Category } from '../../types/category';

interface MenuSectionReverseProps {
  categories: Category[];
  categoryItemPages: Record<string, number>;
  onSetItemPage: (categoryId: string, page: number) => void;
}

const MenuSectionReverse = ({ categories, categoryItemPages, onSetItemPage }: MenuSectionReverseProps) => {
  const { i18n } = useTranslation();
  const itemsPerPage = 3; // 3 items per page

  // Animation variants
  const categoryVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0
    }
  };

  return (
    <>
      {categories.map((category) => {
        const items = category?.items || [];
        const currentPage = categoryItemPages[category.id] || 0;
        const totalPages = Math.ceil(items.length / itemsPerPage);
        // Reverse: start from the end and go backwards
        const startIndex = (totalPages - 1 - currentPage) * itemsPerPage;
        // Mobile: Show 4 items, Desktop: Show 4 items (3 full + 1 half visible)
        const visibleItemsMobile = items.slice(startIndex, startIndex + 4).reverse();
        const visibleItemsDesktop = items.slice(startIndex, startIndex + 4).reverse();

        const goToPrevPage = () => {
          if (currentPage < totalPages - 1) {
            onSetItemPage(category.id, currentPage + 1);
          }
        };

        return (
           <motion.div 
             key={category.id} 
             className="mb-0 lg:mb-12"
             initial="hidden"
             animate="visible"
             variants={categoryVariants}
             transition={{ duration: 0.6, ease: "easeOut" }}
           >
            {/* Mobile & Tablet Layout - Reversed */}
            <div className="lg:hidden flex flex-col px-2 xs:px-3 sm:px-4 py-6 sm:py-8">
              {/* Image and Text Container - Side by Side (Reversed) */}
              <div className="flex gap-2 xs:gap-3 sm:gap-4 mb-6 sm:mb-8">
                {/* Text Section - Left */}
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
                      className={`text-white opacity-80 line-clamp-3 mb-0.5 xs:mb-1 ${
                        i18n.language === 'ar' ? 'font-tajawal text-[10px] xs:text-xs sm:text-xs md:text-sm' : 'font-cairo text-[10px] xs:text-xs sm:text-xs md:text-sm'
                      }`}
                      style={{
                        fontWeight: 300,
                      }}
                    >
                      {category?.description[i18n.language as 'en' | 'ar']}
                    </p>

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

                {/* Main Image - Right */}
                <div className="w-1/2 flex items-center justify-center">
                  {category?.mainImage ? (
                    <img
                      src={category.mainImage}
                      alt={category.title[i18n.language as 'en' | 'ar']}
                      className="w-full h-auto object-contain drop-shadow-2xl"
                      style={{
                        maxHeight: 'clamp(180px, 40vw, 300px)',
                      }}
                    />
                  ) : (
                    <div className="w-full h-32 xs:h-40 sm:h-48 bg-gray-800/50 rounded-lg flex items-center justify-center">
                      <svg className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Menu Items - Full Width Cards */}
                <div className="w-full overflow-hidden" dir="ltr">
                  <motion.div 
                    key={`mobile-${category.id}-page-${currentPage}`}
                    className="grid gap-1.5 xs:gap-2 sm:gap-2 md:gap-3"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    transition={{ staggerChildren: 0.15, delayChildren: 0.1 }}
                  style={{
                    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                    gridAutoRows: '1fr'
                  }}
                >
                  {visibleItemsMobile.map((item) => (
                    <motion.div
                      key={item.id}
                      className="flex flex-col items-center h-full min-w-0 max-w-[85px] xs:max-w-none mx-auto"
                      variants={itemVariants}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      {/* Item Image - On Top of Card */}
                      <div className="w-full h-[70px] xs:h-24 sm:h-28 md:h-36 mb-[-2.5rem] xs:mb-[-3rem] sm:mb-[-3.5rem] md:mb-[-4.5rem] relative z-10 flex items-end justify-center">
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
                            <svg className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Item Card - Info Section */}
                      <div 
                        className="w-full flex flex-col items-center justify-center text-center relative rounded-xl xs:rounded-2xl sm:rounded-2xl md:rounded-3xl px-1 xs:px-1.5 sm:px-1.5 md:px-2 pt-[3rem] xs:pt-[3.5rem] sm:pt-[3.5rem] md:pt-[4.5rem] pb-2 xs:pb-[0.75rem]"
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
                          className={`font-bold text-gray-900 uppercase leading-tight line-clamp-2 ${
                            i18n.language === 'ar' ? 'font-tajawal text-[9px] xs:text-[10px] sm:text-xs md:text-sm' : 'font-bree text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs'
                          }`}
                          style={{
                            minHeight: '2em',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            marginBottom: '0.25rem'
                          }}
                        >
                          {item.name[i18n.language as 'en' | 'ar']}
                        </h4>

                        {/* Price */}
                        {item.price !== undefined && (
                          <p className={`font-semibold text-gray-700 ${
                            i18n.language === 'ar' ? 'text-[9px] xs:text-[10px] sm:text-xs md:text-sm' : 'text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs'
                          }`}>
                            {item.price} JD
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 xs:gap-2 mt-3 xs:mt-4">
                    <button
                      onClick={goToPrevPage}
                      disabled={currentPage >= totalPages - 1}
                      className="transition-opacity disabled:opacity-30 disabled:cursor-not-allowed mr-0.5 xs:mr-1"
                      style={{
                        color: '#e5e5e5',
                        background: 'transparent',
                        border: 'none',
                        padding: 0,
                      }}
                      aria-label="Previous page"
                    >
                      <svg className="w-5 h-5 xs:w-6 xs:h-6 sm:w-6 sm:h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24" transform="scale(-1, 1)">
                        <path d="M5.5 5l7 7-7 7V5z M13 5l7 7-7 7V5z" />
                      </svg>
                    </button>

                    {Array.from({ length: totalPages }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => onSetItemPage(category.id, index)}
                        className={`transition-all p-0 ${
                          index === currentPage ? 'border-2 border-white' : 'border-0'
                        }`}
                        style={{
                          backgroundColor: index === currentPage ? '#e5e5e5' : '#4a4a4a',
                          width: 'clamp(18px, 5vw, 24px)',
                          height: 'clamp(8px, 2vw, 10px)',
                          borderRadius: '999px',
                        }}
                        aria-label={`Go to page ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Layout - Reversed */}
            <div className="hidden lg:block min-h-screen relative">
              {/* Main Hero Image - Right Side */}
              <div className="absolute -right-[30%] bottom-0 w-[70%] h-full z-10 flex items-end">
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
              <div className="absolute top-[12%] md:top-[15%] right-[32%] max-w-xl lg:max-w-2xl xl:max-w-3xl z-20">
                <div className={i18n.language === 'ar' ? 'text-left' : 'text-right'}>
                  {/* Category Title */}
                  <h2
                    className={`text-7xl xl:text-8xl text-white mb-1 md:mb-2 whitespace-nowrap -mr-8 ${
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
                    className={`text-white text-lg mb-2 opacity-80 line-clamp-4 ${
                      i18n.language === 'ar' ? 'font-tajawal' : 'font-cairo'
                    }`}
                    style={{
                      fontWeight: 300,
                    }}
                  >
                    {category?.description[i18n.language as 'en' | 'ar']}
                  </p>

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

              {/* Menu Items - Left Side */}
              <div className="absolute left-0 bottom-6 w-[43.5rem] overflow-hidden z-20" dir="ltr">
                <div className="pb-4">
                  <motion.div 
                    key={`desktop-${category.id}-page-${currentPage}`}
                    className="flex flex-row-reverse gap-16 pr-0 justify-start"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    transition={{ staggerChildren: 0.15, delayChildren: 0.1 }}
                  >
                    {visibleItemsDesktop.map((item) => (
                      <motion.div
                        key={item.id}
                        className="min-w-[110px] w-36 flex flex-col items-center flex-shrink-0"
                        variants={itemVariants}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        {/* Item Image - On Top of Card */}
                        <div className="w-full h-40 mb-[-7rem] relative z-10 flex items-end justify-center">
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
                            className={`text-xs font-bold text-gray-900 uppercase mb-0.5 leading-tight line-clamp-2 ${
                              i18n.language === 'ar' ? 'font-tajawal' : 'font-bree'
                            }`}
                          >
                            {item.name[i18n.language as 'en' | 'ar']}
                          </h4>

                          {/* Price */}
                          {item.price !== undefined && (
                            <p className="text-sm font-semibold text-gray-700">
                              {item.price} JD
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-1">
                    <button
                      onClick={goToPrevPage}
                      disabled={currentPage >= totalPages - 1}
                      className="transition-opacity disabled:opacity-30 disabled:cursor-not-allowed mr-2"
                      style={{
                        color: '#e5e5e5',
                        background: 'transparent',
                        border: 'none',
                        padding: 0,
                      }}
                      aria-label="Previous page"
                    >
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24" transform="scale(-1, 1)">
                        <path d="M5.5 5l7 7-7 7V5z M13 5l7 7-7 7V5z" />
                      </svg>
                    </button>

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
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </>
  );
};

export default MenuSectionReverse;

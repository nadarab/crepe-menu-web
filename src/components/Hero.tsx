import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Hero = () => {
  const { t, i18n } = useTranslation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <section
      id="hero"
      className="relative h-screen w-full"
      style={{
        overflow: 'hidden',
        touchAction: 'pan-y pinch-zoom'
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/Section1/hero-background.png"
          alt="Espresso brewing"
          className="hidden md:block w-full h-full object-cover"
        />
        <img
          src="/images/Section1/hero-background-mobile.png"
          alt="Espresso brewing"
          className="block md:hidden w-full h-full object-cover"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-20 flex items-center justify-end px-3 xs:px-4 sm:px-6 md:px-12 pt-6 xs:pt-7 sm:pt-8 md:pt-10 pb-3 xs:pb-3.5 sm:pb-4 md:pb-6 bg-transparent backdrop-blur-0">
        {/* Navigation Links - Right side */}
        <div className="flex items-center gap-4 xs:gap-5 sm:gap-6 md:gap-8 lg:gap-10 text-sm xs:text-base">
          <button
            type="button"
            onClick={() => scrollToSection('hero')}
            className="text-white hover:text-yellow-400 transition-colors cursor-pointer"
            style={{ 
              backgroundColor: 'transparent', 
              border: 'none', 
              padding: 0, 
              cursor: 'pointer',
              borderRadius: 0,
              boxShadow: 'none'
            }}
            aria-label="Home"
          >
            <svg
              className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('menu')}
            className={`text-white tracking-wide hover:text-yellow-400 transition-colors cursor-pointer ${
              i18n.language === 'ar' ? 'font-tajawal text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl' : 'font-bree text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl'
            }`}
            style={{ 
              backgroundColor: 'transparent', 
              border: 'none', 
              padding: 0, 
              cursor: 'pointer',
              borderRadius: 0,
              boxShadow: 'none'
            }}
          >
            {t('menu', { ns: 'navigation' })}
          </button>
          <button
            type="button"
            onClick={() => window.location.href = '/rate'}
            className={`text-white tracking-wide hover:text-yellow-400 transition-colors cursor-pointer ${
              i18n.language === 'ar' ? 'font-tajawal text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl' : 'font-bree text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl'
            }`}
            style={{ 
              backgroundColor: 'transparent', 
              border: 'none', 
              padding: 0, 
              cursor: 'pointer',
              borderRadius: 0,
              boxShadow: 'none'
            }}
          >
            {t('rate', { ns: 'navigation' })}
          </button>
          <button
            type="button"
            onClick={() => window.location.href = '/contact'}
            className={`text-white tracking-wide hover:text-yellow-400 transition-colors cursor-pointer ${
              i18n.language === 'ar' ? 'font-tajawal text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl' : 'font-bree text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl'
            }`}
            style={{ 
              backgroundColor: 'transparent', 
              border: 'none', 
              padding: 0, 
              cursor: 'pointer',
              borderRadius: 0,
              boxShadow: 'none'
            }}
          >
            {t('contact', { ns: 'navigation' })}
          </button>
          
          {/* Language Switcher */}
          <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 ml-2 xs:ml-3 sm:ml-4 border-l border-white/30 pl-2 xs:pl-3 sm:pl-4">
            <button
              type="button"
              onClick={() => changeLanguage('en')}
              className={`font-bree tracking-wide transition-colors cursor-pointer ${
                i18n.language === 'en'
                  ? 'text-yellow-400 font-semibold'
                  : 'text-white hover:text-yellow-400'
              } text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl`}
              style={{ 
                backgroundColor: 'transparent', 
                border: 'none', 
                padding: 0, 
                cursor: 'pointer',
                borderRadius: 0,
                boxShadow: 'none'
              }}
            >
              EN
            </button>
            <span className="text-white/50 text-sm xs:text-base sm:text-lg md:text-xl">|</span>
            <button
              type="button"
              onClick={() => changeLanguage('ar')}
              className={`font-bree transition-colors cursor-pointer ${
                i18n.language === 'ar'
                  ? 'text-yellow-400 font-semibold'
                  : 'text-white hover:text-yellow-400'
              } text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl`}
              style={{ 
                backgroundColor: 'transparent', 
                border: 'none', 
                padding: 0, 
                cursor: 'pointer',
                borderRadius: 0,
                boxShadow: 'none'
              }}
            >
              AR
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-3 xs:px-4 sm:px-6 text-center -mt-12 xs:mt-14 sm:-mt-16 md:-mt-20">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-1 xs:mb-1.5 sm:mb-2 md:mb-3"
        >
          <img
            src="/images/Section1/logo.png"
            alt="Logo"
            className="w-40 xs:w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 2xl:w-96 h-auto object-contain"
            style={{
              maxHeight: 'clamp(250px, 50vh, 500px)'
            }}
          />
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          {i18n.language === 'ar' ? (
            <div className="text-white font-tajawal font-normal">
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide">
                كريب
              </h1>
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide">
                المهندس
              </h1>
            </div>
          ) : (
            <div className="text-white font-bree font-normal">
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide">
                ENG
              </h1>
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide">
                CREPE
              </h1>
            </div>
          )}
        </motion.div>
      </div>

      {/* Tagline - Bottom Left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute bottom-4 xs:bottom-6 sm:bottom-8 md:bottom-12 left-3 xs:left-4 sm:left-6 md:left-12 z-10 text-left"
      >
        {i18n.language === 'ar' ? (
          <div className="text-white font-tajawal font-normal leading-relaxed text-left">
            <p className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
              نكهات لذيذة،
            </p>
            <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl mt-1 xs:mt-1.5 sm:mt-2 md:mt-3">
              جودة مميزة
            </p>
          </div>
        ) : (
          <div className="text-white font-bree font-normal leading-relaxed uppercase text-left">
            <p className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl tracking-wide">
              RICH FLAVORS,
            </p>
            <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl mt-1 xs:mt-1.5 sm:mt-2 md:mt-3 tracking-wide">
              PREMIUM QUALITY
            </p>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default Hero;




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
      className="relative h-screen w-full overflow-hidden"
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
      <nav className="relative z-10 flex items-center justify-end px-6 md:px-12 pt-8 md:pt-10 pb-4 md:pb-6 bg-transparent backdrop-blur-0">
        {/* Navigation Links - Right side */}
        <div className="flex items-center gap-8 md:gap-10">
          <button
            onClick={() => scrollToSection('hero')}
            className="text-white hover:text-yellow-400 transition-colors !bg-transparent !border-none !p-0 !rounded-none"
            style={{ backgroundColor: 'transparent', border: 'none', padding: 0 }}
            aria-label="Home"
          >
            <svg
              className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9"
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
            onClick={() => scrollToSection('menu')}
            className="text-white font-bree text-base md:text-lg lg:text-xl tracking-wide hover:text-yellow-400 transition-colors !bg-transparent !border-none !p-0 !rounded-none"
            style={{ backgroundColor: 'transparent', border: 'none', padding: 0 }}
          >
            {t('menu', { ns: 'navigation' })}
          </button>
          <button
            onClick={() => window.location.href = '/rate'}
            className="text-white font-bree text-base md:text-lg lg:text-xl tracking-wide hover:text-yellow-400 transition-colors !bg-transparent !border-none !p-0 !rounded-none"
            style={{ backgroundColor: 'transparent', border: 'none', padding: 0 }}
          >
            {t('rate', { ns: 'navigation' })}
          </button>
          <button
            onClick={() => window.location.href = '/contact'}
            className="text-white font-bree text-base md:text-lg lg:text-xl tracking-wide hover:text-yellow-400 transition-colors !bg-transparent !border-none !p-0 !rounded-none"
            style={{ backgroundColor: 'transparent', border: 'none', padding: 0 }}
          >
            {t('contact', { ns: 'navigation' })}
          </button>
          
          {/* Language Switcher */}
          <div className="flex items-center gap-2 ml-4 border-l border-white/30 pl-4">
            <button
              onClick={() => changeLanguage('en')}
              className={`font-bree text-base md:text-lg lg:text-xl tracking-wide transition-colors !bg-transparent !border-none !p-0 !rounded-none ${
                i18n.language === 'en'
                  ? 'text-yellow-400 font-semibold'
                  : 'text-white hover:text-yellow-400'
              }`}
              style={{ backgroundColor: 'transparent', border: 'none', padding: 0 }}
            >
              EN
            </button>
            <span className="text-white/50 text-lg md:text-xl">|</span>
            <button
              onClick={() => changeLanguage('ar')}
              className={`font-cairo text-base md:text-lg lg:text-xl transition-colors !bg-transparent !border-none !p-0 !rounded-none ${
                i18n.language === 'ar'
                  ? 'text-yellow-400 font-semibold'
                  : 'text-white hover:text-yellow-400'
              }`}
              style={{ backgroundColor: 'transparent', border: 'none', padding: 0 }}
            >
              AR
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-2 md:mb-3"
        >
          <img
            src="/images/Section1/logo.png"
            alt="Logo"
            className="w-56 h-auto md:w-64 lg:w-72 xl:w-80 2xl:w-96 max-h-[400px] md:max-h-[450px] lg:max-h-[500px] object-contain"
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
            <div className="text-white font-cairo font-normal">
              <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-wide">
                كريب
              </h1>
              <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-wide">
                المهندس
              </h1>
            </div>
          ) : (
            <div className="text-white font-anton font-normal">
              <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-wide">
                ENG
              </h1>
              <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-wide">
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
        className="absolute bottom-8 md:bottom-12 left-6 md:left-12 z-10 text-left"
      >
        {i18n.language === 'ar' ? (
          <div className="text-white font-cairo font-normal leading-relaxed text-left">
            <p className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
              نكهات لذيذة،
            </p>
            <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl mt-2 md:mt-3">
              جودة مميزة
            </p>
          </div>
        ) : (
          <div className="text-white font-anton font-normal leading-relaxed uppercase text-left">
            <p className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl tracking-wide">
              RICH FLAVORS,
            </p>
            <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl mt-2 md:mt-3 tracking-wide">
              PREMIUM QUALITY
            </p>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default Hero;




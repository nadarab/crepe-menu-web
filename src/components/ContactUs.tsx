import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const ContactUs = () => {
  const { t, i18n } = useTranslation(['contact', 'navigation']);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden bg-black"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/Backgrounds/BackgroundLap.png"
          alt="Background"
          className="hidden md:block w-full h-full object-cover"
        />
        <img
          src="/images/Backgrounds/Backgroundphone.png"
          alt="Background"
          className="block md:hidden w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-20 flex items-center justify-end px-6 md:px-12 pt-8 md:pt-10 pb-4 md:pb-6 bg-transparent">
        {/* Navigation Links - Right side */}
        <div className="flex items-center gap-8 md:gap-10">
          <button
            type="button"
            onClick={() => window.location.href = '/'}
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
            type="button"
            onClick={() => window.location.href = '/#menu'}
            className={`text-yellow-400 text-base md:text-lg lg:text-xl tracking-wide hover:text-yellow-300 transition-colors cursor-pointer ${
              i18n.language === 'ar' ? 'font-tajawal' : 'font-bree'
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
            className={`text-white text-base md:text-lg lg:text-xl tracking-wide hover:text-yellow-400 transition-colors cursor-pointer ${
              i18n.language === 'ar' ? 'font-tajawal' : 'font-bree'
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
            className={`text-white text-base md:text-lg lg:text-xl tracking-wide bg-white/10 px-4 py-2 rounded cursor-pointer ${
              i18n.language === 'ar' ? 'font-tajawal' : 'font-bree'
            }`}
            style={{ 
              border: 'none', 
              cursor: 'pointer',
              boxShadow: 'none'
            }}
          >
            {t('contact', { ns: 'navigation' })}
          </button>
          
          {/* Language Switcher */}
          <div className="flex items-center gap-2 ml-4 border-l border-white/30 pl-4">
            <button
              type="button"
              onClick={() => changeLanguage('en')}
              className={`font-bree text-base md:text-lg lg:text-xl tracking-wide transition-colors cursor-pointer ${
                i18n.language === 'en'
                  ? 'text-yellow-400 font-semibold'
                  : 'text-white hover:text-yellow-400'
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
              EN
            </button>
            <span className="text-white/50 text-lg md:text-xl">|</span>
            <button
              type="button"
              onClick={() => changeLanguage('ar')}
              className={`font-bree text-base md:text-lg lg:text-xl transition-colors cursor-pointer ${
                i18n.language === 'ar'
                  ? 'text-yellow-400 font-semibold'
                  : 'text-white hover:text-yellow-400'
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
              AR
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center md:gap-0 px-6 md:px-12 lg:px-20 pt-0 md:pt-2 pb-4 md:pb-8">
        {/* Left Side - Phone Mockup */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 flex justify-center md:justify-start mb-12 md:mb-0 md:-mt-16 lg:-mt-20 md:-ml-16 lg:-ml-24"
        >
          <div className="relative transform md:rotate-[-5deg] hover:rotate-0 transition-transform duration-300">
            <img
              src="/images/ContactUs/phone.png"
              alt="Instagram Profile"
              className="w-64 md:w-[400px] lg:w-[500px] xl:w-[600px] h-auto object-contain drop-shadow-xl"
            />
          </div>
        </motion.div>

        {/* Right Side - Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full md:w-1/2 text-center md:-mt-24 lg:-mt-32 md:-ml-24 lg:-ml-32"
        >
          {/* Title */}
          <h1 className={`text-[5rem] md:text-[7rem] lg:text-[9rem] xl:text-[11rem] font-bold text-white mb-4 md:mb-6 leading-tight ${
            i18n.language === 'ar' ? 'font-tajawal' : 'font-bree'
          }`}>
            {t('title', { ns: 'contact' })}
          </h1>

          {/* Subtitle */}
          <p className={`text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white/90 mb-6 md:mb-8 max-w-[22rem] md:max-w-[28rem] lg:max-w-[36rem] xl:max-w-[42rem] mx-auto leading-relaxed ${
            i18n.language === 'ar' ? 'font-tajawal' : 'font-bree'
          }`}>
            {t('subtitle', { ns: 'contact' })}
          </p>

          {/* Instagram Link */}
          <a
            href="https://www.instagram.com/eng.crepe?igsh=MWF3OWlncnZhdGxrcA=="
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 text-white hover:text-yellow-400 transition-colors group"
          >
            <img
              src="/images/ContactUs/InstaIcon.png"
              alt="Instagram"
              className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 group-hover:scale-110 transition-transform brightness-0 invert"
            />
            <span className={`text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white ${
              i18n.language === 'ar' ? 'font-tajawal' : 'font-bree'
            }`}>
              {t('instagram', { ns: 'contact' })}
            </span>
          </a>
        </motion.div>
      </div>

      {/* Location Icon - Bottom Right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute bottom-4 right-8 md:bottom-8 md:right-12 z-10"
      >
        <a
          href="https://maps.google.com/?q=Al-Salt+Dababteh"
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:scale-110 transition-transform"
        >
          <img
            src="/images/ContactUs/locatioIcon.png"
            alt="Location"
            className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 opacity-80 hover:opacity-100 transition-opacity brightness-0 invert"
          />
        </a>
      </motion.div>
    </section>
  );
};

export default ContactUs;

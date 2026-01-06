import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

// Get language from localStorage, browser, or default to 'en'
const getInitialLanguage = (): string => {
  const stored = localStorage.getItem('i18nextLng');
  if (stored && (stored === 'en' || stored === 'ar')) {
    return stored;
  }
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'ar' ? 'ar' : 'en';
};

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'menu', 'navigation'],
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

// Update HTML attributes when language changes
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  localStorage.setItem('i18nextLng', lng);
});

// Set initial HTML attributes
document.documentElement.lang = i18n.language;
document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';

export default i18n;


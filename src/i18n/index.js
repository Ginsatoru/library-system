import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// EN (structured key namespaces only)
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';

// KM
import kmCommon from './locales/km/common.json';
import kmAuth from './locales/km/auth.json';
import kmHome from './locales/km/home.json';
import kmBooks from './locales/km/books.json';
import kmNav from './locales/km/nav.json';
import kmHistory from './locales/km/history.json';
import kmLibraryLog from './locales/km/libraryLog.json';
import kmNotFound from './locales/km/notFound.json';
import kmProfile from './locales/km/profile.json';
import kmWishlist from './locales/km/wishlist.json';

const applyLang = (lng) => {
  document.documentElement.lang = lng === 'km' ? 'km' : 'en';
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        auth: enAuth,
      },
      km: {
        common: kmCommon,
        auth: kmAuth,
        home: kmHome,
        books: kmBooks,
        nav: kmNav,
        history: kmHistory,
        libraryLog: kmLibraryLog,
        notFound: kmNotFound,
        profile: kmProfile,
        wishlist: kmWishlist,
      },
    },
    lng: localStorage.getItem('lng') || 'en',
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });

applyLang(i18n.language);
i18n.on('languageChanged', applyLang);

export default i18n;
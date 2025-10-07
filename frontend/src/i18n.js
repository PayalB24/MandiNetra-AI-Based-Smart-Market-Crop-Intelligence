import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Simple resources for testing
const resources = {
  en: {
    translation: {
      "header": {
        "title": "MandiNetra",
        "tagline": "मंडी की आंख | The Eye on the Mandi",
        "subtagline": "AI-powered marketplace connecting farmers directly with consumers",
        "directFarm": "🌱 Direct from Farm",
        "aiPowered": "🤖 AI Powered"
      }
    }
  },
  hi: {
    translation: {
      "header": {
        "title": "मंडीनेत्र", 
        "tagline": "मंडी की आंख | The Eye on the Mandi",
        "subtagline": "किसानों को सीधे उपभोक्ताओं से जोड़ने वाला एआई-संचालित बाजार",
        "directFarm": "🌱 सीधे खेत से",
        "aiPowered": "🤖 एआई संचालित"
      }
    }
  },
  mr: {
    translation: {
      "header": {
        "title": "मंडीनेत्र",
        "tagline": "मंडीची डोळा | The Eye on the Mandi", 
        "subtagline": "शेतकऱ्यांना थेट ग्राहकांशी जोडणारे AI-चालित बाजार",
        "directFarm": "🌱 शेतातून थेट",
        "aiPowered": "🤖 AI चालित"
      }
    }
  }
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    debug: true, // This will show logs in console
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
  });

console.log('i18n initialized with languages:', Object.keys(resources));

export default i18n;
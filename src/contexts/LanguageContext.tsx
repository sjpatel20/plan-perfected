import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'te' | 'ta' | 'mr';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
];

type TranslationKey = keyof typeof translations.en;

const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    weather: 'Weather',
    cropHealth: 'Crop Health',
    market: 'Market Prices',
    schemes: 'Govt Schemes',
    profile: 'My Farm',
    settings: 'Settings',
    logout: 'Logout',
    
    // Dashboard
    welcomeMessage: 'Welcome to KisanIQ',
    todayWeather: "Today's Weather",
    weatherAlerts: 'Weather Alerts',
    cropStatus: 'Crop Status',
    marketPrices: 'Market Prices',
    advisories: 'Advisories',
    quickActions: 'Quick Actions',
    
    // Weather
    temperature: 'Temperature',
    humidity: 'Humidity',
    rainfall: 'Rainfall',
    wind: 'Wind Speed',
    forecast: '7-Day Forecast',
    weatherWarning: 'Weather Warning',
    noAlerts: 'No weather alerts',
    sunny: 'Sunny',
    cloudy: 'Cloudy',
    rainy: 'Rainy',
    stormy: 'Stormy',
    
    // Crop Health
    scanCrop: 'Scan Crop',
    uploadPhoto: 'Upload Photo',
    recentScans: 'Recent Scans',
    healthStatus: 'Health Status',
    healthy: 'Healthy',
    diseased: 'Diseased',
    pestDetected: 'Pest Detected',
    
    // Market
    currentPrices: 'Current Prices',
    priceHistory: 'Price History',
    nearbyMandis: 'Nearby Mandis',
    bestPrice: 'Best Price',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    search: 'Search',
    viewAll: 'View All',
    lastUpdated: 'Last Updated',
    location: 'Location',
    
    // Units
    celsius: '°C',
    percent: '%',
    kmh: 'km/h',
    mm: 'mm',
    perQuintal: '/quintal',
    
    // App
    appName: 'Smart किसान',
    appTagline: 'Smart Farming, Better Harvest',
    selectLanguage: 'Select Language',
  },
  hi: {
    // Navigation
    dashboard: 'डैशबोर्ड',
    weather: 'मौसम',
    cropHealth: 'फसल स्वास्थ्य',
    market: 'बाज़ार भाव',
    schemes: 'सरकारी योजनाएं',
    profile: 'मेरा खेत',
    settings: 'सेटिंग्स',
    logout: 'लॉग आउट',
    
    // Dashboard
    welcomeMessage: 'किसानIQ में आपका स्वागत है',
    todayWeather: 'आज का मौसम',
    weatherAlerts: 'मौसम अलर्ट',
    cropStatus: 'फसल की स्थिति',
    marketPrices: 'बाज़ार भाव',
    advisories: 'सलाह',
    quickActions: 'त्वरित कार्य',
    
    // Weather
    temperature: 'तापमान',
    humidity: 'आर्द्रता',
    rainfall: 'वर्षा',
    wind: 'हवा की गति',
    forecast: '7 दिनों का पूर्वानुमान',
    weatherWarning: 'मौसम चेतावनी',
    noAlerts: 'कोई मौसम अलर्ट नहीं',
    sunny: 'धूप',
    cloudy: 'बादल',
    rainy: 'बारिश',
    stormy: 'तूफानी',
    
    // Crop Health
    scanCrop: 'फसल स्कैन करें',
    uploadPhoto: 'फोटो अपलोड करें',
    recentScans: 'हाल के स्कैन',
    healthStatus: 'स्वास्थ्य स्थिति',
    healthy: 'स्वस्थ',
    diseased: 'रोगग्रस्त',
    pestDetected: 'कीट पाया गया',
    
    // Market
    currentPrices: 'वर्तमान भाव',
    priceHistory: 'भाव इतिहास',
    nearbyMandis: 'नज़दीकी मंडियां',
    bestPrice: 'सर्वोत्तम भाव',
    
    // Common
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    retry: 'पुनः प्रयास करें',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    submit: 'जमा करें',
    search: 'खोजें',
    viewAll: 'सभी देखें',
    lastUpdated: 'अंतिम अपडेट',
    location: 'स्थान',
    
    // Units
    celsius: '°C',
    percent: '%',
    kmh: 'कि.मी./घंटा',
    mm: 'मि.मी.',
    perQuintal: '/क्विंटल',
    
    // App
    appName: 'Smart किसान',
    appTagline: 'स्मार्ट खेती, बेहतर फसल',
    selectLanguage: 'भाषा चुनें',
  },
  te: {
    // Navigation
    dashboard: 'డ్యాష్‌బోర్డ్',
    weather: 'వాతావరణం',
    cropHealth: 'పంట ఆరోగ్యం',
    market: 'మార్కెట్ ధరలు',
    schemes: 'ప్రభుత్వ పథకాలు',
    profile: 'నా పొలం',
    settings: 'సెట్టింగ్‌లు',
    logout: 'లాగ్ అవుట్',
    
    // Dashboard
    welcomeMessage: 'కిసాన్IQ కి స్వాగతం',
    todayWeather: 'ఈరోజు వాతావరణం',
    weatherAlerts: 'వాతావరణ హెచ్చరికలు',
    cropStatus: 'పంట స్థితి',
    marketPrices: 'మార్కెట్ ధరలు',
    advisories: 'సలహాలు',
    quickActions: 'త్వరిత చర్యలు',
    
    // Weather
    temperature: 'ఉష్ణోగ్రత',
    humidity: 'తేమ',
    rainfall: 'వర్షపాతం',
    wind: 'గాలి వేగం',
    forecast: '7 రోజుల అంచనా',
    weatherWarning: 'వాతావరణ హెచ్చరిక',
    noAlerts: 'వాతావరణ హెచ్చరికలు లేవు',
    sunny: 'ఎండగా',
    cloudy: 'మేఘావృతం',
    rainy: 'వర్షం',
    stormy: 'తుఫాను',
    
    // Crop Health
    scanCrop: 'పంట స్కాన్ చేయండి',
    uploadPhoto: 'ఫోటో అప్‌లోడ్',
    recentScans: 'ఇటీవలి స్కాన్‌లు',
    healthStatus: 'ఆరోగ్య స్థితి',
    healthy: 'ఆరోగ్యంగా',
    diseased: 'వ్యాధిగ్రస్తం',
    pestDetected: 'పురుగులు కనుగొనబడ్డాయి',
    
    // Market
    currentPrices: 'ప్రస్తుత ధరలు',
    priceHistory: 'ధర చరిత్ర',
    nearbyMandis: 'సమీపంలోని మండీలు',
    bestPrice: 'ఉత్తమ ధర',
    
    // Common
    loading: 'లోడ్ అవుతోంది...',
    error: 'దోషం',
    retry: 'మళ్ళీ ప్రయత్నించండి',
    save: 'సేవ్',
    cancel: 'రద్దు',
    submit: 'సమర్పించు',
    search: 'వెతకండి',
    viewAll: 'అన్నీ చూడండి',
    lastUpdated: 'చివరి అప్‌డేట్',
    location: 'స్థానం',
    
    // Units
    celsius: '°C',
    percent: '%',
    kmh: 'కి.మీ./గం',
    mm: 'మి.మీ.',
    perQuintal: '/క్వింటాల్',
    
    // App
    appName: 'Smart किसान',
    appTagline: 'స్మార్ట్ వ్యవసాయం, మెరుగైన పంట',
    selectLanguage: 'భాష ఎంచుకోండి',
  },
  ta: {
    // Navigation
    dashboard: 'டாஷ்போர்டு',
    weather: 'வானிலை',
    cropHealth: 'பயிர் ஆரோக்கியம்',
    market: 'சந்தை விலைகள்',
    schemes: 'அரசு திட்டங்கள்',
    profile: 'என் பண்ணை',
    settings: 'அமைப்புகள்',
    logout: 'வெளியேறு',
    
    // Dashboard
    welcomeMessage: 'கிசான்IQ க்கு வரவேற்கிறோம்',
    todayWeather: 'இன்றைய வானிலை',
    weatherAlerts: 'வானிலை எச்சரிக்கைகள்',
    cropStatus: 'பயிர் நிலை',
    marketPrices: 'சந்தை விலைகள்',
    advisories: 'ஆலோசனைகள்',
    quickActions: 'விரைவு செயல்கள்',
    
    // Weather
    temperature: 'வெப்பநிலை',
    humidity: 'ஈரப்பதம்',
    rainfall: 'மழைப்பொழிவு',
    wind: 'காற்று வேகம்',
    forecast: '7 நாள் கணிப்பு',
    weatherWarning: 'வானிலை எச்சரிக்கை',
    noAlerts: 'வானிலை எச்சரிக்கைகள் இல்லை',
    sunny: 'வெயில்',
    cloudy: 'மேகமூட்டம்',
    rainy: 'மழை',
    stormy: 'புயல்',
    
    // Crop Health
    scanCrop: 'பயிரை ஸ்கேன் செய்',
    uploadPhoto: 'புகைப்படம் பதிவேற்று',
    recentScans: 'சமீபத்திய ஸ்கேன்கள்',
    healthStatus: 'ஆரோக்கிய நிலை',
    healthy: 'ஆரோக்கியமான',
    diseased: 'நோயுற்ற',
    pestDetected: 'பூச்சி கண்டறியப்பட்டது',
    
    // Market
    currentPrices: 'தற்போதைய விலைகள்',
    priceHistory: 'விலை வரலாறு',
    nearbyMandis: 'அருகிலுள்ள மண்டிகள்',
    bestPrice: 'சிறந்த விலை',
    
    // Common
    loading: 'ஏற்றுகிறது...',
    error: 'பிழை',
    retry: 'மீண்டும் முயற்சிக்கவும்',
    save: 'சேமி',
    cancel: 'ரத்துசெய்',
    submit: 'சமர்ப்பி',
    search: 'தேடு',
    viewAll: 'அனைத்தும் காண்க',
    lastUpdated: 'கடைசி புதுப்பிப்பு',
    location: 'இடம்',
    
    // Units
    celsius: '°C',
    percent: '%',
    kmh: 'கி.மீ./மணி',
    mm: 'மி.மீ.',
    perQuintal: '/குவிண்டால்',
    
    // App
    appName: 'Smart किसान',
    appTagline: 'ஸ்மார்ட் விவசாயம், சிறந்த அறுவடை',
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
  },
  mr: {
    // Navigation
    dashboard: 'डॅशबोर्ड',
    weather: 'हवामान',
    cropHealth: 'पीक आरोग्य',
    market: 'बाजार भाव',
    schemes: 'सरकारी योजना',
    profile: 'माझे शेत',
    settings: 'सेटिंग्ज',
    logout: 'बाहेर पडा',
    
    // Dashboard
    welcomeMessage: 'किसानIQ मध्ये आपले स्वागत',
    todayWeather: 'आजचे हवामान',
    weatherAlerts: 'हवामान सूचना',
    cropStatus: 'पीक स्थिती',
    marketPrices: 'बाजार भाव',
    advisories: 'सल्ला',
    quickActions: 'जलद कृती',
    
    // Weather
    temperature: 'तापमान',
    humidity: 'आर्द्रता',
    rainfall: 'पाऊस',
    wind: 'वाऱ्याचा वेग',
    forecast: '7 दिवसांचा अंदाज',
    weatherWarning: 'हवामान इशारा',
    noAlerts: 'हवामान सूचना नाही',
    sunny: 'ऊन',
    cloudy: 'ढगाळ',
    rainy: 'पावसाळी',
    stormy: 'वादळी',
    
    // Crop Health
    scanCrop: 'पीक स्कॅन करा',
    uploadPhoto: 'फोटो अपलोड करा',
    recentScans: 'अलीकडील स्कॅन',
    healthStatus: 'आरोग्य स्थिती',
    healthy: 'निरोगी',
    diseased: 'रोगट',
    pestDetected: 'कीड आढळली',
    
    // Market
    currentPrices: 'सध्याचे भाव',
    priceHistory: 'भाव इतिहास',
    nearbyMandis: 'जवळील बाजार',
    bestPrice: 'सर्वोत्तम भाव',
    
    // Common
    loading: 'लोड होत आहे...',
    error: 'त्रुटी',
    retry: 'पुन्हा प्रयत्न करा',
    save: 'जतन करा',
    cancel: 'रद्द करा',
    submit: 'सबमिट करा',
    search: 'शोधा',
    viewAll: 'सर्व पहा',
    lastUpdated: 'शेवटचे अपडेट',
    location: 'स्थान',
    
    // Units
    celsius: '°C',
    percent: '%',
    kmh: 'कि.मी./तास',
    mm: 'मि.मी.',
    perQuintal: '/क्विंटल',
    
    // App
    appName: 'Smart किसान',
    appTagline: 'स्मार्ट शेती, चांगले पीक',
    selectLanguage: 'भाषा निवडा',
  },
} as const;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('kisaniq-language');
    return (saved as Language) || 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kisaniq-language', lang);
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

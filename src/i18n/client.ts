/**
 * i18next客户端初始化配置
 * 针对Next.js 15 App Router优化
 */
import i18next from 'i18next';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { 
  SUPPORTED_LOCALES, 
  DEFAULT_LOCALE, 
  detectBrowserLanguage,
  type SupportedLocale 
} from './config';

// 默认命名空间
const DEFAULT_NAMESPACES = ['common', 'home'];
const DEFAULT_NAMESPACE = 'common';

// 语言检测器配置
const DETECTION_OPTIONS = {
  // 检测顺序
  order: [
    'querystring',  // 1. URL查询参数 ?lng=zh-CN
    'cookie',       // 2. cookie
    'localStorage', // 3. localStorage
    'sessionStorage', // 4. sessionStorage
    'navigator',    // 5. 浏览器语言
    'htmlTag',      // 6. html标签
    'path',         // 7. URL路径
    'subdomain',    // 8. 子域名
  ],
  
  // 查找的键名
  lookupQuerystring: 'lng',
  lookupCookie: 'i18next',
  lookupLocalStorage: 'i18nextLng',
  lookupSessionStorage: 'i18nextLng',
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,
  
  // 缓存配置
  caches: ['localStorage', 'cookie'],
  excludeCacheFor: ['cimode'], // 排除cimode
  
  // 其他选项
  cookieMinutes: 10 * 365 * 24 * 60, // 10年过期
  cookieDomain: '',
  htmlTag: document.documentElement,
  convertDetectedLanguage: (lng: string) => {
    // 转换为支持的语言代码
    const langPrefix = lng.split('-')[0];
    const supportedLang = SUPPORTED_LOCALES.find(code => 
      code.startsWith(langPrefix) || code === lng
    );
    return supportedLang || lng;
  },
};

// 后备翻译配置
const FALLBACK_CONFIG = {
  fallbackLng: {
    default: [DEFAULT_LOCALE],
    'zh': ['zh-CN'],
    'en': ['en-US'],
  },
  fallbackNS: DEFAULT_NAMESPACES,
  defaultNS: DEFAULT_NAMESPACE,
  fallbackOnNull: true,
  fallbackOnEmpty: false,
  appendNamespaceToMissingKey: false,
};

// 后端配置
const BACKEND_CONFIG = {
  loadPath: '/locales/{{lng}}/{{ns}}.json',
  crossDomain: true,
  requestOptions: {
    mode: 'cors',
    credentials: 'same-origin',
    cache: 'default',
  },
};

// 调试和开发配置
const DEBUG_CONFIG = process.env.NODE_ENV === 'development' ? {
  debug: true,
  saveMissing: true,
  saveMissingTo: 'current',
  updateMissing: true,
  missingKeyHandler: (
    lngs: readonly string[],
    ns: string,
    key: string,
    fallbackValue: string
  ) => {
    console.warn(`Missing translation key: ${key} for language ${lngs} in namespace ${ns}`);
  },
} : {
  debug: false,
  saveMissing: false,
};

// 主配置
export const i18nConfig = {
  supportedLngs: SUPPORTED_LOCALES,
  lng: DEFAULT_LOCALE,
  ...FALLBACK_CONFIG,
  ...BACKEND_CONFIG,
  ...DEBUG_CONFIG,
  ns: DEFAULT_NAMESPACES,
  partialBundledLanguages: true,
  interpolation: {
    escapeValue: false, // React已经处理XSS
    formatSeparator: ',',
    format: (value: any, format: string) => {
      if (format === 'uppercase') return value.toUpperCase();
      if (format === 'lowercase') return value.toLowerCase();
      if (format === 'capitalize') return value.charAt(0).toUpperCase() + value.slice(1);
      return value;
    },
  },
  detection: DETECTION_OPTIONS,
  react: {
    bindI18n: 'languageChanged',
    bindI18nStore: '',
    transEmptyNodeValue: '',
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'b'],
    useSuspense: false, // 在Next.js中通常禁用
  },
  backend: BACKEND_CONFIG,
};

// 单例实例
let i18nInstance: typeof i18next | null = null;

/**
 * 初始化i18next实例
 */
export async function initI18n(locale?: SupportedLocale) {
  if (i18nInstance && i18nInstance.isInitialized) {
    return i18nInstance;
  }
  
  const instance = i18next.createInstance();
  
  await instance
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      ...i18nConfig,
      lng: locale || detectBrowserLanguage(),
      preload: locale ? [locale] : [detectBrowserLanguage(), DEFAULT_LOCALE],
    });
  
  i18nInstance = instance;
  return instance;
}

/**
 * 获取i18n实例
 */
export function getI18n() {
  if (!i18nInstance) {
    throw new Error('i18n not initialized. Call initI18n first.');
  }
  return i18nInstance;
}

/**
 * 更改当前语言
 */
export async function changeLanguage(lng: SupportedLocale) {
  const instance = getI18n();
  await instance.changeLanguage(lng);
  
  // 更新HTML标签属性
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
    const direction = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
  }
  
  return lng;
}

/**
 * 获取当前语言
 */
export function getCurrentLanguage(): SupportedLocale {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }
  
  const instance = getI18n();
  return (instance.language as SupportedLocale) || DEFAULT_LOCALE;
}

/**
 * 获取翻译函数（服务端兼容）
 */
export async function getTranslation(locale: SupportedLocale, namespaces: string[] = DEFAULT_NAMESPACES) {
  const instance = await initI18n(locale);
  
  // 预加载命名空间
  await Promise.all(
    namespaces.map(ns => instance.loadNamespaces(ns))
  );
  
  return {
    t: instance.t,
    i18n: instance,
  };
}

export default i18nInstance;
import { derived, writable, type Readable } from 'svelte/store';
import { browser } from '$app/environment';

// 支持的语言
export const SUPPORTED_LOCALES = ['zh', 'en'] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

// 默认语言
export const DEFAULT_LOCALE: SupportedLocale = 'zh';

// 语言映射
export const LOCALE_MAPPING = {
  'zh': 'zh-CN',
  'zh-CN': 'zh',
  'zh-TW': 'zh',
  'en': 'en-US',
  'en-US': 'en',
  'en-GB': 'en',
} as const;

// 语言元数据
export const LANGUAGES = {
  'zh': {
    code: 'zh',
    name: '简体中文',
    nativeName: '简体中文',
    direction: 'ltr',
    flag: '🇨🇳',
  },
  'en': {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    flag: '🇺🇸',
  },
} as const;

// 检测浏览器语言
export function detectBrowserLanguage(): SupportedLocale {
  if (!browser) return DEFAULT_LOCALE;
  
  const browserLangs = navigator.languages || [navigator.language];
  
  for (const lang of browserLangs) {
    const normalized = lang.replace('-', '_').toLowerCase();
    
    // 检查完整代码
    for (const supported of SUPPORTED_LOCALES) {
      if (normalized.startsWith(supported)) {
        return supported;
      }
    }
    
    // 检查映射
    if (LOCALE_MAPPING[normalized]) {
      return LOCALE_MAPPING[normalized] as SupportedLocale;
    }
  }
  
  return DEFAULT_LOCALE;
}

// 语言存储
const storedLocale = browser 
  ? localStorage.getItem('locale') as SupportedLocale
  : null;

export const locale = writable<SupportedLocale>(
  storedLocale || detectBrowserLanguage()
);

// 订阅locale变化
if (browser) {
  locale.subscribe((value) => {
    localStorage.setItem('locale', value);
    document.documentElement.lang = LOCALE_MAPPING[value] || value;
    document.documentElement.dir = LANGUAGES[value].direction;
  });
}

// 翻译存储
export const translations = writable<Record<string, any>>({});

// 加载翻译
export async function loadTranslations(locale: SupportedLocale) {
  try {
    const module = await import(`../lib/locales/${locale}.json`);
    translations.set(module.default);
  } catch (error) {
    console.error(`Failed to load translations for ${locale}:`, error);
  }
}

// 初始化加载
if (browser) {
  locale.subscribe((loc) => {
    loadTranslations(loc);
  });
}
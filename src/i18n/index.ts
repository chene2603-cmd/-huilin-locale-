import { createI18n } from 'vue-i18n';
import type { I18n, I18nOptions } from 'vue-i18n';
import zhCN from '@/locales/zh-CN.json';
import enUS from '@/locales/en-US.json';

// 支持的语言
export const SUPPORTED_LOCALES = ['zh-CN', 'en-US'] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

// 默认语言
export const DEFAULT_LOCALE: SupportedLocale = 'zh-CN';

// 语言元数据
export const LANGUAGES = {
  'zh-CN': {
    code: 'zh-CN',
    name: '简体中文',
    nativeName: '简体中文',
    direction: 'ltr',
    flag: '🇨🇳',
  },
  'en-US': {
    code: 'en-US',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    flag: '🇺🇸',
  },
} as const;

// 检测浏览器语言
export function detectBrowserLanguage(): SupportedLocale {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }

  const browserLangs = navigator.languages || [navigator.language];
  
  for (const lang of browserLangs) {
    const normalized = lang.replace('-', '_');
    
    // 精确匹配
    if (SUPPORTED_LOCALES.includes(normalized as SupportedLocale)) {
      return normalized as SupportedLocale;
    }
    
    // 前缀匹配
    const prefix = normalized.split('_')[0];
    const matched = SUPPORTED_LOCALES.find(locale => 
      locale.startsWith(prefix)
    );
    if (matched) return matched;
  }
  
  return DEFAULT_LOCALE;
}

// 消息资源
const messages = {
  'zh-CN': zhCN,
  'en-US': enUS,
} as const;

// 创建i18n实例
export function createI18nInstance(): I18n {
  const locale = detectBrowserLanguage();
  const fallbackLocale = DEFAULT_LOCALE;
  
  return createI18n<I18nOptions<typeof messages>, SupportedLocale>({
    legacy: false, // Composition API模式
    locale,
    fallbackLocale,
    messages,
    globalInjection: true,
    warnHtmlMessage: false,
    missingWarn: false,
    fallbackWarn: false,
    silentTranslationWarn: process.env.NODE_ENV === 'production',
    datetimeFormats: {
      'zh-CN': {
        short: {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        },
        long: {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        },
      },
      'en-US': {
        short: {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        },
        long: {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        },
      },
    },
    numberFormats: {
      'zh-CN': {
        currency: {
          style: 'currency',
          currency: 'CNY',
          notation: 'standard',
        },
        decimal: {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      },
      'en-US': {
        currency: {
          style: 'currency',
          currency: 'USD',
          notation: 'standard',
        },
        decimal: {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      },
    },
  });
}

// 获取i18n实例
let i18nInstance: I18n | null = null;

export function getI18n(): I18n {
  if (!i18nInstance) {
    i18nInstance = createI18nInstance();
  }
  return i18nInstance;
}

// 切换语言
export async function changeLanguage(locale: SupportedLocale): Promise<void> {
  const i18n = getI18n();
  
  if (i18n.global.locale.value === locale) {
    return;
  }
  
  // 这里可以添加动态加载逻辑
  i18n.global.locale.value = locale;
  
  // 更新HTML属性
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale;
    document.documentElement.dir = LANGUAGES[locale].direction;
  }
}
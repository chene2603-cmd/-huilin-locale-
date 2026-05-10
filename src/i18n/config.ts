/**
 * 多语言配置文件
 * 定义支持的语言、默认语言、语言检测逻辑
 */

// 支持的语言配置
export const SUPPORTED_LOCALES = ['zh-CN', 'en-US'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

// 语言元数据
export interface LanguageMetadata {
  code: SupportedLocale;
  name: string; // 本地化名称
  nativeName: string; // 原生名称
  direction: 'ltr' | 'rtl';
  flag: string; // 国旗emoji
}

export const LANGUAGES: Record<SupportedLocale, LanguageMetadata> = {
  'zh-CN': {
    code: 'zh-CN',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    direction: 'ltr',
    flag: '🇨🇳',
  },
  'en-US': {
    code: 'en-US',
    name: 'English (US)',
    nativeName: 'English',
    direction: 'ltr',
    flag: '🇺🇸',
  },
} as const;

// 默认语言
export const DEFAULT_LOCALE: SupportedLocale = 'zh-CN';

// 支持的语言代码前缀映射
const LANGUAGE_PREFIX_MAP: Record<string, SupportedLocale> = {
  'zh': 'zh-CN',
  'zh-CN': 'zh-CN',
  'zh-HK': 'zh-CN',
  'zh-TW': 'zh-CN',
  'en': 'en-US',
  'en-US': 'en-US',
  'en-GB': 'en-US',
  'en-CA': 'en-US',
};

/**
 * 检测浏览器首选语言
 * 支持前缀匹配（如 'zh' -> 'zh-CN'）
 */
export function detectBrowserLanguage(): SupportedLocale {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }

  const browserLanguages = navigator.languages || [navigator.language];
  
  for (const browserLang of browserLanguages) {
    const normalizedLang = browserLang.trim().split(';')[0];
    
    // 精确匹配
    if (SUPPORTED_LOCALES.includes(normalizedLang as SupportedLocale)) {
      return normalizedLang as SupportedLocale;
    }
    
    // 前缀匹配
    const langPrefix = normalizedLang.split('-')[0];
    if (LANGUAGE_PREFIX_MAP[langPrefix]) {
      return LANGUAGE_PREFIX_MAP[langPrefix];
    }
    
    // 完整代码映射
    if (LANGUAGE_PREFIX_MAP[normalizedLang]) {
      return LANGUAGE_PREFIX_MAP[normalizedLang];
    }
  }
  
  return DEFAULT_LOCALE;
}

/**
 * 验证语言代码是否受支持
 */
export function isValidLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

/**
 * 从URL路径解析语言
 */
export function parseLocaleFromPath(pathname: string): SupportedLocale | null {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;
  
  const potentialLocale = segments[0];
  return isValidLocale(potentialLocale) ? potentialLocale : null;
}

/**
 * 获取RTL语言配置
 */
export const RTL_LANGUAGES: SupportedLocale[] = [];
// 未来添加RTL语言，如：'ar', 'he', 'fa'
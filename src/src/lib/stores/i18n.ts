import { derived, get } from 'svelte/store';
import { locale, translations, type SupportedLocale } from '../../i18n';

// 翻译函数
function translate(
  key: string,
  variables?: Record<string, any>,
  fallback?: string
): string {
  const t = get(translations);
  const keys = key.split('.');
  let value = t;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation: ${key}`);
      }
      return fallback || key;
    }
  }
  
  if (typeof value !== 'string') {
    return fallback || key;
  }
  
  // 变量替换
  if (variables) {
    return Object.entries(variables).reduce((str, [key, val]) => {
      return str.replace(new RegExp(`{{${key}}}`, 'g'), String(val));
    }, value);
  }
  
  return value;
}

// 导出的翻译函数
export const t = derived([locale, translations], () => {
  return (key: string, variables?: Record<string, any>, fallback?: string) => {
    return translate(key, variables, fallback);
  };
});

// 格式化函数
export const format = {
  date: (date: Date, locale: SupportedLocale = get(locale)): string => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  },
  
  number: (num: number, locale: SupportedLocale = get(locale)): string => {
    return new Intl.NumberFormat(locale).format(num);
  },
  
  currency: (
    amount: number, 
    currency: string = 'USD',
    locale: SupportedLocale = get(locale)
  ): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  },
};
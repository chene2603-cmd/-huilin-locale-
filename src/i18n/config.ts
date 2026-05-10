import { InitOptions } from 'i18next';

export const fallbackLng = 'en-US';
export const locales = ['en-US', 'zh-CN', 'ja-JP'];
export const defaultNS = 'common';

export function getOptions(lng = fallbackLng, ns = defaultNS): InitOptions {
  return {
    supportedLngs: locales,
    fallbackLng,
    lng,
    ns,
    defaultNS,
    fallbackNS: defaultNS,
    interpolation: {
      escapeValue: false,
    },
  };
}

export const RTL_LANGUAGES: string[] = ['ar']; // 已预留阿拉伯语等 RTL 语言
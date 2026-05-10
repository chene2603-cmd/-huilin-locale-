// 语言配置
const I18N_CONFIG = {
  SUPPORTED_LOCALES: ['zh-CN', 'en-US'],
  DEFAULT_LOCALE: 'zh-CN',
  FALLBACK_LOCALE: 'zh-CN',
  DETECTION_ORDER: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
  STORAGE_KEY: 'user_locale',
  QUERY_PARAM: 'lang',
};

// 翻译存储
let translations = {};

// 当前语言
let currentLocale = I18N_CONFIG.DEFAULT_LOCALE;

// 检测语言
function detectLanguage() {
  const { DETECTION_ORDER, STORAGE_KEY, QUERY_PARAM, DEFAULT_LOCALE } = I18N_CONFIG;
  
  for (const method of DETECTION_ORDER) {
    let detected = null;
    
    switch (method) {
      case 'querystring':
        detected = getQueryParam(QUERY_PARAM);
        break;
        
      case 'localStorage':
        detected = localStorage.getItem(STORAGE_KEY);
        break;
        
      case 'navigator':
        detected = detectBrowserLanguage();
        break;
        
      case 'htmlTag':
        detected = document.documentElement.lang;
        break;
    }
    
    if (detected && isValidLocale(detected)) {
      return detected;
    }
  }
  
  return DEFAULT_LOCALE;
}

// 检测浏览器语言
function detectBrowserLanguage() {
  const browserLangs = navigator.languages || [navigator.language];
  
  for (const lang of browserLangs) {
    // 精确匹配
    if (I18N_CONFIG.SUPPORTED_LOCALES.includes(lang)) {
      return lang;
    }
    
    // 前缀匹配
    const prefix = lang.split('-')[0];
    const matched = I18N_CONFIG.SUPPORTED_LOCALES.find(locale => 
      locale.startsWith(prefix)
    );
    if (matched) return matched;
  }
  
  return null;
}

// 验证语言
function isValidLocale(locale) {
  return I18N_CONFIG.SUPPORTED_LOCALES.includes(locale);
}

// 获取URL参数
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// 加载翻译
async function loadTranslations(locale) {
  try {
    const response = await fetch(`/locales/${locale}.json`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to load ${locale} translations:`, error);
    
    // 尝试加载后备语言
    if (locale !== I18N_CONFIG.FALLBACK_LOCALE) {
      console.log(`Falling back to ${I18N_CONFIG.FALLBACK_LOCALE}`);
      return loadTranslations(I18N_CONFIG.FALLBACK_LOCALE);
    }
    
    return {};
  }
}

// 翻译函数
function translate(key, variables = {}) {
  const keys = key.split('.');
  let value = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`Missing translation: ${key}`);
      return key;
    }
  }
  
  if (typeof value !== 'string') {
    return key;
  }
  
  // 变量替换
  let result = value;
  for (const [varKey, varValue] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${varKey}}}`, 'g'), varValue);
  }
  
  return result;
}

// 切换语言
async function changeLanguage(locale) {
  if (!isValidLocale(locale)) {
    console.error(`Unsupported locale: ${locale}`);
    return false;
  }
  
  if (locale === currentLocale) {
    return true;
  }
  
  try {
    // 加载新翻译
    const newTranslations = await loadTranslations(locale);
    
    // 更新状态
    translations = newTranslations;
    currentLocale = locale;
    
    // 保存到localStorage
    localStorage.setItem(I18N_CONFIG.STORAGE_KEY, locale);
    
    // 更新HTML属性
    document.documentElement.lang = locale;
    
    // 重新翻译页面
    translatePage();
    
    // 更新URL
    updateUrlParam(locale);
    
    // 触发事件
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: locale 
    }));
    
    return true;
  } catch (error) {
    console.error(`Failed to change language to ${locale}:`, error);
    return false;
  }
}

// 翻译整个页面
function translatePage() {
  // 翻译data-i18n属性
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const vars = JSON.parse(element.getAttribute('data-i18n-vars') || '{}');
    const translation = translate(key, vars);
    
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      element.placeholder = translation;
    } else if (element.tagName === 'IMG') {
      element.alt = translation;
    } else {
      element.textContent = translation;
    }
  });
  
  // 翻译data-i18n-title属性
  document.querySelectorAll('[data-i18n-title]').forEach(element => {
    const key = element.getAttribute('data-i18n-title');
    element.title = translate(key);
  });
  
  // 翻译data-i18n-aria-label属性
  document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
    const key = element.getAttribute('data-i18n-aria-label');
    element.setAttribute('aria-label', translate(key));
  });
  
  // 更新页面标题
  const titleKey = document.documentElement.getAttribute('data-i18n-title');
  if (titleKey) {
    document.title = translate(titleKey);
  }
}

// 更新URL参数
function updateUrlParam(locale) {
  const url = new URL(window.location);
  
  if (locale === I18N_CONFIG.DEFAULT_LOCALE) {
    url.searchParams.delete(I18N_CONFIG.QUERY_PARAM);
  } else {
    url.searchParams.set(I18N_CONFIG.QUERY_PARAM, locale);
  }
  
  // 更新URL但不刷新页面
  window.history.replaceState({}, '', url);
}

// 初始化
async function initI18n() {
  // 检测语言
  currentLocale = detectLanguage();
  
  // 加载翻译
  translations = await loadTranslations(currentLocale);
  
  // 设置HTML属性
  document.documentElement.lang = currentLocale;
  
  // 翻译页面
  translatePage();
  
  // 监听URL变化
  window.addEventListener('popstate', () => {
    const newLocale = getQueryParam(I18N_CONFIG.QUERY_PARAM) || 
                     localStorage.getItem(I18N_CONFIG.STORAGE_KEY) ||
                     detectBrowserLanguage() ||
                     I18N_CONFIG.DEFAULT_LOCALE;
    
    if (newLocale !== currentLocale && isValidLocale(newLocale)) {
      changeLanguage(newLocale);
    }
  });
  
  return { translate, changeLanguage, currentLocale };
}

// 导出API
window.I18n = {
  init: initI18n,
  t: translate,
  changeLanguage,
  getCurrentLocale: () => currentLocale,
  getSupportedLocales: () => [...I18N_CONFIG.SUPPORTED_LOCALES],
};
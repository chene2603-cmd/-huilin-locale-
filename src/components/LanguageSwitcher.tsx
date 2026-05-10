/**
 * 语言切换器组件
 * 支持下拉菜单和按钮两种模式
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  SUPPORTED_LOCALES, 
  LANGUAGES, 
  type SupportedLocale,
  type LanguageMetadata 
} from '@/i18n/config';
import { changeLanguage, getCurrentLanguage } from '@/i18n/client';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'buttons';
  showFlags?: boolean;
  showNativeNames?: boolean;
  className?: string;
}

export default function LanguageSwitcher({
  variant = 'dropdown',
  showFlags = true,
  showNativeNames = true,
  className = '',
}: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<SupportedLocale>(getCurrentLanguage());
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // 获取当前语言信息
  const currentLanguage = LANGUAGES[currentLang];
  
  // 点击外部关闭下拉
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // 监听语言变化
  useEffect(() => {
    const handleLanguageChanged = () => {
      setCurrentLanguage(getCurrentLanguage());
    };
    
    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);
  
  // 切换语言
  const handleLanguageChange = async (locale: SupportedLocale) => {
    if (locale === currentLang) {
      setIsOpen(false);
      return;
    }
    
    try {
      await changeLanguage(locale);
      setCurrentLanguage(locale);
      setIsOpen(false);
      
      // 触发自定义事件供其他组件监听
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: locale }));
      
      // 可选：发送分析事件
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'language_change', {
          'event_category': 'engagement',
          'event_label': locale,
        });
      }
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };
  
  // 按钮模式
  if (variant === 'buttons') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {SUPPORTED_LOCALES.map((locale) => {
          const lang = LANGUAGES[locale];
          const isActive = locale === currentLang;
          
          return (
            <button
              key={locale}
              onClick={() => handleLanguageChange(locale)}
              className={`
                inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              `}
              aria-label={t('common.switch_to_language', { language: lang.nativeName }, '切换到{{language}}')}
              aria-current={isActive ? 'true' : 'false'}
            >
              {showFlags && <span className="text-base">{lang.flag}</span>}
              {showNativeNames ? lang.nativeName : lang.code}
            </button>
          );
        })}
      </div>
    );
  }
  
  // 下拉菜单模式
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center justify-between gap-2 rounded-md border border-gray-300 
          bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 
          focus:ring-offset-2 focus:ring-offset-white
          transition-colors duration-200
          min-w-[120px]
        `}
        aria-label={t('common.select_language', '选择语言')}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          {showFlags && <span className="text-base">{currentLanguage.flag}</span>}
          <span className="truncate">
            {showNativeNames ? currentLanguage.nativeName : currentLanguage.code}
          </span>
        </span>
        <svg
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      
      {isOpen && (
        <div
          className={`
            absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md 
            bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5
            focus:outline-none animate-in fade-in slide-in-from-top-2
            ${currentLanguage.direction === 'rtl' ? 'text-right' : 'text-left'}
          `}
          role="listbox"
          tabIndex={-1}
        >
          {SUPPORTED_LOCALES.map((locale) => {
            const lang = LANGUAGES[locale];
            const isActive = locale === currentLang;
            
            return (
              <button
                key={locale}
                onClick={() => handleLanguageChange(locale)}
                className={`
                  flex w-full items-center gap-3 px-4 py-2 text-sm
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                  transition-colors duration-100
                `}
                role="option"
                aria-selected={isActive}
              >
                {showFlags && (
                  <span className="text-lg flex-shrink-0">{lang.flag}</span>
                )}
                <div className="flex flex-col items-start flex-1 min-w-0">
                  <span className="font-medium truncate w-full">
                    {lang.nativeName}
                  </span>
                  <span className="text-xs text-gray-500 truncate w-full">
                    {lang.name}
                  </span>
                </div>
                {isActive && (
                  <svg
                    className="h-5 w-5 text-blue-600 flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            );
          })}
          
          {/* 分隔线 */}
          <div className="my-1 border-t border-gray-100" />
          
          {/* 添加语言链接 */}
          <a
            href="https://github.com/your-repo/contributing#translations"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            {t('common.help_translate', '帮助翻译')}
          </a>
        </div>
      )}
    </div>
  );
}
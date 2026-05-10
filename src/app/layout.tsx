/**
 * 根布局组件
 * 注入i18n上下文，设置全局字体和文本方向
 */
import type { Metadata } from 'next';
import { Inter, Noto_Sans_SC, Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { I18nextProvider } from 'react-i18next';
import { initI18n, getCurrentLanguage } from '@/i18n/client';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import DirectionWrapper from '@/components/DirectionWrapper';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/i18n/config';

// 字体配置
const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
});

const notoSansSC = Noto_Sans_SC({ 
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto-sans-sc',
  display: 'swap',
});

const notoSansJP = Noto_Sans_JP({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
});

// 生成多语言metadata
export async function generateMetadata(): Promise<Metadata> {
  const i18n = await initI18n();
  const t = i18n.getFixedT(DEFAULT_LOCALE, 'common');
  
  return {
    title: t('metadata.title', '多语言应用'),
    description: t('metadata.description', '一个支持多语言的Next.js应用示例'),
    keywords: t('metadata.keywords', 'i18n, 国际化, 多语言, Next.js'),
    authors: [{ name: t('metadata.author', 'Your Team') }],
    openGraph: {
      title: t('metadata.og_title', '多语言应用'),
      description: t('metadata.og_description', '一个支持多语言的Next.js应用示例'),
      type: 'website',
      locale: DEFAULT_LOCALE,
      alternateLocale: SUPPORTED_LOCALES.filter(locale => locale !== DEFAULT_LOCALE),
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const i18n = await initI18n();
  const currentLang = getCurrentLanguage();
  const direction = currentLang === 'ar' ? 'rtl' : 'ltr'; // 支持RTL扩展
  
  return (
    <html 
      lang={currentLang} 
      dir={direction}
      className={`${inter.variable} ${notoSansSC.variable} ${notoSansJP.variable}`}
    >
      <head>
        {/* 多语言SEO优化 */}
        {SUPPORTED_LOCALES.map((locale) => (
          <link
            key={locale}
            rel="alternate"
            hrefLang={locale}
            href={`https://yourapp.com/${locale === DEFAULT_LOCALE ? '' : locale}`}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href="https://yourapp.com/" />
        
        {/* 字体预加载 */}
        <link
          rel="preload"
          href="/fonts/NotoSansSC-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`antialiased ${direction === 'rtl' ? 'font-arabic' : ''}`}>
        <I18nextProvider i18n={i18n}>
          <DirectionWrapper direction={direction}>
            {/* 顶部导航栏 */}
            <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
              <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600" />
                  <span className="text-xl font-semibold text-gray-900">
                    {i18n.t('common.brand', 'i18n App')}
                  </span>
                </div>
                
                <nav className="hidden md:flex items-center gap-6">
                  <a href="/" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                    {i18n.t('common.nav.home', '首页')}
                  </a>
                  <a href="/about" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                    {i18n.t('common.nav.about', '关于')}
                  </a>
                  <a href="/features" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                    {i18n.t('common.nav.features', '功能')}
                  </a>
                  <a href="/contact" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                    {i18n.t('common.nav.contact', '联系')}
                  </a>
                </nav>
                
                <div className="flex items-center gap-4">
                  <LanguageSwitcher />
                  <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                    {i18n.t('common.cta.get_started', '开始使用')}
                  </button>
                </div>
              </div>
            </header>
            
            {/* 主内容 */}
            <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
              {children}
            </main>
            
            {/* 页脚 */}
            <footer className="border-t bg-white">
              <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded bg-gradient-to-r from-blue-500 to-purple-600" />
                      <span className="text-lg font-semibold text-gray-900">
                        {i18n.t('common.brand', 'i18n App')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {i18n.t('common.footer.tagline', '构建全球化的Web应用')}
                    </p>
                  </div>
                  
                  {['product', 'company', 'resources', 'legal'].map((section) => (
                    <div key={section}>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {i18n.t(`common.footer.${section}.title`, 
                          section.charAt(0).toUpperCase() + section.slice(1)
                        )}
                      </h3>
                      <ul className="mt-4 space-y-3">
                        {[1, 2, 3, 4].map((item) => (
                          <li key={item}>
                            <a 
                              href="#" 
                              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                            >
                              {i18n.t(
                                `common.footer.${section}.item${item}`,
                                `Item ${item}`
                              )}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12 border-t pt-8">
                  <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-sm text-gray-600">
                      © {new Date().getFullYear()} {i18n.t('common.brand', 'i18n App')}. 
                      {' '}{i18n.t('common.footer.copyright', '保留所有权利。')}
                    </p>
                    <div className="flex items-center gap-6">
                      {['twitter', 'github', 'linkedin', 'youtube'].map((social) => (
                        <a 
                          key={social}
                          href="#"
                          className="text-gray-400 hover:text-gray-500"
                          aria-label={i18n.t(`common.social.${social}`, social)}
                        >
                          <span className="sr-only">
                            {i18n.t(`common.social.${social}`, social)}
                          </span>
                          {social.toUpperCase()}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </DirectionWrapper>
        </I18nextProvider>
      </body>
    </html>
  );
}
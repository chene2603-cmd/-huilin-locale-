/**
 * 首页示例
 * 展示多语言功能的使用
 */
'use client';

import { useTranslation, Trans } from 'react-i18next';
import { useState, useEffect } from 'react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { getCurrentLanguage } from '@/i18n/client';

export default function HomePage() {
  const { t, i18n } = useTranslation(['common', 'home']);
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());
  const [mounted, setMounted] = useState(false);
  
  // 只在客户端渲染
  useEffect(() => {
    setMounted(true);
    
    const handleLanguageChanged = () => {
      setCurrentLang(getCurrentLanguage());
    };
    
    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);
  
  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">{t('common.loading', '加载中...')}</p>
      </div>
    );
  }
  
  // 模拟动态数据
  const user = {
    name: t('home.user.name', '张三'),
    points: 1250,
    joinDate: '2024-01-15',
  };
  
  const stats = [
    { label: t('home.stats.users', '用户数'), value: '10K+' },
    { label: t('home.stats.countries', '国家数'), value: '50+' },
    { label: t('home.stats.languages', '支持语言'), value: '12+' },
    { label: t('home.stats.uptime', '运行时间'), value: '99.9%' },
  ];
  
  const features = [
    {
      title: t('home.features.real_time.title', '实时翻译'),
      description: t('home.features.real_time.description', '支持实时文本翻译，毫秒级响应'),
      icon: '⚡',
    },
    {
      title: t('home.features.easy_integration.title', '易于集成'),
      description: t('home.features.easy_integration.description', '简单的API接口，快速接入现有项目'),
      icon: '🔌',
    },
    {
      title: t('home.features.automatic_detection.title', '自动检测'),
      description: t('home.features.automatic_detection.description', '智能识别用户语言偏好'),
      icon: '🤖',
    },
    {
      title: t('home.features.rtl_support.title', 'RTL支持'),
      description: t('home.features.rtl_support.description', '完美支持从右到左语言布局'),
      icon: '🔀',
    },
  ];
  
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero 部分 */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-100 p-8 md:p-12 lg:p-16">
        <div className="relative z-10 max-w-3xl">
          <div className="mb-6 inline-flex items-center rounded-full bg-white/30 px-4 py-1.5 backdrop-blur-sm">
            <span className="text-sm font-medium text-blue-800">
              {t('home.hero.badge', '🚀 新功能上线')}
            </span>
          </div>
          
          <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
            {t('home.hero.title', '构建全球化的应用体验')}
          </h1>
          
          <p className="mb-8 text-lg text-gray-700 md:text-xl">
            {t('home.hero.subtitle', '一站式多语言解决方案，支持无缝语言切换和本地化体验')}
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
              {t('home.hero.cta.primary', '免费开始')}
            </button>
            <button className="rounded-lg border-2 border-blue-600 px-8 py-3 text-lg font-semibold text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
              {t('home.hero.cta.secondary', '查看演示')}
            </button>
          </div>
          
          <div className="mt-8 flex items-center gap-4 text-sm text-gray-600">
            <span>🌍</span>
            <p>
              <Trans i18nKey="home.hero.supported_languages" t={t}>
                支持 <strong>{{ count: 12 }}</strong> 种语言
              </Trans>
            </p>
          </div>
        </div>
        
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-200/20"></div>
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-200/20"></div>
      </section>
      
      {/* 语言展示区域 */}
      <section className="mt-16">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {t('home.languages.title', '多语言演示')}
          </h2>
          <p className="mt-2 text-gray-600">
            {t('home.languages.subtitle', '实时切换语言查看效果')}
          </p>
        </div>
        
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              {t('home.languages.current', '当前语言')}: 
              <span className="ml-2 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-blue-800">
                <span className="text-lg">{currentLang === 'zh-CN' ? '🇨🇳' : '🇺🇸'}</span>
                {currentLang === 'zh-CN' ? '简体中文' : 'English (US)'}
              </span>
            </h3>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {t('common.choose_language', '选择语言')}:
              </span>
              <LanguageSwitcher variant="dropdown" />
            </div>
          </div>
          
          {/* 翻译示例卡片 */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-6">
              <h4 className="font-medium text-gray-900">
                {t('home.examples.basic', '基础翻译示例')}
              </h4>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">
                    {t('home.examples.greeting', '问候语')}:
                  </p>
                  <p className="text-lg font-medium text-gray-900">
                    {t('home.greeting', '你好，世界！')}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">
                    {t('home.examples.welcome', '欢迎消息')}:
                  </p>
                  <p className="text-gray-700">
                    {t('home.welcome_message', '欢迎来到我们的多语言应用！')}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">
                    {t('home.examples.description', '应用描述')}:
                  </p>
                  <p className="text-gray-700">
                    {t('home.app_description', '这是一个展示国际化最佳实践的示例应用。')}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-6">
              <h4 className="font-medium text-gray-900">
                {t('home.examples.advanced', '高级功能示例')}
              </h4>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">
                    {t('home.examples.pluralization', '复数形式')}:
                  </p>
                  <div className="space-y-1">
                    <p className="text-gray-700">
                      {t('home.messages', { count: 0 }, '你有 {{count}} 条消息')}
                    </p>
                    <p className="text-gray-700">
                      {t('home.messages', { count: 1 }, '你有 {{count}} 条消息')}
                    </p>
                    <p className="text-gray-700">
                      {t('home.messages', { count: 5 }, '你有 {{count}} 条消息')}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">
                    {t('home.examples.interpolation', '插值')}:
                  </p>
                  <p className="text-gray-700">
                    {t('home.user_greeting', { name: user.name }, '欢迎回来，{{name}}！')}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">
                    {t('home.examples.formatting', '格式化')}:
                  </p>
                  <p className="text-gray-700">
                    {t('home.points', { points: user.points }, '你有 {{points, number}} 积分')}
                  </p>
                  <p className="text-gray-700">
                    {t('home.join_date', { date: new Date(user.joinDate) }, '加入日期：{{date, date}}')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 带参数的复杂翻译 */}
          <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-6">
            <h4 className="mb-3 font-medium text-blue-900">
              {t('home.examples.complex', '复杂翻译示例')}
            </h4>
            <p className="text-blue-800">
              <Trans i18nKey="home.complex_example" t={t} values={{ 
                product: t('home.product_name', '多语言平台'),
                count: 3,
                date: new Date(),
                price: 99.99 
              }}>
                您已订阅 <strong>{{ product }}</strong>，包含 
                <strong>{{ count }}</strong> 个用户席位。下次付款日期为 
                <strong>{{ date, date }}</strong>，金额为 
                <strong>{{ price, currency: 'USD' }}</strong>。
              </Trans>
            </p>
          </div>
        </div>
      </section>
      
      {/* 特性展示 */}
      <section className="mt-16">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {t('home.features.title', '核心特性')}
          </h2>
          <p className="mt-2 text-gray-600">
            {t('home.features.subtitle', '为全球化应用设计的功能')}
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-4 text-3xl">{feature.icon}</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* 统计数据 */}
      <section className="mt-16 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-white">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold lg:text-5xl">{stat.value}</div>
              <div className="mt-2 text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
      
      {/* 使用说明 */}
      <section className="mt-16">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            {t('home.usage.title', '使用方法')}
          </h3>
          <div className="prose max-w-none text-gray-700">
            <p>{t('home.usage.description', '在你的组件中使用多语言功能：')}</p>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
              {`// 1. 基本使用
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation('common');
  return <h1>{t('welcome')}</h1>;
}

// 2. 带命名空间
const { t } = useTranslation(['common', 'home']);

// 3. 复数形式
t('messages', { count: 5 });

// 4. 插值
t('greeting', { name: '张三' });

// 5. 格式化
t('price', { price: 99.99 });
t('date', { date: new Date() });

// 6. 组件翻译
<Trans i18nKey="description">
  这是一个<strong>复杂</strong>的翻译示例
</Trans>`}
            </pre>
          </div>
        </div>
      </section>
      
      {/* 语言信息 */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          {t('home.current_locale', '当前区域设置')}: <code className="rounded bg-gray-100 px-2 py-1">{i18n.language}</code>
        </p>
        <p className="mt-1">
          {t('home.loaded_namespaces', '已加载命名空间')}:{' '}
          <code className="rounded bg-gray-100 px-2 py-1">
            {Object.keys(i18n.services.resourceStore.data[i18n.language] || {}).join(', ')}
          </code>
        </p>
      </div>
    </div>
  );
}
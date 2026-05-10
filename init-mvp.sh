#!/bin/bash
# init-mvp.sh - 一键生成多语言 MVP 项目
PROJECT_ROOT="huilin-locale-mvp"
rm -rf $PROJECT_ROOT && mkdir $PROJECT_ROOT && cd $PROJECT_ROOT

# 1. 初始化 package.json
cat > package.json << 'EOF'
{
  "name": "huilin-locale-mvp",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-i18next": "^13.0.0",
    "i18next": "^23.0.0",
    "i18next-browser-languagedetector": "^7.0.0",
    "i18next-http-backend": "^2.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
EOF

# 2. tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
EOF

# 3. next.config.js
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en-US', 'zh-CN', 'ja-JP'],
    defaultLocale: 'en-US',
    localeDetection: false
  }
};
module.exports = nextConfig;
EOF

# 4. tailwind.config.ts + postcss.config.js
cat > tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {}
  },
  plugins: []
};
export default config;
EOF

cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
EOF

# 5. 创建目录结构
mkdir -p public/locales/en-US public/locales/zh-CN public/locales/ja-JP
mkdir -p src/app src/components src/i18n

# 6. 翻译资源 JSON
# en-US/home.json
cat > public/locales/en-US/home.json << 'EOF'
{
  "greeting": "Welcome to Huilin Locale MVP",
  "messages": "You have {{count}} new messages",
  "user_greeting": "Hello, {{name}}!",
  "intro": "This demo shows <1>dynamic language switching</1> and RTL support."
}
EOF
# en-US/common.json
cat > public/locales/en-US/common.json << 'EOF'
{
  "nav_home": "Home",
  "switch_lang": "Switch Language",
  "dir_hint": "Text direction: Left to Right"
}
EOF

# zh-CN/home.json
cat > public/locales/zh-CN/home.json << 'EOF'
{
  "greeting": "欢迎来到 Huilin 本地化 MVP",
  "messages": "您有 {{count}} 条新消息",
  "user_greeting": "你好，{{name}}！",
  "intro": "此演示展示 <1>动态语言切换</1> 和 RTL 支持。"
}
EOF
# zh-CN/common.json
cat > public/locales/zh-CN/common.json << 'EOF'
{
  "nav_home": "首页",
  "switch_lang": "切换语言",
  "dir_hint": "文本方向：从左到右"
}
EOF

# ja-JP/home.json
cat > public/locales/ja-JP/home.json << 'EOF'
{
  "greeting": "Huilin ロケール MVP へようこそ",
  "messages": "{{count}} 件の新しいメッセージがあります",
  "user_greeting": "こんにちは、{{name}}さん！",
  "intro": "このデモでは<1>動的言語切り替え</1>とRTL対応を紹介します。"
}
EOF
# ja-JP/common.json
cat > public/locales/ja-JP/common.json << 'EOF'
{
  "nav_home": "ホーム",
  "switch_lang": "言語を切り替える",
  "dir_hint": "テキスト方向：左から右"
}
EOF

# 7. i18n 核心文件
# src/i18n/config.ts
cat > src/i18n/config.ts << 'EOF'
export const fallbackLng = 'en-US';
export const locales = ['en-US', 'zh-CN', 'ja-JP'];
export const defaultNS = 'home';
export const RTL_LANGUAGES: string[] = ['ar']; // 预留 RTL

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    supportedLngs: locales,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
    interpolation: { escapeValue: false },
    backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['cookie', 'localStorage']
    }
  };
}
EOF

# src/i18n/client.ts – 完全客户端实现，满足 MVP
cat > src/i18n/client.ts << 'EOF'
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { getOptions } from './config';

let isInitialized = false;

export async function initI18n(locale?: string) {
  if (!isInitialized) {
    await i18next
      .use(HttpBackend)
      .use(LanguageDetector)
      .use(initReactI18next)
      .init(getOptions(locale));
    isInitialized = true;
  }
  return i18next;
}

export async function changeLanguage(lng: string) {
  await i18next.changeLanguage(lng);
  if (typeof window !== 'undefined') {
    document.documentElement.lang = lng;
    // 简单 RTL 检测（目前预留）
    const RTL_LANGUAGES = ['ar'];
    document.documentElement.dir = RTL_LANGUAGES.includes(lng) ? 'rtl' : 'ltr';
  }
}
EOF

# 8. 组件
# src/components/LanguageSwitcher.tsx
cat > src/components/LanguageSwitcher.tsx << 'EOF'
'use client';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '@/i18n/client';
import { locales } from '@/i18n/config';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation('common');
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">{t('switch_lang')}:</span>
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="border rounded px-2 py-1 text-sm"
      >
        {locales.map((lng) => (
          <option key={lng} value={lng}>
            {lng}
          </option>
        ))}
      </select>
    </div>
  );
}
EOF

# src/components/DirectionWrapper.tsx
cat > src/components/DirectionWrapper.tsx << 'EOF'
'use client';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RTL_LANGUAGES } from '@/i18n/config';

export default function DirectionWrapper({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  useEffect(() => {
    const isRTL = RTL_LANGUAGES.includes(i18n.language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [i18n.language]);
  return <>{children}</>;
}
EOF

# 9. 页面与布局
# src/app/layout.tsx
cat > src/app/layout.tsx << 'EOF'
import type { Metadata } from 'next';
import './globals.css';
import ClientI18nProvider from './ClientI18nProvider';

export const metadata: Metadata = {
  title: 'Huilin Locale MVP',
  description: 'Minimal i18n example with Next.js 14'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-US">
      <body className="min-h-screen bg-gray-50">
        <ClientI18nProvider>
          {children}
        </ClientI18nProvider>
      </body>
    </html>
  );
}
EOF

# src/app/ClientI18nProvider.tsx (必须的客户端包装)
cat > src/app/ClientI18nProvider.tsx << 'EOF'
'use client';
import { useEffect, useState } from 'react';
import { initI18n } from '@/i18n/client';
import { I18nextProvider } from 'react-i18next';
import type { i18n } from 'i18next';

export default function ClientI18nProvider({ children }: { children: React.ReactNode }) {
  const [i18nInstance, setI18nInstance] = useState<i18n | null>(null);

  useEffect(() => {
    initI18n().then((instance) => {
      setI18nInstance(instance);
      document.documentElement.lang = instance.language;
    });
  }, []);

  if (!i18nInstance) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
}
EOF

# src/app/page.tsx
cat > src/app/page.tsx << 'EOF'
'use client';
import { useTranslation, Trans } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import DirectionWrapper from '@/components/DirectionWrapper';

export default function Home() {
  const { t } = useTranslation('home');
  const { t: tCommon } = useTranslation('common');

  return (
    <DirectionWrapper>
      <main className="max-w-2xl mx-auto p-8">
        <nav className="flex justify-between items-center mb-8 p-4 bg-white shadow rounded">
          <h1 className="text-xl font-bold">{tCommon('nav_home')}</h1>
          <LanguageSwitcher />
        </nav>

        <div className="bg-white p-6 rounded shadow space-y-4">
          <h2 className="text-2xl font-semibold">{t('greeting')}</h2>
          
          <p className="text-gray-700">
            <Trans t={t} i18nKey="intro" components={{ 1: <strong className="text-blue-600" /> }} />
          </p>

          <p className="text-gray-600">{t('messages', { count: 5 })}</p>
          
          <p className="text-gray-600">{t('user_greeting', { name: '张三' })}</p>

          <div className="pt-4 border-t text-xs text-gray-400">
            {tCommon('dir_hint')}
          </div>
        </div>
      </main>
    </DirectionWrapper>
  );
}
EOF

# src/app/globals.css
cat > src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

# 10. .env 和 .gitignore
cat > .gitignore << 'EOF'
node_modules/
.next/
out/
EOF

echo "✅ MVP 项目创建完成！运行以下命令启动："
echo "  cd $PROJECT_ROOT && npm install && npm run dev"
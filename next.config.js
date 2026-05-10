/** @type {import('next').NextConfig} */
const nextConfig = {
  // 多语言配置
  i18n: {
    locales: ['zh-CN', 'en-US'],
    defaultLocale: 'zh-CN',
    localeDetection: true,
  },
  
  // 图片优化
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // 头部配置
  headers: async () => {
    return [
      {
        source: '/locales/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  
  // 重定向配置
  async redirects() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'header',
            key: 'accept-language',
            value: '(.*)',
          },
        ],
        destination: '/:locale',
        permanent: false,
      },
    ];
  },
  
  // 环境变量
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID || '',
  },
  
  // 编译优化
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // 性能优化
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // 安全头
  poweredByHeader: false,
};

module.exports = nextConfig;
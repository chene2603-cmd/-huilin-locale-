# 🌐 My i18n MVP

一个基于 **Next.js 14 + React + TypeScript** 的多语言国际化（i18n）最小可行产品，支持：
- 翻译资源管理（JSON 命名空间）
- 运行时语言检测与切换
- 插值、复数、日期/货币格式化
- SSR 友好的服务端渲染
- 动态字体加载（中文 / 拉丁字符）

## 🛠️ 技术栈

- [Next.js](https://nextjs.org/) (App Router)
- [react-i18next](https://react.i18next.com/) / i18next
- TypeScript
- Tailwind CSS
- Jest + Playwright

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 浏览器打开
open http://localhost:3000📁 目录结构

```
├── public/locales/          # 翻译资源（JSON）
│   ├── en-US/
│   └── zh-CN/
├── src/
│   ├── app/                 # Next.js 页面
│   │   ├── layout.tsx       # 根布局（i18n Provider）
│   │   └── page.tsx         # 首页（翻译示例）
│   ├── components/          # 通用组件
│   │   ├── DirectionWrapper.tsx
│   │   └── LanguageSwitcher.tsx
│   └── i18n/
│       ├── client.ts        # 客户端 i18n 初始化
│       └── config.ts        # 多语言配置
├── next.config.js
├── tailwind.config.ts
└── package.json
```

🌍 支持的语言

代码 语言
zh-CN 简体中文
en-US 英语（美国）

➕ 添加新语言

1. 在 public/locales/ 下新建语言目录（如 ja-JP）
2. 复制已有的 JSON 文件并翻译
3. 在 src/i18n/config.ts 的 locales 数组中添加 'ja-JP'

📄 许可

MIT
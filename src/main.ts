import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import { getI18n } from './i18n';
import App from './App.vue';
import Home from './views/Home.vue';
import About from './views/About.vue';
import './styles/main.css';

// 创建Vue应用
const app = createApp(App);

// 配置路由
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { 
      path: '/:locale', 
      component: Home,
      beforeEnter: (to) => {
        const { locale } = to.params;
        const i18n = getI18n();
        
        // 如果参数是支持的语言，切换语言
        if (typeof locale === 'string' && ['zh-CN', 'en-US'].includes(locale)) {
          i18n.global.locale.value = locale as any;
        }
      }
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// 配置i18n
const i18n = getI18n();

// 配置Pinia
const pinia = createPinia();

// 使用插件
app.use(router);
app.use(i18n);
app.use(pinia);

// 挂载应用
app.mount('#app');
<template>
  <div class="relative" ref="dropdownRef">
    <!-- 当前语言按钮 -->
    <button
      @click="toggleDropdown"
      class="flex items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors min-w-[120px]"
      :aria-label="$t('common.select_language')"
      :aria-expanded="isOpen"
    >
      <span class="flex items-center gap-2">
        <span class="text-base">{{ currentLanguage.flag }}</span>
        <span>{{ currentLanguage.nativeName }}</span>
      </span>
      <svg
        class="h-5 w-5 text-gray-400 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- 下拉菜单 -->
    <div
      v-if="isOpen"
      class="absolute right-0 z-10 mt-2 w-full min-w-[180px] origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in"
      role="menu"
    >
      <template v-for="locale in SUPPORTED_LOCALES" :key="locale">
        <button
          @click="switchLanguage(locale)"
          class="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
          :class="{
            'bg-blue-50 text-blue-600': locale === currentLocale,
            'text-gray-700': locale !== currentLocale,
          }"
          role="menuitem"
        >
          <span class="text-lg">{{ LANGUAGES[locale].flag }}</span>
          <div class="flex flex-col items-start flex-1">
            <span class="font-medium">{{ LANGUAGES[locale].nativeName }}</span>
            <span class="text-xs text-gray-500">{{ LANGUAGES[locale].name }}</span>
          </div>
          <svg
            v-if="locale === currentLocale"
            class="h-5 w-5 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { 
  SUPPORTED_LOCALES, 
  LANGUAGES, 
  type SupportedLocale,
  changeLanguage 
} from '@/i18n';

const { locale } = useI18n();
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

// 计算属性
const currentLocale = computed(() => locale.value as SupportedLocale);
const currentLanguage = computed(() => LANGUAGES[currentLocale.value]);

// 切换下拉菜单
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// 切换语言
const switchLanguage = async (newLocale: SupportedLocale) => {
  if (newLocale === currentLocale.value) {
    isOpen.value = false;
    return;
  }
  
  try {
    await changeLanguage(newLocale);
    isOpen.value = false;
    
    // 触发自定义事件
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: newLocale 
    }));
  } catch (error) {
    console.error('Failed to switch language:', error);
  }
};

// 点击外部关闭
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<style scoped>
.animate-in {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
<script lang="ts">
  import { locale, LANGUAGES, SUPPORTED_LOCALES, loadTranslations } from '$i18n';
  import { t } from '$lib/stores/i18n';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
  
  // 初始加载翻译
  if (browser) {
    $locale = $page.params.locale || $locale;
    loadTranslations($locale);
  }
</script>

<svelte:head>
  <title>{$t('metadata.title')}</title>
  <meta name="description" content={$t('metadata.description')} />
  <link rel="alternate" hrefLang="x-default" href="/" />
  {#each SUPPORTED_LOCALES as loc}
    <link
      rel="alternate"
      hrefLang={LOCALE_MAPPING[loc] || loc}
      href={`/${loc === DEFAULT_LOCALE ? '' : loc}`}
    />
  {/each}
</svelte:head>

<div dir={LANGUAGES[$locale].direction} lang={$locale} class="min-h-screen">
  <!-- 导航栏 -->
  <header class="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
    <nav class="container mx-auto flex h-16 items-center justify-between px-4">
      <div class="flex items-center gap-3">
        <div class="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600" />
        <span class="text-xl font-semibold text-gray-900">
          {$t('common.brand')}
        </span>
      </div>
      
      <div class="flex items-center gap-6">
        <LanguageSwitcher />
        <button class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">
          {$t('common.cta.get_started')}
        </button>
      </div>
    </nav>
  </header>
  
  <!-- 主内容 -->
  <main>
    <slot />
  </main>
  
  <!-- 页脚 -->
  <footer class="border-t bg-gray-50">
    <div class="container mx-auto px-4 py-12">
      <div class="flex items-center justify-between">
        <div>
          <span class="font-semibold text-gray-900">{$t('common.brand')}</span>
          <p class="mt-2 text-sm text-gray-600">
            {$t('common.footer.tagline')}
          </p>
        </div>
        <div class="text-sm text-gray-600">
          © {new Date().getFullYear()} {$t('common.footer.copyright')}
        </div>
      </div>
    </div>
  </footer>
</div>
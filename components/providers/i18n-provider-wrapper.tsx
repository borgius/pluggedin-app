// Remove headers import as it forces dynamic rendering
// import { headers } from 'next/headers';

// Remove unused Locale and locales imports
import { defaultLocale } from '@/i18n/config';

import { I18nProvider } from './i18n-provider';

async function getInitialLocale(): Promise<string> {
  // For static generation, always start with the default locale during server render.
  // Client-side components (I18nProvider and i18next-browser-languagedetector)
  // will then adjust based on localStorage or fetched profile after hydration.
  // This prevents dynamic function calls like getAuthSession() during build time for static pages.
  return defaultLocale;
}

export async function I18nProviderWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  const initialLocale = await getInitialLocale();
  
  return (
    <I18nProvider initialLocale={initialLocale}>
      {children}
    </I18nProvider>
  );
}

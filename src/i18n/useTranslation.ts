import { useState, useCallback } from 'react';
import { translations, Language, Translations } from './translations';

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    if (typeof value !== 'string') {
      return key;
    }

    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return String(params[paramKey] || match);
      });
    }

    return value;
  }, [language]);

  return {
    language,
    setLanguage,
    t
  };
};

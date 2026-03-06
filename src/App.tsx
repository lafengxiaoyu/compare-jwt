import React, { useState } from 'react';
import JWTCompare from './components/JWTCompare';
import MultiEnvCompare from './components/MultiEnvCompare';
import UserGuide from './components/UserGuide';
import { useTranslation, Language } from './i18n';

type TabType = 'jwt' | 'multi-env' | 'guide';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('jwt');
  const { language, setLanguage, t } = useTranslation();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' }
  ];

  return (
    <div className="container">
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>{t('app.title')}</h1>
          <p style={{ color: '#8b949e', fontSize: '14px' }}>
            {t('app.description')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '5px' }}>
          {languages.map(lang => (
            <button
              key={lang.code}
              className={`tab ${language === lang.code ? 'active' : ''}`}
              onClick={() => setLanguage(lang.code)}
              style={{ padding: '8px 16px', fontSize: '14px' }}
            >
              {lang.flag} {lang.name}
            </button>
          ))}
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'jwt' ? 'active' : ''}`}
          onClick={() => setActiveTab('jwt')}
        >
          {t('tabs.jwt')}
        </button>
        <button
          className={`tab ${activeTab === 'multi-env' ? 'active' : ''}`}
          onClick={() => setActiveTab('multi-env')}
        >
          {t('tabs.multiEnv')}
        </button>
        <button
          className={`tab ${activeTab === 'guide' ? 'active' : ''}`}
          onClick={() => setActiveTab('guide')}
        >
          📚 {t('tabs.guide')}
        </button>
      </div>

      {activeTab === 'jwt'
        ? <JWTCompare t={t} />
        : activeTab === 'multi-env'
        ? <MultiEnvCompare />
        : <UserGuide />
      }
    </div>
  );
};

export default App;

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const DebugI18n = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkInitialization = () => {
      console.log('i18n instance:', i18n);
      console.log('Current language:', i18n.language);
      console.log('Is initialized:', i18n.isInitialized);
      console.log('Available languages:', i18n.languages);
      
      if (i18n.isInitialized) {
        setLoading(false);
      } else {
        // Check again after a short delay
        setTimeout(checkInitialization, 100);
      }
    };

    checkInitialization();
  }, [i18n]);

  if (loading) {
    return (
      <div style={{ position: 'fixed', bottom: 10, left: 10, background: 'orange', color: 'white', padding: 10, zIndex: 9999 }}>
        i18n Loading...
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', bottom: 10, left: 10, background: 'green', color: 'white', padding: 10, zIndex: 9999 }}>
      <div>i18n Initialized: {i18n.isInitialized ? 'YES' : 'NO'}</div>
      <div>Current Language: {i18n.language || 'NOT SET'}</div>
      <div>Title: "{t('header.title')}"</div>
      <div style={{ marginTop: '10px' }}>
        <button onClick={() => i18n.changeLanguage('en')} style={{ margin: '2px' }}>English</button>
        <button onClick={() => i18n.changeLanguage('hi')} style={{ margin: '2px' }}>Hindi</button>
        <button onClick={() => i18n.changeLanguage('mr')} style={{ margin: '2px' }}>Marathi</button>
      </div>
    </div>
  );
};

export default DebugI18n;
import { StrictMode } from 'react';
import '@/app/i18n';
import { createRoot } from 'react-dom/client';
import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/600.css';
import '@fontsource/vazirmatn/700.css';
import App from '@/app/App';
import { LocalizationProvider } from '@/shared/i18n/provider';
import '@/styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocalizationProvider>
      <App />
    </LocalizationProvider>
  </StrictMode>,
);

import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { LanguageProvider } from './i18n/LanguageProvider';
import 'virtual:site-fonts';
import './index.css';

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const root = document.getElementById('root')!;

const app = (
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);

// The build stamps each page with the path it was rendered for; any other URL (404, a search) starts from scratch
const isPrerendered = root.dataset.page === window.location.pathname && !window.location.search;

if (isPrerendered) hydrateRoot(root, app);
else createRoot(root).render(app);

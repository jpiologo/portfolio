import { PassThrough } from 'node:stream';
import { text } from 'node:stream/consumers';
import { StrictMode } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { LanguageProvider } from './i18n/LanguageProvider';

// Build-time entry: vite-plugin-seo.ts turns every page into static HTML with it
export { getPages, NOT_FOUND_PAGE } from './lib/seo';

/** HTML of a page, with lazy routes already loaded. Same tree as main.tsx, so the browser can hydrate it. */
export const render = (path: string) =>
  new Promise<string>((resolve, reject) => {
    const { pipe } = renderToPipeableStream(
      <StrictMode>
        <StaticRouter location={path}>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </StaticRouter>
      </StrictMode>,
      {
        onAllReady() {
          const stream = new PassThrough();
          text(stream).then(resolve, reject);
          pipe(stream);
        },
        onError: reject,
      }
    );
  });

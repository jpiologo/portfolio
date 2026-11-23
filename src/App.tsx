import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import SocialSidebar from './components/SocialSidebar';
import { useI18n } from './i18n/context';
import { LANGUAGE_SEGMENT, stripLanguage } from './i18n/routes';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ProjectPage from './pages/ProjectPage';

// Post texts, Markdown and syntax highlighting only load on the blog pages
const BlogIndex = lazy(() => import('./pages/BlogIndex'));
const BlogPost = lazy(() => import('./pages/BlogPost'));

const MAIN_ID = 'main-content';

// Scrolls to `#section` anchors across routes, otherwise back to the top (smoothly or not: see html in index.css)
const ScrollManager = () => {
  const location = useLocation();
  const previous = useRef(location);

  useEffect(() => {
    const { pathname, search, hash, key } = location;
    const from = previous.current;
    previous.current = location;

    const isFirstPage = from.key === key;
    const isNewPage = stripLanguage(from.pathname) !== stripLanguage(pathname);
    const isLanguageChange = !isNewPage && from.pathname !== pathname;
    // Filtering a page through its query string (blog search) must not move it
    const isQueryChange = !isNewPage && from.search !== search;
    if (isLanguageChange || isQueryChange) return;

    if (hash) {
      const frame = requestAnimationFrame(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView();
      });
      return () => cancelAnimationFrame(frame);
    }

    // The first page is left where the browser restored it.
    // On a new page, a smooth scroll would race with the lazy page loading in and could end at its bottom
    if (!isFirstPage) window.scrollTo({ top: 0, behavior: isNewPage ? 'instant' : 'auto' });
  }, [location]);

  return null;
};

function App() {
  const t = useI18n();
  const [isFooterInView, setIsFooterInView] = useState(false);

  return (
    <div className="min-h-screen">
      <a href={`#${MAIN_ID}`} className="skip-link">
        {t.common.skipToContent}
      </a>
      <ScrollManager />
      <Header />
      <SocialSidebar isHidden={isFooterInView} />
      <main id={MAIN_ID} tabIndex={-1} className="focus:outline-none">
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
            <Route path={LANGUAGE_SEGMENT} element={<Home />} />
            <Route path={`${LANGUAGE_SEGMENT}/blog`} element={<BlogIndex />} />
            <Route path={`${LANGUAGE_SEGMENT}/blog/:slug`} element={<BlogPost />} />
            <Route path={`${LANGUAGE_SEGMENT}/projects/:slug`} element={<ProjectPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer onInViewChange={setIsFooterInView} />
    </div>
  );
}

export default App;

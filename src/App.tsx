import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import BlogIndex from './pages/BlogIndex';

// Markdown + syntax highlighting only load when a post is opened
const BlogPost = lazy(() => import('./pages/BlogPost'));

// Scrolls to `#section` anchors across routes, otherwise back to the top
const ScrollManager = () => {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const frame = requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, key]);

  return null;
};

function App() {
  return (
    <div className="min-h-screen bg-background-base">
      <ScrollManager />
      <Header />
      <Suspense fallback={<div className="min-h-screen" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>

      <footer className="bg-background-surface text-text-muted py-8 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} João Piologo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

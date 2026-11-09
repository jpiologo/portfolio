import { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import SocialSidebar from './components/SocialSidebar';
import TriangleMesh from './components/TriangleMesh';
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
  const [isFooterInView, setIsFooterInView] = useState(false);

  return (
    <div className="min-h-screen">
      <TriangleMesh />
      <ScrollManager />
      <Header />
      <SocialSidebar isHidden={isFooterInView} />
      <Suspense fallback={<div className="min-h-screen" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>

      <Footer onInViewChange={setIsFooterInView} />
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ServicesView from './components/ServicesView';
import ProjectsView from './components/ProjectsView';
import MagazineView from './components/MagazineView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import BookView from './components/BookView';
import ServiceDetailView from './components/ServiceDetailView';
import AdminView from './components/AdminView';
import { ActivePage } from './types';
import { majorServicesDetails, serviceCategories } from './data';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const pagePaths: Partial<Record<ActivePage, string>> = {
  home: '/',
  services: '/services',
  projects: '/projects',
  magazine: '/magazine',
  about: '/about',
  contact: '/contact',
  book: '/book',
  admin: '/admin',
};

const serviceSlugs = new Set([
  ...serviceCategories.flatMap((category) => category.services.map((service) => service.id)),
  ...Object.keys(majorServicesDetails),
]);

const normalizePath = (path: string) => {
  const cleanPath = path.replace(/\/+$/, '');
  return cleanPath || '/';
};

const getRouteState = (path: string, hash: string): { page: ActivePage; slug?: string } => {
  if (hash === '#admin') {
    return { page: 'admin' };
  }

  const cleanPath = normalizePath(path);
  const serviceMatch = cleanPath.match(/^\/services\/([^/]+)$/);

  if (serviceMatch) {
    const slug = decodeURIComponent(serviceMatch[1]);
    if (serviceSlugs.has(slug)) {
      return { page: 'service-detail', slug };
    }
    return { page: 'services' };
  }

  const matchedPage = (Object.entries(pagePaths) as [ActivePage, string][])
    .find(([, pagePath]) => pagePath === cleanPath)?.[0];

  return { page: matchedPage || 'home' };
};

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [serviceSlug, setServiceSlug] = useState<string>('');
  const [bookingModal, setBookingModal] = useState<{ isOpen: boolean; serviceName?: string }>({
    isOpen: false,
    serviceName: undefined,
  });

  // Support direct navigation to canonical public routes and /admin.
  useEffect(() => {
    const handleUrlRoute = () => {
      const route = getRouteState(window.location.pathname, window.location.hash);
      setActivePage(route.page);
      setServiceSlug(route.slug || '');
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    window.addEventListener('hashchange', handleUrlRoute);

    return () => {
      window.removeEventListener('popstate', handleUrlRoute);
      window.removeEventListener('hashchange', handleUrlRoute);
    };
  }, []);

  // Smooth scroll to top on page variations
  const handlePageChange = (page: ActivePage, slug?: string) => {
    const nextPage: ActivePage = page === 'services' && slug ? 'service-detail' : page;
    const nextPath = nextPage === 'service-detail' && slug
      ? `/services/${encodeURIComponent(slug)}`
      : pagePaths[nextPage] || '/';

    setBookingModal({ isOpen: false, serviceName: undefined });
    setActivePage(nextPage);
    setServiceSlug(nextPage === 'service-detail' && slug ? slug : '');

    if (window.location.pathname !== nextPath || window.location.hash) {
      window.history.pushState(null, '', nextPath);
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleOpenBookingModal = (serviceName?: string) => {
    setBookingModal({ isOpen: true, serviceName });
  };

  const renderActiveView = () => {
    switch (activePage) {
      case 'home':
        return <HomeView onPageChange={handlePageChange} onOpenBookingModal={handleOpenBookingModal} />;
      case 'services':
        return <ServicesView onPageChange={handlePageChange} initialServiceId={serviceSlug} onOpenBookingModal={handleOpenBookingModal} />;
      case 'projects':
        return <ProjectsView onPageChange={handlePageChange} />;
      case 'magazine':
        return <MagazineView onPageChange={handlePageChange} onOpenBookingModal={handleOpenBookingModal} />;
      case 'about':
        return <AboutView onPageChange={handlePageChange} onOpenBookingModal={handleOpenBookingModal} />;
      case 'contact':
        return <ContactView />;
      case 'book':
        return <BookView initialServiceName={bookingModal.serviceName} onClose={() => setBookingModal({ isOpen: false })} isModal={false} />;
      case 'admin':
        return <AdminView />;
      case 'service-detail':
        return <ServiceDetailView slug={serviceSlug} onPageChange={handlePageChange} />;
      default:
        return <HomeView onPageChange={handlePageChange} onOpenBookingModal={handleOpenBookingModal} />;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between relative overflow-x-hidden w-full max-w-full" id="app-wrapper">
      {/* Dynamic Navigation Header */}
      <Header activePage={activePage} onPageChange={handlePageChange} onOpenBookingModal={handleOpenBookingModal} />

      {/* Main View Area */}
      <main className="flex-grow pt-[72px] sm:pt-[96px] w-full max-w-7xl mx-auto" id="main-content-flow">
        {renderActiveView()}
      </main>

      {/* Global Structured Footer */}
      <Footer onPageChange={handlePageChange} />

      {/* Global Booking Dialog Modal overlay with background blurred out a little bit */}
      <AnimatePresence>
        {bookingModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[5px] overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-[#0c0c0c] border border-neutral-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl relative pointer-events-auto"
            >
              {/* Elegant floating Close button */}
              <button
                onClick={() => setBookingModal({ isOpen: false })}
                className="absolute top-5 right-5 z-50 p-2 bg-neutral-900 border border-neutral-800 hover:border-brand/40 hover:bg-neutral-900 duration-200 rounded-full text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer"
                aria-label="Close booking dialog"
              >
                <X size={15} className="stroke-[2.5]" />
              </button>

              <div className="p-1">
                <BookView 
                  initialServiceName={bookingModal.serviceName} 
                  onClose={() => setBookingModal({ isOpen: false })} 
                  isModal={true} 
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

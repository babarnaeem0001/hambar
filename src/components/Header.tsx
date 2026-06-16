import React, { useState, useEffect } from 'react';
import { ActivePage } from '../types';
import { Menu, X, ChevronDown, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { serviceCategories } from '../data';
import { adminStore } from '../lib/admin-store';
import SlideInButton from './ui/SlideInButton';

interface HeaderProps {
  activePage: ActivePage;
  onPageChange: (page: ActivePage, serviceSlug?: string) => void;
  onOpenBookingModal?: (serviceName?: string) => void;
}

export default function Header({ activePage, onPageChange, onOpenBookingModal }: HeaderProps) {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    const loadContent = async () => {
      const list = await adminStore.getArticles();
      setArticles(list);
    };
    loadContent();
    const handleUpdate = () => { loadContent(); };
    window.addEventListener('admin_articles_updated', handleUpdate);
    return () => {
      window.removeEventListener('admin_articles_updated', handleUpdate);
    };
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'projects', label: 'Projects' },
    { id: 'magazine', label: 'Magazine' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    onPageChange(id as ActivePage);
    setIsOpen(false);
    setIsServicesOpen(false);
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full px-2 sm:px-4 pt-2 sm:pt-4 pb-1 sm:pb-2 pointer-events-none" id="hb-header">
      <div className="w-full pointer-events-auto bg-[#090909]/95 backdrop-blur-xl border border-neutral-800/80 rounded-full h-14 md:h-16 flex items-center justify-between px-3 md:px-5 shadow-none">
        
        {/* Left: Brand Logo & Icon (matching image) */}
        <div 
          className="flex items-center cursor-pointer group shrink-0 ml-2 md:ml-4 py-2" 
          onClick={() => onPageChange('home')}
          id="logo-container"
        >
          <div className="shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
            <img src="/logo.png" alt="Hambar" className="h-8 md:h-10 w-auto object-contain" />
          </div>
        </div>

        {/* Center: Desktop Navigation List */}
        <nav className="hidden lg:flex items-center gap-1.5" id="desktop-nav">
          {navItems.map((item) => (
            item.id === 'services' ? (
              <div 
                key={item.id}
                className="relative"
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
              >
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-2 text-xs md:text-sm font-medium transition-all rounded-full flex items-center gap-1 ${
                    activePage === item.id || isServicesOpen
                      ? 'text-white bg-neutral-900 font-semibold' 
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
                  }`}
                >
                  {item.label}
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isServicesOpen ? 'rotate-180 text-white' : 'text-neutral-500'}`} />
                </button>

                {/* Mega Dropdown Menu - Custom-styled to support all 10 categories neatly without descriptions */}
                {isServicesOpen && (
                  <div className="absolute top-[120%] left-1/2 -translate-x-[52%] w-[1180px] max-w-[calc(100vw-32px)] bg-[#0c0c0c]/98 border border-neutral-800 rounded-3xl shadow-2xl p-6 z-50 backdrop-blur-xl animate-fade-in pointer-events-auto flex flex-col md:flex-row gap-6 max-h-[92vh] overflow-y-auto custom-scrollbar">
                    
                    {/* Columns grid area for all 10 service categories in a beautiful dense layout */}
                    <div className="flex-grow flex flex-col justify-between gap-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-5">
                        {serviceCategories.map((category) => (
                          <div key={category.id} className="space-y-2.5">
                            {/* Category Heading without description */}
                            <div className="text-[9px] font-sans font-extrabold tracking-widest uppercase text-brand border-b border-neutral-800/80 pb-1.5">
                              {category.name}
                            </div>
                            {/* List of services in small text with seamless hover */}
                            <div className="flex flex-col gap-0.5">
                              {category.services.map((s) => (
                                <div
                                  key={s.id}
                                  onClick={() => {
                                    if (onOpenBookingModal) {
                                      onOpenBookingModal(s.name);
                                    } else {
                                      onPageChange('services', s.id);
                                    }
                                    setIsServicesOpen(false);
                                  }}
                                  className="group/sitem flex items-center justify-between py-1 px-1.5 rounded-md hover:bg-neutral-900 transition-all duration-205 cursor-pointer text-left"
                                >
                                  <span className="text-neutral-300 text-[10.5px] font-bold leading-tight group-hover/sitem:text-brand transition-colors font-sans truncate pr-1">
                                    {s.name}
                                  </span>
                                  
                                  <span className="opacity-0 group-hover/sitem:opacity-100 transition-all duration-205 text-[8.5px] font-sans font-extrabold tracking-wider text-brand shrink-0">
                                    Start Project &rarr;
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Footer bar at bottom of categories area */}
                      <div className="pt-3 border-t border-neutral-900 flex items-center justify-between text-left shrink-0">
                        <span className="text-[10px] font-sans text-neutral-500 font-medium">
                          All systems engineered by Babar Naeem & Hamid Saleem.
                        </span>
                        <button
                          onClick={() => {
                            onPageChange('services');
                            setIsServicesOpen(false);
                          }}
                          className="text-[11px] font-sans font-bold text-brand hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          View All 50+ Services &rarr;
                        </button>
                      </div>
                    </div>

                    {/* Right-hand Sidebar: LATEST STRATEGIC BRIEF PANE (provided exactly as requested) */}
                    <div className="w-full md:w-[260px] shrink-0 border-t md:border-t-0 md:border-l border-neutral-800 pt-6 md:pt-0 md:pl-6 flex flex-col justify-between text-left">
                      <div className="space-y-4">
                        <div className="flex items-center gap-1.5 text-[9px] font-sans font-extrabold tracking-widest uppercase text-neutral-400">
                          <BookOpen size={10} className="text-neutral-400" />
                          <span>Latest Strategic Brief</span>
                        </div>

                        {/* Interactive Blog Card */}
                        <div 
                          onClick={() => {
                            onPageChange('magazine');
                            setIsServicesOpen(false);
                          }}
                          className="group/bcard block cursor-pointer space-y-2"
                        >
                          {/* Image preview with slight hover scaling */}
                          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900">
                            <img 
                              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"
                              alt="Strategic Illustration" 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/bcard:scale-105"
                              referrerPolicy="no-referrer"
                            />
                            {/* Category Badge element overlay */}
                            <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md border border-neutral-800 px-2 py-0.5 rounded-full text-[9px] font-sans font-bold text-white uppercase">
                              {articles[0]?.category || 'AI Automation'}
                            </div>
                          </div>

                          <h4 className="text-white text-xs font-sans font-extrabold line-clamp-2 leading-snug group-hover/bcard:text-brand transition-colors">
                            {articles[0]?.title || 'Generative AI reshaping operational efficiency'}
                          </h4>

                          <p className="text-neutral-400 text-[10px] leading-relaxed line-clamp-2 font-sans font-medium">
                            {articles[0]?.excerpt || 'An objective look at mid-market automations.'}
                          </p>

                          <div className="flex items-center gap-3 text-[10px] font-sans text-neutral-500 font-bold">
                            <span className="flex items-center gap-1">
                              <Clock size={10} /> {articles[0]?.readTime || '5 min'}
                            </span>
                            <span className="text-neutral-400 group-hover/bcard:underline flex items-center gap-0.5">
                              Read Brief <ArrowRight size={10} className="transition-transform group-hover/bcard:translate-x-0.5" />
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                )}
              </div>
            ) : (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 text-xs md:text-sm font-medium transition-all rounded-full ${
                  activePage === item.id 
                    ? 'text-white bg-neutral-900 font-semibold' 
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
                }`}
              >
                {item.label}
              </button>
            )
          ))}
        </nav>

        {/* Right: Premium "Get Quote" Pill Button (matching image) */}
        <div className="hidden lg:block shrink-0">
          <button
            onClick={() => onPageChange('book')}
            className="group flex items-center justify-between gap-3 bg-white hover:bg-neutral-100 text-black font-bold text-xs md:text-[13px] tracking-tight pl-5 pr-1.5 h-10 rounded-full transition-all cursor-pointer shadow-md"
            id="cta-book-header"
          >
            <span>Get Quote</span>
            <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white shrink-0 transition-transform group-hover:translate-x-0.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        </div>

        {/* Mobile: Menu button */}
        <div className="flex lg:hidden shrink-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-neutral-400 hover:text-white p-2 rounded-full focus:outline-none bg-neutral-900/80 border border-neutral-800"
            id="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

      </div>

      {/* Mobile nav Drawer (perfectly integrated dark drawer) */}
      {isOpen && (
        <div className="lg:hidden mt-2 w-full pointer-events-auto bg-[#090909] border border-neutral-800 rounded-3xl p-4 shadow-2xl flex flex-col gap-1.5" id="mobile-nav-panel">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activePage === item.id
                  ? 'text-white bg-neutral-900 font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-neutral-900 mt-2">
            <button
              onClick={() => {
                onPageChange('book');
                setIsOpen(false);
              }}
              className="group w-full flex items-center justify-between gap-3 bg-white hover:bg-neutral-100 text-black font-bold text-xs tracking-tight h-11 pl-6 pr-2 rounded-full transition-all shadow-md"
              id="mobile-cta-book"
            >
              <span>Get Quote</span>
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white shrink-0 transition-transform group-hover:translate-x-0.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

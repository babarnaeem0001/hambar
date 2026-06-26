import React, { useState, useEffect } from 'react';
import { Article, ActivePage } from '../types';
import { BackgroundBeams } from './ui/background-beams';
import { 
  Search, BookOpen, Clock, ArrowRight, User, Calendar, 
  Share2, ArrowLeft, Mail, Check, MessageSquare, Linkedin, Twitter,
  Sparkles, PenTool, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { IconRobotOff, IconUserCheck, IconShieldCheckFilled } from '@tabler/icons-react';
import { adminStore } from '../lib/admin-store';
import { SafeHtmlRenderer } from './SafeHtmlRenderer';

interface MagazineViewProps {
  onPageChange: (page: ActivePage) => void;
  onOpenBookingModal?: (serviceName?: string) => void;
}

export default function MagazineView({ onPageChange, onOpenBookingModal }: MagazineViewProps) {
  const [articles, setArticles] = useState<Article[]>([]);

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

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [sharedArticleId, setSharedArticleId] = useState<string | null>(null);

  const words = ['Hambar', 'Digital'];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    'All',
    'AI Automation',
    'Technology',
    'Development',
    'Cybersecurity',
    'Others'
  ];

  const handleShareClick = (id: string, title: string) => {
    setSharedArticleId(id);
    setTimeout(() => setSharedArticleId(null), 2500);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
  };

  const handleResetNewsletter = () => {
    setNewsletterEmail('');
    setNewsletterSubscribed(false);
  };

  // Filter logic
  const filteredArticles = articles.filter(art => {
    if (art.status === 'draft') return false;
    
    const matchesCategory = selectedCategory === 'All' || (() => {
      const artCat = art.category ? art.category.toLowerCase() : '';
      const selCat = selectedCategory.toLowerCase();
      
      if (selCat === 'development') {
        return artCat.includes('dev') || artCat.includes('software');
      }
      if (selCat === 'technology') {
        return artCat.includes('tech') || artCat.includes('cloud') || artCat.includes('digital') || artCat.includes('consult');
      }
      if (selCat === 'ai automation') {
        return artCat.includes('ai') || artCat.includes('automat');
      }
      if (selCat === 'cybersecurity') {
        return artCat.includes('security') || artCat.includes('cyber');
      }
      if (selCat === 'others') {
        const isSpecialized = artCat.includes('dev') || artCat.includes('software') || 
                              artCat.includes('tech') || artCat.includes('cloud') || artCat.includes('digital') ||
                              artCat.includes('consult') ||
                              artCat.includes('ai') || artCat.includes('automat') ||
                              artCat.includes('security') || artCat.includes('cyber');
        return !isSpecialized;
      }
      return artCat === selCat;
    })();

    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="font-sans text-slate-800" id="magazine-main-view">
      
      {activeArticle ? (
        /* ----- Article Detail View (Full Page Open, reduced empty space) ----- */
        <article className="py-4 bg-white" id="magazine-detail-section">
          <div className="w-full px-4 sm:px-8 md:px-12">
            
            {/* Back to list button */}
            <button
              onClick={() => setActiveArticle(null)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-950 mb-6 cursor-pointer animate-fade-in"
              id="article-back-toggle"
            >
              <ArrowLeft size={14} />
              Back to Magazine Feed
            </button>

            {/* Article Header */}
            <header className="space-y-3 mb-6">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
                {activeArticle.title}
              </h1>
              
              {activeArticle.imageUrl && (
                <div className="w-full h-auto max-h-[460px] overflow-hidden rounded-xl border border-slate-100 bg-slate-50 mt-4 shadow-xs">
                  <img 
                    src={activeArticle.imageUrl} 
                    alt={`Cover image for ${activeArticle.title}`} 
                    className="w-full h-full object-cover" 
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}

              {/* Author & Stats bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-slate-100 text-xs mt-4">
                <div className="flex items-center gap-2.5">
                  <img src={activeArticle.author.avatar} alt={`${activeArticle.author.name}, ${activeArticle.author.role}`} className="w-8 h-8 rounded-full border border-slate-200" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
                  <div>
                    <h4 className="font-bold text-slate-950 leading-tight">{activeArticle.author.name}</h4>
                    <p className="text-slate-500 text-[9px] leading-tight mt-0.5">{activeArticle.author.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-900 text-white font-sans text-xs">
                    {activeArticle.date}
                  </span>
                  <button 
                    onClick={() => handleShareClick(activeArticle.id, activeArticle.title)}
                    className="inline-flex items-center justify-center p-2 rounded-full bg-slate-900 text-white hover:bg-black transition-colors cursor-pointer"
                    title="Share this article"
                  >
                    {sharedArticleId === activeArticle.id ? <Check size={13} /> : <Share2 size={13} />}
                  </button>
                </div>
              </div>
            </header>

            {/* Expansive Full Page Layout for Article Body Content */}
            <div className="w-full text-slate-800 text-sm leading-relaxed" id="article-body-content">
              {/* Render content directly & securely via SafeHtmlRenderer */}
              <div className="mt-2 bg-white rounded text-slate-800 break-words w-full overflow-hidden">
                <SafeHtmlRenderer html={activeArticle.content} />
              </div>

              {/* Back to feed and minimal contact CTA */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-4">
                <button
                  onClick={() => {
                    if (onOpenBookingModal) {
                      onOpenBookingModal();
                    } else {
                      onPageChange('book');
                    }
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-neutral-900 hover:text-neutral-700 hover:underline cursor-pointer"
                >
                  Connect with Hamid & Babar &rarr;
                </button>
              </div>
            </div>

            {/* Related Posts widget */}
            <div className="mt-12 pt-8 border-t border-slate-100 space-y-4" id="article-related-posts-section">
              <h3 className="font-bold text-slate-950 text-base tracking-tight">Related Articles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {articles.filter(a => a.id !== activeArticle.id).slice(0, 2).map(rArt => (
                  <div 
                    key={rArt.id} 
                    onClick={() => {
                      setActiveArticle(rArt);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-3.5 bg-slate-50 border border-slate-150 hover:border-slate-300 rounded-xl cursor-pointer space-y-2 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-slate-950 text-xs sm:text-sm leading-snug">{rArt.title}</h4>
                      <p className="text-slate-600 text-xs line-clamp-2 mt-1">{rArt.excerpt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </article>
      ) : (
         /* ----- Feed List View ----- */
        <div id="magazine-feed-wrapper">
          
           {/* Header Banner - White theme with evident line animations & dual lines grid */}
          <section className="relative w-full py-12 md:py-16 bg-white border-b border-neutral-100 overflow-hidden flex flex-col items-center justify-center antialiased" id="magazine-hero">
            {/* Highly evident animated background lines & grid */}
            <div className="absolute inset-0 bg-white bg-[linear-gradient(to_right,#f3f4f6_1.5px,transparent_1.5px),linear-gradient(to_bottom,#f3f4f6_1.5px,transparent_1.5px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] z-0" />
            <BackgroundBeams className="z-0 opacity-80" />

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
              
              {/* LEFT COLUMN: Liquid glass newsletter form - swaying and floating like other icons */}
              <div className="w-full lg:w-[320px] shrink-0 flex justify-center lg:justify-end" id="magazine-newsletter-glass-col">
                <motion.div
                  animate={{
                    y: [0, -6, 0, 6, 0],
                    rotate: [-1.5, 1.5, -1.5],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-full max-w-[260px] p-4 rounded-lg border border-neutral-200 shadow-md backdrop-blur-md flex flex-col gap-2.5 transition-all select-none overflow-hidden lg:mr-[-10px] xl:mr-[-30px] ring-1 ring-neutral-900/5 hover:ring-neutral-900/10"
                  style={{
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(240, 243, 248, 0.35) 100%)",
                    boxShadow: "inset 0 1px 1px rgba(255,255,255,0.45), 0 8px 30px rgba(0,0,0,0.04)"
                  }}
                >
                  <div className="flex items-center gap-2 text-slate-800">
                    <Mail size={16} className="text-slate-800/80 shrink-0" />
                    <span className="font-bold text-xs tracking-tight text-neutral-800">Join our newsletter</span>
                  </div>
                  
                  {newsletterSubscribed ? (
                    <div className="py-2.5 px-3 bg-emerald-50/70 border border-emerald-100/80 rounded-md text-center text-[10px] text-emerald-800 font-bold" id="header-newsletter-success">
                      <div className="flex items-center justify-center gap-1">
                        <Check size={12} />
                        <span>Subscribed!</span>
                      </div>
                      <button onClick={handleResetNewsletter} className="text-[9px] text-slate-400 hover:text-slate-600 underline mt-1 block mx-auto">Reset</button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="space-y-2">
                      <div className="relative flex items-center h-8 bg-white rounded-md border-2 border-neutral-900 px-2 transition-colors focus-within:border-neutral-950 shadow-sm">
                        <input
                           type="email"
                          placeholder="Your email"
                          value={newsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                          className="w-full bg-transparent border-none text-[10px] text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-0 px-1 py-0"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full h-8 bg-neutral-950 text-white hover:bg-neutral-850 font-bold rounded-md text-[10px] transition-all cursor-pointer shadow-xs"
                      >
                        Subscribe
                      </button>
                    </form>
                  )}
                </motion.div>
              </div>

              {/* CENTER COLUMN: Spaced title with 3D flip container & key search */}
              <div className="shrink-0 flex flex-col items-center text-center max-w-xl space-y-6 lg:mx-8">
                
                {/* Rotating Title with spaces & customized outlined rotating box */}
                <div className="space-y-3">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-neutral-900 tracking-tighter flex items-center justify-center gap-x-3 flex-wrap select-none w-full text-center uppercase">
                    <span>The</span>
                    <span className="relative inline-flex items-center justify-center font-black rounded-lg bg-neutral-950 text-white min-w-[130px] sm:min-w-[170px] md:min-w-[220px] h-[60px] md:h-[75px] shadow-sm px-4 md:px-6">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={words[wordIndex]}
                          initial={{ filter: "blur(10px)", opacity: 0, y: 15 }}
                          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                          exit={{ filter: "blur(10px)", opacity: 0, y: -15 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="absolute inset-0 flex items-center justify-center text-center font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tighter uppercase"
                          style={{ transformOrigin: "center" }}
                        >
                          {words[wordIndex]}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    <span>Magazine</span>
                  </h1>
                </div>

                {/* Keyword Search with search icon SVG */}
                <div className="max-w-xs mx-auto pt-1 w-full" id="magazine-search-components">
                  <div className="relative w-full">
                    <span className="absolute left-3 top-2 text-neutral-400 flex items-center justify-center pointer-events-none">
                      <Search size={14} />
                    </span>
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-md pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-neutral-900 transition-colors font-sans focus:ring-1 focus:ring-neutral-200 shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: 3 Symbols scattered, swinging slightly */}
              <div className="relative w-full lg:w-[320px] h-32 shrink-0 flex items-center justify-center lg:justify-start" id="magazine-scattered-symbols">
                
                {/* Symbol 1: No-AI */}
                <motion.div
                   animate={{ y: [-5, 5, -5], x: [-2, 2, -2] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-2 left-0 lg:left-4 p-3 bg-white border border-neutral-200 rounded-full shadow-xs flex items-center justify-center pointer-events-none text-neutral-900"
                >
                  <IconRobotOff size={28} stroke={1.5} />
                </motion.div>

                {/* Symbol 2: Human-Made */}
                <motion.div
                  animate={{ y: [6, -6, 6], x: [3, -3, 3] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-1 left-20 lg:left-24 p-3 bg-white border border-neutral-200 rounded-full shadow-xs flex items-center justify-center pointer-events-none text-neutral-900"
                >
                  <IconUserCheck size={28} stroke={1.5} />
                </motion.div>

                {/* Symbol 3: Audited */}
                <motion.div
                  animate={{ y: [-4, 4, -4], x: [-1, 3, -1] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute top-6 left-40 lg:left-44 p-3 bg-white border border-neutral-200 rounded-full shadow-xs flex items-center justify-center pointer-events-none text-neutral-900"
                >
                  <IconShieldCheckFilled size={28} />
                </motion.div>

              </div>

            </div>
          </section>

          <section className="py-6 bg-white" id="magazine-feed-grid">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              
              <div className="w-full">
                {/* Articles List */}
                <div className="max-w-5xl mx-auto space-y-4" id="magazine-articles-list">
                  {filteredArticles.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50/50 border border-slate-150 rounded-xl space-y-2">
                       <BookOpen size={30} className="mx-auto text-slate-300" />
                       <h3 className="font-bold text-slate-900 text-xs">No Articles Found</h3>
                       <p className="text-slate-500 text-[11px]">Try selecting another category or searching different keywords.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredArticles.map((art) => (
                        <article 
                          key={art.id} 
                          onClick={() => {
                            setActiveArticle(art);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="p-4 bg-white border border-neutral-100 rounded-xl hover:border-neutral-300 hover:shadow-xs cursor-pointer transition-all flex flex-col gap-3 select-none"
                          id={`article-card-${art.id}`}
                        >
                          {/* Space for Picture of Blog - Height is 36 (compact) */}
                          <div className="w-full h-36 bg-neutral-50 rounded-lg overflow-hidden border border-neutral-100 flex items-center justify-center shrink-0">
                            {art.imageUrl ? (
                              <img 
                                src={art.imageUrl} 
                                alt={`Cover image for ${art.title}`} 
                                className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500" 
                                loading="lazy"
                                decoding="async"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-neutral-300 gap-1.5">
                                <BookOpen size={20} strokeWidth={1.5} />
                                <span className="text-[9px] font-mono tracking-widest uppercase text-neutral-450">Hambar Article</span>
                              </div>
                            )}
                          </div>

                          {/* Title Only Display (Simplified) */}
                          <div className="flex-grow">
                            <h2 className="text-xs sm:text-sm font-bold text-neutral-900 tracking-tight leading-snug hover:text-neutral-700 break-words line-clamp-2">
                              {art.title}
                            </h2>
                          </div>

                          {/* Card bottom details (Simplified, no Category, no Date) */}
                          <div className="mt-auto pt-2 border-t border-neutral-50 flex items-center justify-end">
                            <span className="p-1 px-2.5 rounded-full bg-neutral-50 text-neutral-950 font-bold text-[10px] hover:bg-neutral-100 transition-colors flex items-center gap-1">
                              Read Post <ArrowRight size={11} />
                            </span>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Category Selector Navbar placed at bottom */}
              <div className="w-full flex justify-center pt-8 pb-4" id="magazine-feed-category-navbar-bottom">
                <div className="relative p-1 bg-neutral-50 rounded-xl border border-neutral-200/80 flex flex-wrap items-center justify-center gap-1 max-w-2xl shadow-xs">
                  {categories.map((cat, idx) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedCategory(cat)}
                        className={`relative px-4 py-2 rounded-lg text-xs font-bold tracking-tight transition-all duration-300 cursor-pointer select-none overflow-hidden ${
                          isSelected 
                            ? 'text-neutral-900 bg-white shadow-xs border border-neutral-250' 
                            : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
                        }`}
                      >
                        {cat}
                        {isSelected && (
                          <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-neutral-950" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </section>

        </div>
      )}
    </div>
  );
}

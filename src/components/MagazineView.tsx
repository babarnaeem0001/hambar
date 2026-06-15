import React, { useState } from 'react';
import { Article, ActivePage } from '../types';
import { articles } from '../data';
import { BackgroundBeams } from './ui/background-beams';
import { 
  Search, BookOpen, Clock, ArrowRight, User, Calendar, 
  Share2, ArrowLeft, Mail, Check, MessageSquare, Linkedin, Twitter 
} from 'lucide-react';

interface MagazineViewProps {
  onPageChange: (page: ActivePage) => void;
  onOpenBookingModal?: (serviceName?: string) => void;
}

export default function MagazineView({ onPageChange, onOpenBookingModal }: MagazineViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [sharedMessage, setSharedMessage] = useState<string | null>(null);

  const categories = [
    'All',
    'AI Automation',
    'Technology Consulting',
    'SEO',
    'Business Growth',
    'Software Development',
    'Web Development',
    'Mobile Apps',
    'Cybersecurity',
    'Cloud Computing',
    'Digital Transformation',
    'Productivity'
  ];

  const handleShareClick = (title: string) => {
    setSharedMessage(`Copied link to: "${title}"`);
    setTimeout(() => setSharedMessage(null), 3000);
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
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="font-sans text-slate-800" id="magazine-main-view">
      
      {activeArticle ? (
        /* ----- Article Detail View ----- */
        <article className="py-12 bg-white" id="magazine-detail-section">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            
            {/* Back to list button */}
            <button
              onClick={() => setActiveArticle(null)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-950 mb-8 cursor-pointer"
              id="article-back-toggle"
            >
              <ArrowLeft size={14} />
              Back to Magazine Feed
            </button>

            {/* Article Header */}
            <header className="space-y-4 mb-8">
              <span className="text-[10px] uppercase font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                {activeArticle.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
                {activeArticle.title}
              </h1>
              
              {/* Author & Stats bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-100 text-xs">
                <div className="flex items-center gap-3">
                  <img src={activeArticle.author.avatar} alt={activeArticle.author.name} className="w-10 h-10 rounded-full border border-slate-200" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="font-bold text-slate-950 leading-tight">{activeArticle.author.name}</h4>
                    <p className="text-slate-500 text-[10px] leading-tight mt-0.5">{activeArticle.author.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-500 text-[11px] font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} /> {activeArticle.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} /> {activeArticle.readTime}
                  </span>
                  <button 
                    onClick={() => handleShareClick(activeArticle.title)}
                    className="flex items-center gap-1 text-slate-700 hover:text-slate-950 font-semibold cursor-pointer"
                    title="Share this strategic brief"
                  >
                    <Share2 size={13} /> Share
                  </button>
                </div>
              </div>

              {sharedMessage && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded text-center text-xs text-emerald-800 font-medium">
                  {sharedMessage}
                </div>
              )}
            </header>

            {/* Two Column Layout: TOC + Body Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Sidebar table of contents (Col 1-4) */}
              <div className="lg:col-span-4 p-5 bg-slate-50 border border-slate-100 rounded-lg space-y-4 sticky top-20" id="article-toc-panel">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Brief Overview</h3>
                <nav className="space-y-2 text-xs font-medium text-slate-600">
                  <a href="#toc-summary" className="block hover:text-slate-955 hover:underline">1. Executive Summary</a>
                  <a href="#toc-areas" className="block hover:text-slate-955 hover:underline">2. Structural Workflow Areas</a>
                  <a href="#toc-estimates" className="block hover:text-slate-955 hover:underline">3. Staged Milestones & Scale</a>
                  <a href="#toc-security" className="block hover:text-slate-955 hover:underline">4. Data Isolation Guardrails</a>
                </nav>
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-[10px] text-slate-400 font-mono leading-relaxed">
                    Published and audited strictly under HB Digital guidelines. Hamid Saleem & Babar Naeem.
                  </p>
                </div>
              </div>

              {/* Main article Content body (Col 5-12) */}
              <div className="lg:col-span-8 text-slate-800 text-sm leading-relaxed space-y-6" id="article-body-content">
                <div className="prose prose-slate prose-sm text-slate-700 max-w-none">
                  {/* Styled body sections replicating markdown titles */}
                  <div id="toc-summary" className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-950 tracking-tight pt-2 border-b border-slate-100 pb-1">1. Strategic Context</h3>
                    <p>Every commercial company must identify where manual administrative loops are causing overhead limits. Generative AI and automated search tunnels offer immediate paths to bypass redundant folders. Rather than implementing massive technical transformations overnight, we recommend step-by-step validation goals.</p>
                  </div>

                  <div id="toc-areas" className="space-y-2 pt-4">
                    <h3 className="text-lg font-bold text-slate-950 tracking-tight pt-2 border-b border-slate-100 pb-1">2. Core Operational Impact</h3>
                    <p>Modern applications should be designed with absolute performance in mind. For E-commerce or Healthcare, this implies secure checkout routes and local offline databases. For professional consulting firms, this implies centralizing customer communications to lower scheduling lag.</p>
                  </div>

                  {/* Render content directly */}
                  <div className="whitespace-pre-line text-xs font-sans mt-4 bg-slate-50 p-5 rounded border border-slate-100 font-mono text-slate-600">
                    {activeArticle.content}
                  </div>

                  {/* Structured consultation CTA directly inside blog post */}
                  <div className="mt-8 p-6 bg-neutral-950 text-white rounded-lg space-y-4 text-center">
                    <h3 className="text-base font-bold">Activate this Blueprint in Your Organization</h3>
                    <p className="text-neutral-400 text-xs max-w-md mx-auto">
                      Inquire directly with co-founders Hamid Saleem and Babar Naeem to begin milestone implementation for your platform.
                    </p>
                    <button
                      onClick={() => {
                        if (onOpenBookingModal) {
                          onOpenBookingModal();
                        } else {
                          onPageChange('book');
                        }
                      }}
                      className="px-4 py-2 bg-white text-neutral-950 text-xs font-semibold rounded hover:bg-neutral-100 transition-all cursor-pointer"
                    >
                      Buy Service
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Related Posts */}
            <div className="mt-16 pt-10 border-t border-slate-100 space-y-6" id="article-related-posts-section">
              <h3 className="font-bold text-slate-950 text-lg tracking-tight">Related Articles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {articles.filter(a => a.id !== activeArticle.id).slice(0, 2).map(rArt => (
                  <div 
                    key={rArt.id} 
                    onClick={() => {
                      setActiveArticle(rArt);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-4 bg-slate-50 border border-slate-150 hover:border-slate-300 rounded cursor-pointer space-y-2 transition-colors"
                  >
                    <span className="text-[9px] font-mono uppercase bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">{rArt.category}</span>
                    <h4 className="font-bold text-slate-950 text-sm leading-snug">{rArt.title}</h4>
                    <p className="text-slate-600 text-xs line-clamp-2">{rArt.excerpt}</p>
                    <p className="text-slate-400 text-[10px] font-mono pt-1">{rArt.date}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </article>
      ) : (
        /* ----- Feed List View ----- */
        <div id="magazine-feed-wrapper">
          
           {/* Header Banner */}
          <section className="relative w-full py-24 bg-white border-b border-neutral-100 overflow-hidden flex flex-col items-center justify-center antialiased" id="magazine-hero">
            <BackgroundBeams className="z-0" />
            <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
              <span className="text-xs font-mono uppercase bg-neutral-900 text-white px-3 py-1 rounded-full font-bold">The Strategic Brief</span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-neutral-900 tracking-tight bg-clip-text bg-gradient-to-b from-neutral-950 to-neutral-600">
                The HB Digital Magazine
              </h1>
              <p className="text-neutral-500 text-sm max-w-2xl mx-auto leading-relaxed">
                Refined blueprints, market perspectives, and step-by-step systems tutorials published directly by technology specialists Hamid Saleem and Babar Naeem.
              </p>

              {/* Keyword Search & Category selects */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto pt-2" id="magazine-search-components">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-2.5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search articles... (e.g. AI, SEO)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/80 backdrop-blur border border-neutral-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Categories Slider */}
          <section className="bg-white border-b border-slate-100 py-3" id="magazine-categories-bar">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-thin">
                {categories.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors focus:outline-none ${
                      selectedCategory === cat 
                        ? 'bg-slate-950 text-white' 
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Main Feed Section */}
          <section className="py-12 bg-white" id="magazine-feed-grid">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Feed Column: Articles (Col 1-8) */}
                <div className="lg:col-span-8 space-y-8" id="magazine-articles-list">
                  {filteredArticles.length === 0 ? (
                    <div className="text-center py-16 bg-slate-50 border border-slate-150 rounded space-y-2">
                       <BookOpen size={36} className="mx-auto text-slate-300" />
                       <h3 className="font-bold text-slate-900 text-sm">No Articles Found</h3>
                       <p className="text-slate-500 text-xs">Try selecting another category or searching different keywords.</p>
                    </div>
                  ) : (
                    filteredArticles.map((art) => (
                      <div 
                        key={art.id} 
                        className="p-6 bg-slate-50 border border-slate-100 rounded-lg hover:border-slate-300 transition-colors flex flex-col justify-between space-y-4"
                        id={`article-card-${art.id}`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                            <span className="uppercase font-semibold text-slate-700 bg-slate-200/50 px-1.5 py-0.5 rounded">{art.category}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5"><Clock size={11} className="-mt-0.5" /> {art.readTime}</span>
                          </div>
                          <h2 
                            onClick={() => {
                              setActiveArticle(art);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }} 
                            className="text-xl font-extrabold text-slate-950 tracking-tight leading-tight hover:text-slate-700 cursor-pointer"
                          >
                            {art.title}
                          </h2>
                          <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">{art.excerpt}</p>
                        </div>

                        {/* Card bottom footer */}
                        <div className="pt-4 border-t border-slate-200/50 flex flex-wrap justify-between items-center gap-3">
                          <div className="flex items-center gap-2.5">
                            <img src={art.author.avatar} alt={art.author.name} className="w-8 h-8 rounded-full border border-slate-200" referrerPolicy="no-referrer" />
                            <div>
                              <p className="text-xs font-bold text-slate-950 leading-tight">{art.author.name}</p>
                              <p className="text-[9px] text-slate-500 leading-none">{art.author.role}</p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => {
                              setActiveArticle(art);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="inline-flex items-center gap-1 text-xs font-bold text-slate-950 hover:text-slate-700 group cursor-pointer"
                          >
                            Read Brief <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Right Feed Column: Newsletter & Info Widgets (Col 9-12) */}
                <div className="lg:col-span-4 space-y-6" id="magazine-sidebar">
                  
                  {/* Newsletter subscription module */}
                  <div className="p-6 bg-slate-950 text-white rounded-lg space-y-4" id="newsletter-subscription-box">
                    <Mail size={24} className="text-white" />
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm tracking-tight text-white">Subscribe to the Brief</h3>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        Receive objective, plain-English strategic guidelines and code evaluations delivered directly by Hamid & Babar.
                      </p>
                    </div>

                    {newsletterSubscribed ? (
                      <div className="p-4 bg-slate-900 border border-slate-800 rounded space-y-2 text-center" id="newsletter-success-state">
                        <Check size={20} className="text-white mx-auto" />
                        <p className="text-xs text-slate-300 font-semibold">Subscribed Successfully!</p>
                        <button onClick={handleResetNewsletter} className="text-[10px] text-slate-500 hover:text-white underline">Reset</button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubscribe} className="space-y-2">
                        <input
                          type="email"
                          placeholder="Your professional email"
                          value={newsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                          className="w-full bg-slate-900 text-white placeholder-slate-500 border border-slate-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-white"
                          required
                        />
                        <button
                          type="submit"
                          className="w-full py-2 bg-white text-slate-950 hover:bg-slate-100 font-semibold rounded text-xs transition-colors cursor-pointer"
                        >
                          Join Strategic Newsletter
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Operational disclaimer */}
                  <div className="p-5 border border-slate-150 rounded bg-slate-50 space-y-2 text-xs text-slate-600 leading-relaxed">
                    <h4 className="font-bold text-slate-950 uppercase text-[9px] tracking-wider">Editorial Standards</h4>
                    <p>All digital briefs in this platform represent original technical reviews authored directly by Hamid Saleem and Babar Naeem. Content contains no generic generative AI padding or duplicate marketing summaries.</p>
                  </div>

                </div>

              </div>
            </div>
          </section>

        </div>
      )}
    </div>
  );
}

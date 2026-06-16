import React, { useState } from 'react';
import { serviceCategories, majorServicesDetails } from '../data';
import { ActivePage, Service } from '../types';
import { 
  Search, ArrowRight, MessageSquare, Code, Sparkles, Network, 
  ArrowUpRight, TrendingUp, Layers, Cloud, ShieldCheck, Database, 
  Settings, X, Check, HelpCircle, ChevronRight, FileCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SlideInButton from './ui/SlideInButton';

interface ServicesViewProps {
  onPageChange: (page: ActivePage, serviceSlug?: string) => void;
  initialServiceId?: string;
  onOpenBookingModal?: (serviceName?: string) => void;
}

export default function ServicesView({ onPageChange, initialServiceId, onOpenBookingModal }: ServicesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSvc, setSelectedSvc] = useState<Service | null>(null);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>('services-hero');

  // Automatically select service if loaded from nav mega-dropdown links
  React.useEffect(() => {
    if (initialServiceId) {
      // Find the service across all categories
      for (const cat of serviceCategories) {
        const found = cat.services.find(s => s.id === initialServiceId);
        if (found) {
          setSelectedSvc(found);
          break;
        }
      }
    }
  }, [initialServiceId]);

  const filteredCategories = React.useMemo(() => {
    return serviceCategories.map(cat => {
      const filteredServices = cat.services.filter(s => {
        return s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
               s.description.toLowerCase().includes(searchQuery.toLowerCase());
      });
      return {
        ...cat,
        services: filteredServices
      };
    }).filter(cat => cat.services.length > 0);
  }, [searchQuery]);

  const getActiveCategoryIndex = () => {
    if (activeSection === 'services-hero') {
      return -1;
    }
    if (activeSection === 'services-contact-redirect') {
      return filteredCategories.length - 1;
    }
    const index = filteredCategories.findIndex(c => `category-block-${c.id}` === activeSection);
    return index < 0 ? 0 : index;
  };

  const activeIndex = getActiveCategoryIndex();

  const categoryIdsString = filteredCategories.map(c => c.id).join(',');

  // Scroll active section tracker with highly accurate viewport offset tracking
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // targetPoint is the visual focus line in the viewport (25% from top of screen)
      const targetPoint = viewportHeight * 0.25;

      // 1. If we are near the very top of the page, highlight the hero
      if (scrollY <= 60) {
        setActiveSection('services-hero');
        return;
      }

      // 2. If we are near the bottom of the page, highlight the redirect block
      if (scrollY + viewportHeight >= documentHeight - 80) {
        setActiveSection('services-contact-redirect');
        return;
      }

      // 3. Otherwise, check each category block.
      // Find the category block that is currently crossing/occupying our targetPoint line.
      let activeId = '';

      for (const cat of filteredCategories) {
        const id = `category-block-${cat.id}`;
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the element spans across the targetPoint
          if (rect.top <= targetPoint && rect.bottom >= targetPoint - 15) {
            activeId = id;
            break;
          }
        }
      }

      // Fallback: If no direct spanning element is found, pick the closest one to targetPoint
      if (!activeId && filteredCategories.length > 0) {
        let closestId = '';
        let minDistance = Infinity;
        for (const cat of filteredCategories) {
          const id = `category-block-${cat.id}`;
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            const distance = Math.abs(rect.top - targetPoint);
            if (distance < minDistance) {
              minDistance = distance;
              closestId = id;
            }
          }
        }
        activeId = closestId || `category-block-${filteredCategories[0].id}`;
      }

      if (activeId) {
        setActiveSection(activeId);
      }
    };

    // Calculate once on mount/dependency change to set initial correct active state
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [categoryIdsString]);

  // Helper icons for categories
  const getCatIcon = (catId: string) => {
    switch (catId) {
      case 'strategy':
        return <Network className="text-neutral-900 shrink-0" size={18} />;
      case 'growth':
        return <TrendingUp className="text-neutral-900 shrink-0" size={18} />;
      case 'dev':
        return <Code className="text-neutral-900 shrink-0" size={18} />;
      case 'custom-software':
        return <Layers className="text-neutral-900 shrink-0" size={18} />;
      case 'ai-automation':
        return <Sparkles className="text-neutral-900 shrink-0" size={18} />;
      case 'design-product':
        return <Layers className="text-neutral-900 shrink-0" size={18} />;
      case 'quality-security':
        return <ShieldCheck className="text-neutral-900 shrink-0" size={18} />;
      case 'cloud':
        return <Cloud className="text-neutral-900 shrink-0" size={18} />;
      case 'data-tech':
        return <Database className="text-neutral-900 shrink-0" size={18} />;
      case 'support':
        return <Settings className="text-neutral-900 shrink-0" size={18} />;
      default:
        return <ArrowUpRight className="text-neutral-900 shrink-0" size={18} />;
    }
  };

  // Safe service detailed lookup & dynamic synthesizer
  const getServiceDetails = (svc: Service) => {
    // Check static dictionaries in data.ts
    if (majorServicesDetails[svc.id]) {
      return majorServicesDetails[svc.id];
    }
    const cleanId = svc.id.replace('-services', '');
    if (majorServicesDetails[cleanId]) {
      return majorServicesDetails[cleanId];
    }
    
    // Custom detailed contents computed on request if not pre-defined
    return {
      slug: svc.id,
      title: svc.name,
      tagline: `High-performance strategic blueprints, modular engineering, and production operations.`,
      overview: svc.description || `Enhance your performance metrics with our bespoke ${svc.name} stack. Engineered using React, TypeScript, and robust database architectures mapped directly under sustainable growth strategies.`,
      problemsSolved: [
        `Operational processing bottlenecks causing team fatigue and delays.`,
        `Outdated technology code and heavy tooling integration debt.`,
        `Absence of unified, secure analytics dashboards to monitor operations.`,
        `Performance vulnerabilities during spikes in active user waves.`
      ],
      benefits: [
        `Flawless responsiveness designed around specific database metrics.`,
        `Predictable milestone scopes delivered with a strict fixed-budget model.`,
        `Clear technical blueprint documentations that prevent ongoing debt.`,
        `Highly stable user experiences with proven security posture safeguards.`
      ],
      process: [
        `01 / DISCOVERY AUDIT: Scanning current system files, logs, and database metrics.`,
        `02 / ARCHITECTURAL BLUEPRINT: Crafting direct entity mapping and clean schema plans.`,
        `03 / TESTING & STAGING: Writing automated check suites to verify edge-case environments.`,
        `04 / SMOOTH CUTOVER: Orchestrating safe live deployments with zero operational downtime.`
      ],
      deliverables: [
        `Bespoke Tech-Stack Analysis & Growth-Opportunity Report`,
        `Modular System Architecture Specifications & Database Map`,
        `Comprehensive Milestone Discovery & Budget Allocation Plan`,
        `Automated Integration Checking Guides & Security Protocols`
      ],
      whyChooseUs: [
        `Business-first approach prioritizing tangible ROI metrics before model sizes.`,
        `Completely transparent, jargon-free developer client communication.`,
        `Decades of engineering mastery establishing safe enterprise apps.`
      ],
      relatedServices: [],
      faqs: [
        {
          question: `How fast can we kick off a custom ${svc.name} model?`,
          answer: `Our discovery processes start immediately. We draft complete architecture criteria and fixed milestones in 48-72 hours, with initial prototype pages live in 2-3 weeks.`
        },
        {
          question: `Is our customer data preserved under secure isolation?`,
          answer: `Yes, always. We implement sandboxed API pathways, utilize secure credentials, and adhere strictly to global data compliance limits to guarantee total security.`
        }
      ]
    };
  };

  const currentDetails = selectedSvc ? getServiceDetails(selectedSvc) : null;

  return (
    <div className="bg-white text-neutral-900 font-sans min-h-screen selection:bg-neutral-950 selection:text-white" id="services-main-view">
      
      {/* 1. Header Hero Segment with 3D Hovering Devices Showcase */}
      <section className="border-b border-neutral-200 py-12 md:py-16 animate-fade-in bg-gradient-to-b from-slate-50/50 to-white overflow-hidden relative" id="services-hero">
        {/* Subtle decorative background grids or orbits */}
        <div className="absolute inset-0 pointer-events-none opacity-20 select-none overflow-hidden z-0">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dotPattern" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="16" cy="16" r="1" fill="#cbd5e1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotPattern)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Column: Hovering MacBook Pro */}
            <div className="lg:col-span-4 hidden lg:flex justify-center items-center relative">
              <motion.div
                className="flex flex-col items-center"
                style={{ rotate: -4 }}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut"
                }}
              >
                {/* Laptop Screen Portion */}
                <div className="relative bg-neutral-950 p-2 pb-0.5 rounded-t-[14px] border border-neutral-800 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.18)]">
                  <div className="w-[200px] sm:w-[240px] h-[120px] sm:h-[144px] bg-slate-900 rounded-[8px] overflow-hidden relative flex flex-col p-1.5 justify-between">
                    {/* Glare effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 select-none pointer-events-none z-10" />
                    
                    {/* Dashboard Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-1 text-[7px] font-sans text-neutral-400">
                      <div className="flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400/80" />
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/80" />
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400/80" />
                        <span className="ml-1 text-[5px] text-neutral-500 font-bold uppercase tracking-wider">Hambar Dashboard</span>
                      </div>
                      <div className="bg-neutral-850 px-1 py-0.5 rounded text-[5px] text-neutral-400">Active Pipeline</div>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/85 animate-pulse" />
                    </div>

                    {/* Dashboard Content Panel */}
                    <div className="flex-1 flex gap-1.5 pt-1.5 overflow-hidden">
                      {/* Sidebar Mock */}
                      <div className="w-10 bg-neutral-950/40 rounded p-1 flex flex-col gap-1 select-none">
                        <div className="w-full h-1 bg-brand/30 rounded-sm" />
                        <div className="w-3/4 h-0.5 bg-neutral-700/55 rounded-sm" />
                        <div className="w-2/3 h-0.5 bg-neutral-700/55 rounded-sm" />
                        <div className="w-4/5 h-0.5 bg-neutral-700/55 rounded-sm" />
                      </div>

                      {/* Main Grid Mock */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="grid grid-cols-2 gap-1 mb-1">
                          {/* Card 1 */}
                          <div className="bg-neutral-950/20 border border-white/5 rounded p-0.5 text-left">
                            <span className="text-[5px] text-slate-500 font-bold block leading-none">CONVERSIONS</span>
                            <span className="text-[8px] font-bold text-white block mt-0.5">2,845</span>
                          </div>
                          {/* Card 2 */}
                          <div className="bg-neutral-950/20 border border-white/5 rounded p-0.5 text-left">
                            <span className="text-[5px] text-slate-500 font-bold block leading-none">SEO TRAFFIC</span>
                            <span className="text-[8px] font-bold text-brand block mt-0.5">+143%</span>
                          </div>
                        </div>

                        {/* Chart Container Mock */}
                        <div className="flex-1 bg-neutral-950/45 border border-white/10 rounded p-1 flex flex-col justify-between">
                          <span className="text-[5px] text-emerald-400/80 font-mono font-bold leading-none">LIVE PERFORMANCE</span>
                          <div className="flex items-end justify-between h-7 pt-1 px-1 gap-0.5">
                            <div className="w-1.5 h-2 bg-neutral-800 rounded-t-sm" />
                            <div className="w-1.5 h-3 bg-neutral-800 rounded-t-sm" />
                            <div className="w-1.5 h-4.5 bg-brand-dark/70 rounded-t-sm" />
                            <div className="w-1.5 h-5 bg-brand rounded-t-sm" />
                            <div className="w-1.5 h-3 bg-neutral-800 rounded-t-sm" />
                            <div className="w-1.5 h-6 bg-emerald-400 rounded-t-sm" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Screen Footer */}
                    <div className="flex items-center justify-between text-[5px] font-sans border-t border-white/10 pt-1 text-slate-500 leading-none">
                      <span>Sync Active</span>
                      <span>v1.0.4</span>
                    </div>
                  </div>
                </div>

                {/* Laptop Lower Base / Keyboard */}
                <div className="relative bg-slate-300 w-[240px] sm:w-[280px] h-3 rounded-b-[4px] border-b border-slate-400 shadow-[0_12px_20px_rgba(0,0,0,0.1)] flex items-center justify-center">
                  {/* Notch Center */}
                  <div className="absolute top-0 w-10 h-1 bg-slate-400 rounded-b" />
                </div>
              </motion.div>
            </div>

            {/* Middle Column: Centered Text */}
            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-6">
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight font-sans">
                  Start a Project
                </h1>
              </div>

              {/* Core Search Controller */}
              <div className="relative w-full max-w-sm mx-auto" id="service-search-wrapper">
                <Search size={14} className="absolute left-3 top-3.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-md pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-neutral-950 transition-colors font-sans focus:ring-1 focus:ring-neutral-200 shadow-sm"
                  id="service-search-input"
                />
              </div>
            </div>

            {/* Right Column: Hovering iPhone & Apple Watch */}
            <div className="lg:col-span-4 hidden lg:flex justify-center items-center gap-6 sm:gap-8 relative">
              {/* iPhone */}
              <motion.div
                className="relative"
                animate={{
                  y: [0, -14, 0],
                  rotate: [-3, 0, -3]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  ease: "easeInOut"
                }}
              >
                <div className="relative w-[82px] sm:w-[94px] h-[155px] sm:h-[180px] bg-slate-900 rounded-[20px] p-1.5 shadow-[0_20px_35px_rgba(0,0,0,0.12)] border-2 border-slate-950">
                  {/* Inner screen container */}
                  <div className="w-full h-full bg-zinc-950 rounded-[15px] overflow-hidden relative flex flex-col p-1.5 justify-between">
                    
                    {/* Notch area */}
                    <div className="absolute top-0.5 inset-x-0 flex justify-center z-20">
                      <span className="w-6 h-1 bg-black rounded-full" />
                    </div>

                    {/* Header indicators */}
                    <div className="flex justify-between items-center text-[5px] text-slate-400 px-0.5 pt-0.5 select-none pointer-events-none">
                      <span>12:00</span>
                      <div className="flex gap-0.5">
                        <span>WiFi</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* Grid representation */}
                    <div className="flex-1 space-y-1 pt-1">
                      <div className="w-1/2 h-2.5 bg-neutral-800 rounded-sm" />
                      <div className="grid grid-cols-2 gap-1">
                        <div className="h-6 bg-brand/25 border border-brand/20 rounded-md flex flex-col justify-center p-0.5">
                          <span className="text-[4px] font-bold text-brand">APP STATS</span>
                          <span className="text-[5px] text-white">99.8%</span>
                        </div>
                        <div className="h-6 bg-slate-800 rounded-md flex flex-col justify-center p-0.5">
                          <span className="text-[4px] font-bold text-slate-400">USERS</span>
                          <span className="text-[5px] text-white">12.4K</span>
                        </div>
                      </div>
                      <div className="h-10 bg-neutral-800/80 rounded-md p-1 flex flex-col gap-0.5 justify-center">
                        <span className="text-[4px] text-slate-300">Conversion Funnel</span>
                        <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
                          <div className="w-4/5 h-full bg-emerald-400" />
                        </div>
                        <span className="text-[4px] text-emerald-400 text-right font-mono">+18% Today</span>
                      </div>
                    </div>

                    {/* Soft touch button bar */}
                    <div className="flex justify-center select-none pt-0.5">
                      <span className="w-8 h-0.5 bg-neutral-700 rounded-full" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Apple Watch */}
              <motion.div
                className="relative"
                animate={{
                  y: [0, 12, 0],
                  rotate: [2, -2, 2]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4.5,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <div className="relative flex flex-col items-center">
                  {/* Watch Top Strap */}
                  <div className="w-7 h-6 bg-neutral-850 rounded-t-md border-t border-slate-700/50" />

                  {/* Apple Watch Case */}
                  <div className="relative w-[64px] sm:w-[74px] h-[74px] sm:h-[84px] bg-slate-900 rounded-[14px] p-1 border border-neutral-950 shadow-[0_15px_30px_rgba(0,0,0,0.18)] flex items-center justify-center">
                    {/* Digital Crown (Physical button) */}
                    <div className="absolute right-0 top-[22%] translate-x-1 w-1.5 h-3.5 bg-zinc-700 rounded-r shadow border border-neutral-600 border-l-0" />
                    
                    {/* Side Button */}
                    <div className="absolute right-0 top-[52%] translate-x-0.5 w-[2px] h-4 bg-zinc-800 rounded-r border border-neutral-750" />

                    {/* Inner deep black display */}
                    <div className="w-full h-full rounded-[10px] bg-black flex flex-col items-center justify-between p-1.5 relative overflow-hidden border border-slate-850">
                      {/* Status bar */}
                      <div className="w-full flex justify-between items-center text-[5px] text-neutral-400">
                        <span>09:41</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      </div>
                      
                      {/* Apple Activity Rings Centerpiece */}
                      <div className="relative w-8 h-8 flex items-center justify-center">
                        <div className="absolute w-[28px] h-[28px] rounded-full border border-red-500/80 pointer-events-none" />
                        <div className="absolute w-[20px] h-[20px] rounded-full border border-emerald-400/80 pointer-events-none" />
                        <div className="absolute w-[12px] h-[12px] rounded-full border border-sky-400/80 pointer-events-none" />
                      </div>

                      {/* Watch metrics */}
                      <div className="text-[5.5px] uppercase text-emerald-400 font-mono tracking-wider font-bold">
                        SECURE
                      </div>
                    </div>
                  </div>

                  {/* Watch Bottom Strap */}
                  <div className="w-7 h-6 bg-neutral-850 rounded-b-md border-b border-slate-700/50" />
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Structured Catalog Section with realistic backdrop glow elements */}
      <section className="relative py-16 sm:py-20" id="services-grid-section">
        {/* Soft background glow circles to show off the frosted glass backdrop-blur */}
        <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
          <div className="absolute top-[10%] left-[5%] w-[45vw] h-[45vw] max-w-[600px] rounded-full bg-neutral-100/40 blur-[130px]" />
          <div className="absolute top-[40%] right-[10%] w-[35vw] h-[35vw] max-w-[500px] rounded-full bg-brand/20 blur-[110px]" />
          <div className="absolute bottom-[10%] left-[25%] w-[40vw] h-[40vw] max-w-[600px] rounded-full bg-neutral-100/50 blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-20 border border-neutral-200/60 bg-white/50 backdrop-blur-md rounded-2xl space-y-4 max-w-xl mx-auto" id="no-services-state">
              <span className="text-xs font-sans text-neutral-400 uppercase tracking-widest font-semibold">No Matches Found</span>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                No services match your active search filter. Reset the query to view the full directory catalog.
              </p>
              <div className="flex justify-center pt-2">
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-5 py-2.5 bg-neutral-950 text-white hover:bg-neutral-900 border border-white/10 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-md shadow-neutral-950/10"
                >
                  Reset Search Index
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-12 lg:gap-16 items-start">
              
              {/* IMMERSIVE ANIMATED LEFT SIDE CATEGORY SCROLL TRACK TIMELINE */}
              <div 
                className="hidden md:block w-52 lg:w-60 shrink-0 sticky top-36 self-start py-4" 
                id="left-category-lane"
              >
                <div className="relative flex flex-col">
                  {/* Background timeline runner track (matches 72px button centers) */}
                  <div 
                    className="absolute left-[7px] w-[2px] bg-neutral-100/80 rounded-full" 
                    style={{ 
                      top: '36px', 
                      height: `${(filteredCategories.length - 1) * 72}px` 
                    }}
                  />
                  
                  {/* Dynamic active scroll segment track filler overlay */}
                  <motion.div 
                    className="absolute left-[7px] w-[2px] bg-gradient-to-b from-neutral-400 to-neutral-950 rounded-full"
                    style={{ 
                      originY: 0,
                      top: '36px'
                    }}
                    animate={{ 
                      height: `${activeIndex < 0 ? 0 : activeIndex * 72}px`,
                      opacity: activeIndex < 0 ? 0 : 1
                    }}
                    transition={{ type: "spring", stiffness: 150, damping: 22 }}
                  />

                  {filteredCategories.map((cat, idx) => {
                    const sectionId = `category-block-${cat.id}`;
                    const isActive = activeSection === sectionId;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          const el = document.getElementById(sectionId);
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }}
                        className="group flex flex-col justify-center text-left w-full pl-7 min-h-[72px] relative focus:outline-none transition-all cursor-pointer select-none py-1"
                        id={`lane-btn-${cat.id}`}
                      >
                        {/* Interactive state indicator point centered at left-0 (co-aligned at top-1/2 -translate-y-1/2) */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center z-10">
                          {isActive ? (
                            <motion.div 
                              layoutId="activeCategoryDot"
                              className="w-2.5 h-2.5 rounded-full bg-neutral-950 ring-4 ring-neutral-950/15 z-10 shadow-sm"
                              transition={{ type: "spring", stiffness: 350, damping: 28 }}
                            />
                          ) : (
                            <div className="w-2 h-2 rounded-full border border-neutral-200 bg-white shadow-sm group-hover:border-neutral-400 group-hover:scale-110 transition-all duration-300" />
                          )}
                        </div>

                        {/* Title typography & visual feedback label */}
                        <div className={`space-y-0.5 transition-all duration-300 transform ${
                          isActive ? 'translate-x-1 pl-0.5' : 'opacity-80'
                        }`}>
                          <span className={`text-[9px] font-sans tracking-widest uppercase transition-colors duration-300 ${
                            isActive ? 'text-neutral-500 font-extrabold' : 'text-neutral-400 group-hover:text-neutral-500'
                          }`}>
                            0{idx + 1} / {cat.id.split('-')[0].slice(0, 8)}
                          </span>
                          <h3 className={`text-xs font-bold leading-snug tracking-tight transition-all duration-300 ${
                            isActive ? 'text-neutral-950 font-extrabold' : 'text-neutral-500 group-hover:text-neutral-700'
                          }`}>
                            {cat.name}
                          </h3>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Catalog Content Column */}
              <div className="flex-grow space-y-20 min-w-0">
                {filteredCategories.map((cat) => (
                  <div key={cat.id} className="space-y-6 scroll-mt-36" id={`category-block-${cat.id}`}>
                    {/* Category Label */}
                    <div className="pb-3 border-b border-neutral-200/80">
                      <h2 className="text-base font-extrabold text-neutral-950 tracking-tight">{cat.name}</h2>
                    </div>

                    {/* Sub-Services Details Grid: perfectly stacked and organized with auto-rows-fr */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                      {cat.services.map((svc) => (
                        <div 
                          key={svc.id} 
                          onClick={() => setSelectedSvc(svc)}
                          className="group relative overflow-hidden rounded-[14px] bg-white/40 backdrop-blur-xl border border-neutral-200/50 shadow-sm hover:shadow-[0_16px_32px_rgba(0,0,0,0.04)] hover:border-neutral-400/40 hover:-translate-y-0.5 active:scale-[0.985] transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between p-3.5 h-full min-h-[115px]"
                          id={`service-card-${svc.id}`}
                        >
                          {/* Quiet highlight glare sweep animation on hover */}
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-10" />

                          {/* Skill name structured directly without surrounding boxes */}
                          <div className="relative z-0 flex-1 flex items-center justify-start pb-3 pt-1.5">
                            <h3 className="font-extrabold text-xs sm:text-sm text-neutral-950 leading-snug tracking-tight text-left">
                              {svc.name}
                            </h3>
                          </div>

                          {/* Slider Button themed black (dark variant) exactly as requested */}
                          <div className="relative z-0 flex justify-start">
                            <SlideInButton 
                              variant="dark" 
                              className="w-full justify-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSvc(svc);
                              }}
                            >
                              Get Started
                            </SlideInButton>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>
      </section>

      {/* 3. Next.js Styled Vercel Block - Redirect to Contact Page */}
      <section className="relative border-t border-neutral-200 py-16 sm:py-20 bg-neutral-50 z-10" id="services-contact-redirect">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <span className="text-[10px] font-sans uppercase tracking-widest text-neutral-400 font-bold">Start a Direct Engagement</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            Have a Specific Technology Target in Mind?
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Skip the directory and speak with us directly. We deliver a custom technical blueprint and fixed budget specification within 48 hours. Let us design your roadmap.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onPageChange('contact')}
              className="inline-flex items-center gap-2 border border-neutral-900 bg-neutral-950 hover:bg-neutral-900 text-white font-semibold text-xs py-3 px-6 rounded-lg transition-all shadow-md cursor-pointer"
              id="services-to-contact-btn"
            >
              <MessageSquare size={13} />
              Discuss My Custom Requirements
            </button>
          </div>
        </div>
      </section>

      {/* 4. LATERAL SLIDE-OVER DETAILS PANEL - COMPLETELY BLURS THE ENTIRE BACKSTAGE VIEW */}
      <AnimatePresence>
        {selectedSvc && currentDetails && (
          <div className="fixed inset-0 z-50 overflow-hidden" id="service-details-panel-container">
            {/* Ambient Heavy Glass Backdrop Blur to 'blur everything around' */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={() => setSelectedSvc(null)}
              className="absolute inset-0 bg-neutral-950/25 backdrop-blur-xl pointer-events-auto cursor-pointer"
              id="details-backdrop-blur"
            />

            {/* Slide-In Modal Wrapper */}
            <div className="absolute inset-y-0 right-0 max-w-full pl-10 flex">
              <motion.div
                initial={{ x: "100%", opacity: 0.95 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0.95 }}
                transition={{ type: "spring", damping: 28, stiffness: 240, mass: 0.95 }}
                className="w-screen max-w-xl md:max-w-2xl bg-white/95 border-l border-neutral-200/50 shadow-[0_0_80px_rgba(0,0,0,0.15)] backdrop-blur-2xl flex flex-col h-full pointer-events-auto relative"
                id="details-panel-content"
              >
                {/* Header Section */}
                <div className="px-6 sm:px-10 py-6 border-b border-neutral-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                  <div />
                  <button
                    onClick={() => setSelectedSvc(null)}
                    className="p-2 text-neutral-400 hover:text-neutral-950 rounded-full hover:bg-neutral-100 transition-all duration-300 transform hover:rotate-90 cursor-pointer border border-neutral-200/40"
                    aria-label="Close Details Panel"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Main Scrollable content containing modular detailed panels */}
                <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 space-y-8 selection:bg-neutral-900 selection:text-white">
                  
                  {/* Hero Intro */}
                  <div className="space-y-3">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight leading-tight">
                      {currentDetails.title}
                    </h2>
                  </div>

                  {/* Overview Block */}
                  <section className="space-y-2">
                    <h3 className="text-xs font-sans uppercase tracking-widest text-neutral-400 font-semibold md:font-bold">Overview</h3>
                    <p className="text-sm font-sans leading-relaxed text-neutral-700">
                      {currentDetails.overview}
                    </p>
                  </section>

                  {/* Section: Frequently Asked Questions (Accordion) */}
                  <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-xs font-sans uppercase tracking-widest text-neutral-400 flex items-center gap-2 font-bold">
                      <HelpCircle size={13} className="text-neutral-450" />
                      FAQS
                    </h3>
                    <div className="divide-y divide-neutral-100">
                      {currentDetails.faqs.map((faq, idx) => {
                        const isOpen = activeFaqIndex === idx;
                        return (
                          <div key={idx} className="py-3">
                            <button
                              onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                              className="w-full flex items-center justify-between text-left font-sans font-bold text-xs text-neutral-900 transition-colors cursor-pointer py-1"
                            >
                              <span>{faq.question}</span>
                              <ChevronRight 
                                size={12} 
                                className={`text-neutral-450 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} 
                              />
                            </button>
                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25, ease: "easeInOut" }}
                                >
                                  <div className="pt-2 pb-1 text-xs leading-relaxed text-neutral-500 font-sans">
                                    {faq.answer}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                </div>

                {/* Drawer Footer Panel with primary engagement trigger */}
                <div className="p-6 sm:p-8 bg-neutral-50 border-t border-neutral-200/70 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="space-y-0.5 text-center sm:text-left">
                    <p className="text-neutral-950 font-bold text-xs animate-pulse">Ready to outline your scope?</p>
                    <p className="text-[10px] text-neutral-400">Receive custom specs and a fixed budget in 48 hours.</p>
                  </div>
                  <button
                    onClick={() => {
                      if (onOpenBookingModal) {
                        onOpenBookingModal(selectedSvc.name);
                      } else {
                        onPageChange('book');
                      }
                      setSelectedSvc(null);
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-950 text-white font-bold text-xs px-6 py-3.5 rounded-full hover:bg-neutral-900 active:scale-98 transition-all duration-200 shadow-md cursor-pointer animate-none"
                  >
                    <MessageSquare size={13} />
                    Start Project
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
  
    </div>
  );
}

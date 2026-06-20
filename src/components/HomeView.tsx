import React, { useState, useEffect, useMemo } from 'react';
import { ActivePage } from '../types';
import { 
  ArrowRight, ShieldCheck, Zap, Users, Trophy, Lightbulb, 
  HelpCircle, ChevronDown, CheckCircle2, MessageSquare, BookOpen,
  Cpu, Code2, Compass, TrendingUp, Cloud
} from 'lucide-react';
import { processSteps, businessResults, serviceCategories, articles as initialArticles } from '../data';
import { adminStore } from '../lib/admin-store';
import Globe3DDemo from './3d-globe-demo';
import { PinContainer } from './ui/3d-pin';
import { AnimatedTestimonials } from './ui/animated-testimonials';
import { Carousel, Card } from './ui/apple-cards-carousel';
import { BackgroundBeams } from './ui/background-beams';

import Carousel3D from './Carousel3D';

import { ImagesBadge } from './ui/images-badge';
import { CardContainer, CardBody, CardItem } from './ui/3d-card';
import { Button } from './ui/stateful-button';
import { CanvasText } from './ui/canvas-text';
import { SquigglyText } from './ui/squiggly-text';
import { FlipWords } from './ui/flip-words';
import OriginButton from './ui/OriginButton';
import SlideInButton from './ui/SlideInButton';
import CircleExpandButton from './ui/CircleExpandButton';
import { motion, AnimatePresence } from 'motion/react';

interface HomeViewProps {
  onPageChange: (page: ActivePage, serviceSlug?: string) => void;
  onOpenBookingModal?: (serviceName?: string) => void;
}

export default function HomeView({ onPageChange, onOpenBookingModal }: HomeViewProps) {
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

  const [openFaq, setOpenFaq] = React.useState<number | null>(null);
  const [slideIndex, setSlideIndex] = React.useState(0);
  const [selectedPrinciple, setSelectedPrinciple] = React.useState<number | null>(null);
  const [activeMetric, setActiveMetric] = React.useState(0);

  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);
  const [lightboxPlaying, setLightboxPlaying] = React.useState(false);

  const chatGptImages = React.useMemo(() => [
    "/ChatGPT Image Jun 16, 2026, 07_59_19 AM.png",
    "/ChatGPT Image Jun 16, 2026, 07_59_30 AM.png",
    "/ChatGPT Image Jun 16, 2026, 07_59_37 AM.png"
  ], []);

  React.useEffect(() => {
    let playTimer: any = null;
    if (lightboxOpen && lightboxPlaying) {
      playTimer = setInterval(() => {
        setLightboxIndex((prev) => (prev + 1) % chatGptImages.length);
      }, 3500);
    }
    return () => {
      if (playTimer) clearInterval(playTimer);
    };
  }, [lightboxOpen, lightboxPlaying, chatGptImages]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % 3);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % 4);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const homeFaqs = [
    {
      q: 'How does Hambar help businesses grow?',
      a: 'We evaluate your sales pipelines, web applications, and database processes to implement search engine optimization (SEO), workflow automations, and customer chatbots that scale buyer inquiries and cut manual processing costs.'
    },
    {
      q: 'Do Hamid Saleem and Babar Naeem oversee the software projects personally?',
      a: 'Yes. Our founders Hamid Saleem and Babar Naeem lead every discovery and tactical mapping workflow to guarantee your business receives high-tier technical governance.'
    },
    {
      q: 'What industries do you specialize in?',
      a: 'We specialize in Startups, Small Businesses, E-Commerce, Healthcare, SaaS, real estate, manufacturing, logistics, and professional business services.'
    },
    {
      q: 'What is the pricing model for software and development?',
      a: 'We operate using transparent, flat-rate, milestone-based pricing for development projects, ensuring your team has clear budget foresight. Strategic advisory is billed on part-time parameters.'
    }
  ];

  const trustElements = [
    { title: 'Open Communication', desc: 'No complex technical jargon. Clear status reports, plain-English metrics, and open codebase repositories from day one.', img: '/transparent communication.png' },
    { title: 'Business-driven Solution', desc: 'We prioritize investments that yield directly measurable return on investments (ROI), rather than adopting expensive tech defaults.', img: '/business focused.png' },
    { title: 'Long-term Support', desc: 'We stay with your business long after deployment to host, maintain, secure, and incrementally scale your databases.', img: '/longterm support.png' },
    { title: 'Strategic Planning', desc: 'We align raw technical blueprints precisely with your five-year corporate commercial growth and scaling targets.', img: '/strategic planning.png' }
  ];

  return (
    <div className="font-sans text-slate-800" id="home-view">
      
      {/* 1. Hero Section */}
      <section className="relative px-2 sm:px-4 pb-2 sm:pb-4 pt-0" id="hero-section">
        <div 
          className="relative bg-neutral-950 rounded-[2rem] overflow-hidden min-h-[600px] lg:min-h-[700px] flex items-center"
        >
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
          
          <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-20 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6 pt-20 lg:pt-0">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white font-sans leading-[1.1] flex flex-col gap-0 items-start select-none">
                <img 
                  src="/Copy of Copy of hambat (1).png" 
                  alt="Tech, AI & Softwares" 
                  className="h-11 sm:h-16 lg:h-24 w-auto object-contain select-none pointer-events-none self-start ml-0 sm:-ml-0.5 lg:-ml-1 -mb-1 sm:-mb-2 lg:-mb-3" 
                  referrerPolicy="no-referrer"
                />
                <span className="text-xl sm:text-2xl lg:text-5xl font-bold text-neutral-300 flex items-center gap-2 flex-nowrap whitespace-nowrap pt-0 mt-0">
                  for
                  <FlipWords
                    words={["Startups", "Growing Companies", "Established Businesses", "Enterprises"]}
                    duration={2500}
                    className="font-semibold text-white tracking-wide"
                  />
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-neutral-300 leading-relaxed max-w-lg">
                We help businesses to acquire more customers, optimize their process, implement AI technology, create robust software and scale easily
              </p>
              <div className="pt-8">
                <Button
                  onClick={async () => {
                    await new Promise(r => setTimeout(r, 600));
                    onPageChange('services');
                  }}
                  className="bg-brand hover:bg-brand-hover text-black rounded-full font-bold px-8 py-6 ring-brand min-w-[200px]"
                >
                  Buy a Service
                </Button>
              </div>
            </div>

            <div className="relative h-[400px] lg:h-[600px] flex items-center justify-center opacity-80 mix-blend-screen pointer-events-none sm:pointer-events-auto">
               <Globe3DDemo />
            </div>

          </div>
        </div>
      </section>

      {/* 2. Custom Slider Testimonials replacing masonry testimonials */}
      <section className="py-20 bg-white relative overflow-hidden" id="loved-by-universe">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Main Display container */}
          <div className="relative overflow-hidden bg-slate-50/60 border border-slate-100 rounded-[2.5rem] p-6 sm:p-10 md:p-14 min-h-[480px]">
            
            {/* Testimonials Slide Presenter */}
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {[
                  {
                    title: "MINI partners with Hambar to power its new era of auto-retail experience",
                    quote: "At MINI, we decided it was time to create an end-to-end purchasing and finance journey for the consumer, and it was important to create something more than a lead generator to facilitate the complete transaction for any MINI customer, any place, any time. Our partnership with Hambar has enabled us not only to catch up with industry leaders, but also to set new benchmarks in digital auto-retail, which the usual suspects in the industry could not provide.",
                    name: "Mike Peyton",
                    role: "Chief Motorer and Vice-President of MINI of the Americas",
                    image: "/mike_peyton.svg"
                  },
                  {
                    title: "Ikano Bank gains competitive edge with Hambar",
                    quote: "We are pleased to be working with Hambar as our strategic platform partner. Hambar's smart technology solutions are well-recognized in the finance and leasing space, and deploying our synchronized custom software integrations enables us to maintain a competitive edge in today's highly dynamic marketplace. With its powerful integration engines, Hambar will streamline our processes, enabling faster on-boarding of new partners and speed up new product introductions across markets.",
                    name: "Henrik Staulund",
                    role: "Chief Commercial Officer at Ikano Bank",
                    image: "/henrik.png"
                  },
                  {
                    title: "Haydock Finance finds success with Hambar's Marketplace",
                    quote: "I'd absolutely recommend both the custom software setups and the team at Hambar. The products are brilliant. It works fantastically well. And Hambar has been responsive to our needs. Quickly made any changes that we required.",
                    name: "Mike Boyes",
                    role: "Head of Vendor, Haydock Finance",
                    image: "/mike_boyes.webp",
                    showPlayButton: false
                  }
                ].map((item, idx) => {
                  if (idx !== slideIndex) return null;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
                    >
                      {/* Left: Text Details */}
                      <div className="lg:col-span-8 space-y-4 md:space-y-6 text-left">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight leading-snug font-sans">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-500 font-medium leading-relaxed font-sans max-w-3xl">
                          "{item.quote}"
                        </p>
                        <div className="pt-2 md:pt-4">
                          <h4 className="text-base sm:text-lg font-bold text-neutral-900 font-sans">
                            {item.name}
                          </h4>
                          <p className="text-xs sm:text-sm text-neutral-400 font-medium font-sans mt-0.5">
                            {item.role}
                          </p>
                        </div>
                      </div>

                      {/* Right: Picture Frame */}
                      <div className="lg:col-span-4 flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-[320px] aspect-square rounded-[2rem] overflow-hidden bg-neutral-100 border border-slate-200/50 shadow-md">
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover rounded-[2rem]"
                          />
                          {item.showPlayButton && (
                            <div className="absolute bottom-4 left-4 flex items-center justify-center">
                              <span className="h-10 w-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg border border-neutral-100 hover:scale-105 active:scale-95 duration-200 cursor-pointer">
                                <svg className="w-4 h-4 text-brand-dark fill-current ml-0.5" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Slider Progress Navigation dots precisely matching image style (horizontal bar design) */}
          <div className="flex justify-center items-center gap-2 mt-8 md:mt-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ease-out cursor-pointer ${
                  i === slideIndex
                    ? "w-10 bg-slate-800"
                    : "w-6 bg-slate-200 hover:bg-slate-300"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 2.5 Trust Elements section with 3D Pin */}
      <section className="py-24 bg-neutral-50 border-y border-neutral-100 overflow-hidden" id="trust-elements">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-4xl font-extrabold tracking-tight text-black">Our Principles</h2>
           </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 mt-10">
            {trustElements.map((el, idx) => {
              return (
                <div key={idx} className="flex items-center justify-center h-56 select-none">
                  <PinContainer title="Reveal Detail" href="#principles">
                     <div 
                       onClick={() => setSelectedPrinciple(idx)}
                       className="flex basis-full flex-col p-3 tracking-tight sm:basis-1/2 w-[16rem] h-[12.5rem] bg-white rounded-2xl border border-neutral-100 shadow-md overflow-hidden justify-between cursor-pointer hover:border-neutral-200 hover:shadow-lg transition-all"
                     >
                       <div className="h-[7.5rem] w-full rounded-xl overflow-hidden relative">
                         <img 
                           src={el.img} 
                           alt={el.title} 
                           referrerPolicy="no-referrer"
                           className="w-full h-full object-cover rounded-xl duration-500 hover:scale-105" 
                         />
                       </div>
                       <div className="pt-2">
                         <h3 className="text-sm font-extrabold text-black line-clamp-1">
                           {el.title}
                         </h3>
                         <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mt-1">Click to view details</span>
                       </div>
                     </div>
                  </PinContainer>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Featured Services Section (Solid clean dark theme background) */}
      <section className="relative p-2 sm:p-4" id="featured-services">
        <div className="relative bg-[#090909] text-white rounded-[2rem] overflow-hidden py-16 lg:py-24 border border-neutral-800 shadow-2xl">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">Our High-Demand Services</h2>
              <p className="text-neutral-400 mt-3 text-sm leading-relaxed">
                Click on any skill column or direct capabilities below for more information, timelines, and price estimates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {serviceCategories
                .filter((cat) => cat.id !== 'strategy') // Goal 1: Remove "Strategic IT & AI Consulting" from homepage
                .map((cat) => {
                  // Goal 3: Minimalist card heading mappings
                  const minimalTitles: Record<string, string> = {
                    'ai-automation': 'AI & Automation',
                    'dev': 'Web & App Dev',
                    'custom-software': 'Custom Software',
                    'growth': 'Growth & SEO',
                    'design-product': 'Design & Prototyping',
                    'quality-security': 'Security & QA',
                    'cloud': 'Cloud & Infrastructure',
                    'data-tech': 'Data & Analytics',
                    'support': 'Support & Maintenance'
                  };

                  return (
                    <div 
                      key={cat.id} 
                      className="group/card p-6 bg-[#0d0d0d]/80 border border-neutral-900/40 rounded-3xl flex flex-col justify-between transition-all duration-300 hover:border-neutral-800 backdrop-blur-md shadow-xl"
                    >
                      <div className="space-y-5">
                        {/* Goal 2: Removed completely the yellow SVG icon, leaving a pure elegant minimal header */}
                        {/* Goal 3: Increased font size to text-2xl sm:text-3xl for bold prominence */}
                        <div className="flex items-center min-h-[36px]">
                          <h3 className="font-extrabold text-white text-2xl sm:text-2xl tracking-tight leading-snug group-hover/card:text-white transition-colors duration-300">
                            {minimalTitles[cat.id] || cat.name}
                          </h3>
                        </div>

                        {/* Goal 3: List only important services (limit to top 3) using premium animated SlideInButtons */}
                        <div className="space-y-3 pt-5 border-t border-neutral-900">
                          {cat.services.slice(0, 3).map((s) => (
                            <SlideInButton
                              key={s.id}
                              variant="pill-dark"
                              align="left"
                              rounded="xl"
                              className="w-full text-[13px] h-11"
                              onClick={() => onPageChange('services', s.id)}
                            >
                              {s.name}
                            </SlideInButton>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="text-center mt-12 pb-2">
              <SlideInButton
                onClick={() => onPageChange('services')}
                variant="pill-dark"
                align="center"
                rounded="xl"
                className="px-8 py-3.5 h-12 inline-flex max-w-sm mx-auto"
              >
                Learn More & View All Services
              </SlideInButton>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why Businesses Choose Us - 3D Card */}
      <section className="py-24 bg-slate-50 border-y border-slate-100 overflow-hidden" id="why-choose-us">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CardContainer className="inter-var">
            <CardBody className="bg-white relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full max-w-[92vw] sm:max-w-[45rem] lg:max-w-[65rem] h-auto rounded-xl p-8 lg:p-16 border space-y-8 lg:space-y-12 mx-auto">
              <div className="max-w-2xl mx-auto text-center space-y-6">
                <CardItem translateZ="50" className="text-4xl lg:text-5xl font-extrabold text-black dark:text-white leading-tight mx-auto">
                  Why Growing Companies Partner with Us:
                </CardItem>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-10">
                <CardItem translateZ="40" className="w-full">
                  <div className="relative h-[380px] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-end p-8 group/item border border-white/5 select-none text-left">
                    {/* Background Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover/item:scale-105"
                      style={{ backgroundImage: "url('/outcome first.png')" }}
                    />
                    {/* Premium Radial Dark Overlays to ensure great contrast and readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/20 transition-opacity duration-300 group-hover/item:opacity-90" />
                    
                    {/* Text Content elevated & styled */}
                    <div className="relative z-10 transition-transform duration-300 group-hover/item:-translate-y-2">
                      <h4 className="font-extrabold text-2xl text-white mb-3 group-hover/item:text-brand transition-colors tracking-tight">
                        Execution Based On Outcome
                      </h4>
                      <p className="text-neutral-300 text-sm leading-relaxed">
                        We gauge success based on time saved, inquiries generated, and locked-down database parameters.
                      </p>
                    </div>
                  </div>
                </CardItem>
                <CardItem translateZ="60" className="w-full">
                  <div className="relative h-[380px] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-end p-8 group/item border border-white/5 select-none text-left">
                    {/* Background Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover/item:scale-105"
                      style={{ backgroundImage: "url('/deep technical.png')" }}
                    />
                    {/* Premium Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/20 transition-opacity duration-300 group-hover/item:opacity-90" />
                    
                    {/* Text Content elevated & styled */}
                    <div className="relative z-10 transition-transform duration-300 group-hover/item:-translate-y-2">
                      <h4 className="font-extrabold text-2xl text-white mb-3 group-hover/item:text-brand transition-colors tracking-tight">
                        Technical Expertise
                      </h4>
                      <p className="text-neutral-300 text-sm leading-relaxed">
                        Our team conducts code audits, creates sandboxed AI, and optimizes cloud nodes.
                      </p>
                    </div>
                  </div>
                </CardItem>
                <CardItem translateZ="80" className="w-full">
                  <div className="relative h-[380px] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-end p-8 group/item border border-white/5 select-none text-left">
                    {/* Background Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover/item:scale-105"
                      style={{ backgroundImage: "url('/client asset.png')" }}
                    />
                    {/* Premium Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/20 transition-opacity duration-300 group-hover/item:opacity-90" />
                    
                    {/* Text Content elevated & styled */}
                    <div className="relative z-10 transition-transform duration-300 group-hover/item:-translate-y-2">
                      <h4 className="font-extrabold text-2xl text-white mb-3 group-hover/item:text-brand transition-colors tracking-tight">
                        Protection of Our Clients' Assets
                      </h4>
                      <p className="text-neutral-300 text-sm leading-relaxed">
                        We build software pieces to ensure that our client assets do not leak into the public models.
                      </p>
                    </div>
                  </div>
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
        </div>
      </section>

      {/* 5. Business Results & Benefits (The Metric Section) */}
      <section className="relative py-24 bg-white" id="business-results">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-slate-950">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-neutral-900 tracking-tight">Measurable Business Benefits</h2>
          </div>

          {/* Actual Stats Panel arranged as a premium 3-column display aligning title left, Apple Watch center, and points right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-5xl mx-auto py-10">
            
            {/* COLUMN 1: Concisely styled title + raw value metric on the LEFT of the Watch */}
            <div className="lg:col-span-3 text-center lg:text-right space-y-4 lg:-translate-x-12 h-full flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`left-stat-title-${activeMetric}`}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="space-y-4"
                >
                  <div className="text-6xl sm:text-7xl font-sans font-black tracking-tight text-black leading-none">
                    {businessResults[activeMetric].metric}
                  </div>
                  <h3 className="text-2xl font-black text-black tracking-tight leading-snug">
                    {businessResults[activeMetric].title}
                  </h3>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* COLUMN 2: Highly Realistic Apple Watch Model Centered */}
            <div className="lg:col-span-6 flex items-center justify-center py-16 relative">
              <div className="flex items-center justify-center select-none w-full relative h-[450px] max-w-xs mx-auto">

                {/* Central Watch Case with nested straps */}
                <div className="relative z-10 flex items-center justify-center">
                  
                  <div className="relative w-[210px] h-[245px]">
                    {/* Pastel Sage-Mint Matte Vertical Strap (Top) integrated beneath casing */}
                    <div className="absolute bottom-[232px] left-1/2 -translate-x-1/2 w-[102px] h-[135px] bg-gradient-to-b from-[#e3f4ee] via-[#daf1e7] to-[#cbdcd3] rounded-t-[2.5rem] shadow-[inset_0_-14px_20px_rgba(0,0,0,0.06),inset_0_4px_6px_rgba(255,255,255,0.85)] border-x border-t border-black/5 z-0" />
                    
                    {/* Pastel Sage-Mint Matte Vertical Strap (Bottom) integrated beneath casing */}
                    <div className="absolute top-[232px] left-1/2 -translate-x-1/2 w-[102px] h-[135px] bg-gradient-to-t from-[#e3f4ee] via-[#daf1e7] to-[#cbdcd3] rounded-b-[2.5rem] shadow-[inset_0_14px_20px_rgba(0,0,0,0.06),inset_0_-4px_6px_rgba(255,255,255,0.85)] border-x border-b border-black/5 z-0 flex flex-col items-center justify-start pt-8">
                      {/* Tactile adjustment holes */}
                      <div className="flex flex-col gap-3.5 items-center opacity-85">
                        <div className="w-2.5 h-2.5 rounded-full bg-black/15 shadow-[inset_0_1.5px_3.0px_rgba(0,0,0,0.35),0_1px_1px_rgba(255,255,255,0.6)]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-black/15 shadow-[inset_0_1.5px_3.0px_rgba(0,0,0,0.35),0_1px_1px_rgba(255,255,255,0.6)]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-black/15 shadow-[inset_0_1.5px_3.0px_rgba(0,0,0,0.35),0_1px_1px_rgba(255,255,255,0.6)]" />
                      </div>
                    </div>

                    {/* Outer layer is polished metal casing frame - curved squircle, overlays above straps */}
                    <div className="relative w-full h-full z-10 rounded-[3.8rem] bg-gradient-to-tr from-neutral-400 via-neutral-100 to-neutral-400 p-[6.5px] shadow-[0_45px_100px_-20px_rgba(0,0,0,0.7),0_15px_30px_-5px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.85),inset_0_-2px_4px_rgba(0,0,0,0.4)] border border-neutral-300 flex items-center justify-center">
                      
                      {/* Inner crystal display bezel perimeter */}
                      <div className="w-full h-full rounded-[3.45rem] bg-black p-[2px] flex items-center justify-center relative shadow-lg">
                        
                        {/* Inner screen glass surface */}
                        <div className="w-full h-full rounded-[3.35rem] bg-[#020202] p-[5px] relative overflow-hidden flex flex-col justify-between border border-neutral-950 shadow-inner">
                          
                          {/* 2.5D Curved Glass Screen Reflection Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.12] pointer-events-none rounded-[3.35rem] z-30" />
                          <div className="absolute top-0 inset-x-8 h-2.5 bg-gradient-to-b from-white/[0.18] to-transparent rounded-full filter blur-[1px] pointer-events-none z-30" />

                          {/* Interactive Watch Corner Complication Buttons - neutral dark tone with absolutely NO colorful backgrounds or states */}
                          {/* Top Left Complication */}
                          <button 
                            onClick={() => setActiveMetric(0)} 
                            className={`absolute top-[14px] left-[14px] w-[32px] h-[32px] rounded-full flex items-center justify-center transition-all z-20 shadow-md ${
                              activeMetric === 0 
                                ? 'bg-[#1c1c1e] border border-white/35 scale-105 shadow-[0_0_8px_rgba(255,255,255,0.15)]' 
                                : 'bg-[#141415]/90 border border-white/15 hover:border-white/30'
                            }`}
                            title="Tasks KPI Indicator"
                          >
                            <div className="flex items-end gap-[1.5px] h-3">
                              <div className="w-[1.5px] rounded-full transition-all h-1.5 bg-white/90" />
                              <div className="w-[1.5px] rounded-full transition-all h-3 bg-white/90" />
                              <div className="w-[1.5px] rounded-full transition-all h-2 bg-white/90" />
                              <div className="w-[1.5px] rounded-full transition-all h-2.5 bg-white/90" />
                              <div className="w-[1.5px] rounded-full transition-all h-1 bg-white/90" />
                            </div>
                          </button>

                          {/* Top Right Complication */}
                          <button 
                            onClick={() => setActiveMetric(1)} 
                            className={`absolute top-[14px] right-[14px] w-[32px] h-[32px] rounded-full flex items-center justify-center transition-all z-20 shadow-md ${
                              activeMetric === 1 
                                ? 'bg-[#1c1c1e] border border-white/35 scale-105 shadow-[0_0_8px_rgba(255,255,255,0.15)]' 
                                : 'bg-[#141415]/90 border border-white/15 hover:border-white/30'
                            }`}
                            title="Support KPI Indicator"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-white">
                              <path d="M4 17l4-4 4 2 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                              <circle cx="20" cy="7" r="2.5" fill="currentColor" />
                            </svg>
                          </button>

                          {/* Bottom Left Complication */}
                          <button 
                            onClick={() => setActiveMetric(2)} 
                            className={`absolute bottom-[14px] left-[14px] w-[32px] h-[32px] rounded-full flex items-center justify-center transition-all z-20 shadow-md ${
                              activeMetric === 2 
                                ? 'bg-[#1c1c1e] border border-white/35 scale-105 shadow-[0_0_8px_rgba(255,255,255,0.15)]' 
                                : 'bg-[#141415]/90 border border-white/15 hover:border-white/30'
                            }`}
                            title="ROI KPI Indicator"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="3.5" />
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            </svg>
                          </button>

                          {/* Bottom Right Complication */}
                          <button 
                            onClick={() => setActiveMetric(3)} 
                            className={`absolute bottom-[14px] right-[14px] w-[32px] h-[32px] rounded-full flex items-center justify-center transition-all z-20 shadow-md ${
                              activeMetric === 3 
                                ? 'bg-[#1c1c1e] border border-white/35 scale-105 shadow-[0_0_8px_rgba(255,255,255,0.15)]' 
                                : 'bg-[#141415]/90 border border-white/15 hover:border-white/30'
                            }`}
                            title="Downtime KPI Indicator"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                              <path d="M12 2L2 7l10 5 10-5-10-5z" />
                              <path d="M2 17l10 5 10-5" />
                              <path d="M12 22V12" />
                            </svg>
                          </button>

                          {/* Watch Top Center Time - Beautifully thinner font */}
                          <div className="relative z-10 flex justify-center pt-2 select-none pointer-events-none">
                            <span className="font-sans text-[10px] font-medium tracking-widest text-[#f5f5f7]/90">10:09</span>
                          </div>

                          {/* Watch Center Core Rings area - Circles fit the screen beautifully with bold, thick circles and clear non-colliding gaps */}
                          <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-2">
                            
                            <div className="relative w-[155px] h-[155px] flex items-center justify-center">
                              
                              <svg className="w-full h-full transform -rotate-90 scale-[1.14]" viewBox="0 0 100 100">

                                {/* Outer Vibrant Pink/Red Ring - Bolder and Thicker stroke */}
                                <circle cx="50" cy="50" r="43" strokeWidth="11" stroke="#ef4444" strokeOpacity="0.15" fill="none" />
                                <motion.circle 
                                  cx="50" cy="50" r="43" 
                                  strokeWidth="11" 
                                  stroke="#ef4444" 
                                  strokeDasharray="270.18"
                                  animate={{ strokeDashoffset: 270.18 - (270.18 * [0.85, 0.45, 0.70, 0.35][activeMetric]) }}
                                  transition={{ type: "spring", stiffness: 60, damping: 13 }}
                                  strokeLinecap="round" 
                                  fill="none" 
                                />
                                
                                {/* Middle Neon Lime-Green Ring - Bolder and Thicker stroke */}
                                <circle cx="50" cy="50" r="31" strokeWidth="11" stroke="#a1ff00" strokeOpacity="0.15" fill="none" />
                                <motion.circle 
                                  cx="50" cy="50" r="31" 
                                  strokeWidth="11" 
                                  stroke="#a1ff00" 
                                  strokeDasharray="194.78"
                                  animate={{ strokeDashoffset: 194.78 - (194.78 * [0.45, 0.90, 0.60, 0.40][activeMetric]) }}
                                  transition={{ type: "spring", stiffness: 60, damping: 13 }}
                                  strokeLinecap="round" 
                                  fill="none" 
                                />

                                {/* Inner Electric Cyan Ring - Bolder and Thicker stroke */}
                                <circle cx="50" cy="50" r="19" strokeWidth="11" stroke="#00f0ff" strokeOpacity="0.15" fill="none" />
                                <motion.circle 
                                  cx="50" cy="50" r="19" 
                                  strokeWidth="11" 
                                  stroke="#00f0ff" 
                                  strokeDasharray="119.38"
                                  animate={{ strokeDashoffset: 119.38 - (119.38 * [0.70, 0.35, 0.85, 0.95][activeMetric]) }}
                                  transition={{ type: "spring", stiffness: 60, damping: 13 }}
                                  strokeLinecap="round" 
                                  fill="none" 
                                />

                                {/* 12-o-clock Arrow Glyphs matching concentric radii perfectly */}
                                <g transform="translate(50, 7)">
                                  <circle r="4" fill="#ef4444" />
                                  <path d="M-1 0 h2 M0 -1 l1 1l-1 1" stroke="white" strokeWidth="0.85" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                </g>
                                <g transform="translate(50, 19)">
                                  <circle r="4" fill="#a1ff00" />
                                  <path d="M-1.2 -1 L0 0 L-1.2 1 M0.4 -1 L1.6 0 L0.4 1" stroke="black" strokeWidth="0.95" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                </g>
                                <g transform="translate(50, 31)">
                                  <circle r="4" fill="#00f0ff" />
                                  <path d="M0 1.2 v-2.4 M-1 -0.2 L0 -1.2 L1 -0.2" stroke="black" strokeWidth="0.95" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                </g>
                              </svg>

                            </div>
                          </div>

                        </div>

                      </div>
                    </div>

                    {/* Highly-integrated physical digital crown pushed a bit right to look completely natural */}
                    <button
                      onClick={() => setActiveMetric((prev) => (prev + 1) % 4)}
                      className="absolute left-[208.5px] top-[24%] w-[12px] h-[46px] bg-gradient-to-b from-neutral-600 via-neutral-100 to-[#1e1e1f] rounded-r-[5.5px] shadow-[3px_1px_5px_rgba(0,0,0,0.45)] border border-neutral-400 border-l-0 flex flex-col justify-between py-1.5 items-center cursor-pointer select-none active:scale-95 duration-75 z-20"
                      title="Click crown to cycle stats"
                    >
                      <div className="w-[8px] h-[1px] bg-neutral-900 opacity-65" />
                      <div className="w-[8px] h-[1px] bg-neutral-900 opacity-65" />
                      <div className="w-[8px] h-[1px] bg-neutral-900 opacity-65" />
                      <div className="w-[8px] h-[1px] bg-neutral-900 opacity-65" />
                      <div className="w-[8px] h-[1px] bg-neutral-900 opacity-65" />
                      <div className="w-[8px] h-[1px] bg-neutral-900 opacity-65" />
                    </button>

                  </div>

                </div>

              </div>
            </div>

            {/* COLUMN 3: Concise 2-3 bullet description points on the RIGHT of the Watch (one-line long each, smaller and placed closer to the watch frame) */}
            <div className="lg:col-span-3 text-left space-y-4 pl-6 lg:pl-4 lg:translate-x-0 h-full flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`right-stat-desc-${activeMetric}`}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="min-h-[120px] flex flex-col justify-center"
                >
                  <div className="space-y-4 font-sans text-neutral-800 text-xs font-normal leading-relaxed">
                    {activeMetric === 0 && (
                      <ul className="space-y-3.5 list-none">
                        <li className="flex items-start gap-2.5">
                          <span className="text-black text-xs leading-none mt-1">•</span>
                          <span>Migrates manual spreadsheet workflows into continuous cloud processes.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-black text-xs leading-none mt-1">•</span>
                          <span>Configures automated background timer runs with no human logging.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-black text-xs leading-none mt-1">•</span>
                          <span>Replaces tedious key calculations with reliable scheduled code engines.</span>
                        </li>
                      </ul>
                    )}
                    {activeMetric === 1 && (
                      <ul className="space-y-3.5 list-none">
                        <li className="flex items-start gap-2.5">
                          <span className="text-black text-xs leading-none mt-1">•</span>
                          <span>Launches 24/7 web assistants fully trained on specialized manuals.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-black text-xs leading-none mt-1">•</span>
                          <span>Triage general support queries instantly without human intervention.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-black text-xs leading-none mt-1">•</span>
                          <span>Routes complex edge tasks seamlessly to executives with transcripts.</span>
                        </li>
                      </ul>
                    )}
                    {activeMetric === 2 && (
                      <ul className="space-y-3.5 list-none">
                        <li className="flex items-start gap-2.5">
                          <span className="text-black text-xs leading-none mt-1">•</span>
                          <span>Funnels web inbound traffic onto custom-built landing portals.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-black text-xs leading-none mt-1">•</span>
                          <span>Captures highly specific long-tail buyer search intent campaigns.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-black text-xs leading-none mt-1">•</span>
                          <span>Tracks clear numeric sales conversion metrics to optimize budgets.</span>
                        </li>
                      </ul>
                    )}
                    {activeMetric === 3 && (
                      <ul className="space-y-3.5 list-none">
                        <li className="flex items-start gap-2.5">
                          <span className="text-black text-xs leading-none mt-1">•</span>
                          <span>Distributes raw server traffic balances across multiple regions.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-black text-xs leading-none mt-1">•</span>
                          <span>Prepares offsite virtual machine disk snapshots automatically.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-black text-xs leading-none mt-1">•</span>
                          <span>Flares dynamic paging sirens immediately if anomalies arise.</span>
                        </li>
                      </ul>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* 6. AI & Digital Transformation Section */}
      <section className="py-24 bg-white overflow-hidden" id="ai-transformation-about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-black tracking-tight leading-tight">
              AI Implementation and Cloud Migration:
            </h2>
            <p className="text-neutral-500 text-sm md:text-base tracking-tight max-w-2xl mx-auto leading-normal">
              Connecting your existing legacy system with generative AI and secure cloud hosting.
            </p>
          </div>

          {/* Centered Folder Connection Diagram */}
          <div className="relative w-full max-w-[680px] h-[300px] mx-auto flex items-center justify-center select-none bg-transparent mb-8">
            
            {/* SVG Connecting Lines and Dots */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              {/* Top-Left Connection */}
              <motion.line 
                x1="28%" y1="28%" x2="43%" y2="44%" 
                stroke="#000000" strokeWidth="1.2" strokeOpacity="0.35" 
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              <circle cx="28%" cy="28%" r="3" fill="#000000" opacity="0.5" />
              <circle cx="43%" cy="44%" r="1.5" fill="#000000" opacity="0.35" />

              {/* Top-Right Connection */}
              <motion.line 
                x1="72%" y1="28%" x2="57%" y2="44%" 
                stroke="#000000" strokeWidth="1.2" strokeOpacity="0.35" 
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              <circle cx="72%" cy="28%" r="3" fill="#000000" opacity="0.5" />
              <circle cx="57%" cy="44%" r="1.5" fill="#000000" opacity="0.35" />

              {/* Bottom-Left Connection */}
              <motion.line 
                x1="28%" y1="72%" x2="43%" y2="56%" 
                stroke="#000000" strokeWidth="1.2" strokeOpacity="0.35" 
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              <circle cx="28%" cy="72%" r="3" fill="#000000" opacity="0.5" />
              <circle cx="43%" cy="56%" r="1.5" fill="#000000" opacity="0.35" />

              {/* Bottom-Right Connection */}
              <motion.line 
                x1="72%" y1="72%" x2="57%" y2="56%" 
                stroke="#000000" strokeWidth="1.2" strokeOpacity="0.35" 
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              <circle cx="72%" cy="72%" r="3" fill="#000000" opacity="0.5" />
              <circle cx="57%" cy="56%" r="1.5" fill="#000000" opacity="0.35" />
            </svg>

            {/* Central Animated Folder (No box, no text, perfectly transparent background) */}
            <div 
              className="absolute z-10 cursor-pointer pointer-events-auto group/folder flex flex-col items-center"
              onClick={() => {
                setLightboxIndex(0);
                setLightboxOpen(true);
                setLightboxPlaying(true); // Start autoplay automatically on click for a delightful experience
              }}
              title="Click to play showcase"
            >
              <ImagesBadge 
                text="" 
                images={chatGptImages}
                folderSize={{ width: 85, height: 62 }}
                teaserImageSize={{ width: 52, height: 38 }}
                hoverImageSize={{ width: 115, height: 80 }}
                className="bg-transparent hover:bg-transparent p-0 border-0 shadow-none ring-0 pointer-events-auto cursor-pointer flex items-center justify-center transition-transform hover:scale-110 active:scale-95 duration-300"
              />
            </div>

            {/* Surrounding 4 Points - Names Only */}
            {/* Top-Left: Customer Chatbots */}
            <div className="absolute left-[0%] md:left-[3%] top-[20%] text-left z-20">
              <span className="text-black font-extrabold text-xs sm:text-sm md:text-base tracking-tight select-none">
                Customer Chatbots
              </span>
            </div>

            {/* Top-Right: Workflow Automation */}
            <div className="absolute right-[0%] md:right-[3%] top-[20%] text-right z-20">
              <span className="text-black font-extrabold text-xs sm:text-sm md:text-base tracking-tight select-none">
                Workflow Automation
              </span>
            </div>

            {/* Bottom-Left: Contextual Search */}
            <div className="absolute left-[0%] md:left-[3%] bottom-[20%] text-left z-20">
              <span className="text-black font-extrabold text-xs sm:text-sm md:text-base tracking-tight select-none">
                Contextual Search
              </span>
            </div>

            {/* Bottom-Right: Executive Advisory */}
            <div className="absolute right-[0%] md:right-[3%] bottom-[20%] text-right z-20">
              <span className="text-black font-extrabold text-xs sm:text-sm md:text-base tracking-tight select-none">
                Executive Advisory
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Industries We Serve (Quick Preview) */}
      <section className="py-24 bg-neutral-50 border-t border-neutral-100" id="industries-serve-preview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
             <h2 className="text-4xl font-extrabold text-black tracking-tight">Structured For Your Industry</h2>
             <p className="text-neutral-600 mt-4 text-base leading-relaxed">We solve issues in different industries.</p>
          </div>

          <Carousel3D items={[
            { title: "Startups", img: "/startups.png" },
            { title: "E-Commerce", img: "/ecommerce.png" },
            { title: "Small Businesses", img: "/small business.png" },
            { title: "Healthcare Providers", img: "/healthcare providers.png" },
            { title: "SaaS Platforms", img: "/saaas platforms.png" }
          ].map((ind, idx) => (
             <div 
               key={idx} 
               className="relative h-[420px] w-full rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 border border-neutral-800/25 group flex flex-col justify-center items-center p-10 select-none text-center"
             >
               {/* Background Image */}
               <img 
                 src={ind.img} 
                 alt={ind.title}
                 referrerPolicy="no-referrer"
                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
               />
               
               {/* Premium Dark Overlay */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/50 transition-opacity duration-300 group-hover:opacity-90" />
               
               {/* Accent Ring */}
               <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none group-hover:border-brand/20 transition-colors duration-300" />

               {/* Text Content */}
               <div className="relative z-10 transition-transform duration-300 group-hover:translate-y-[-4px] flex flex-col items-center justify-center">
                 <h3 className="font-extrabold text-5xl sm:text-6xl text-white mb-4 group-hover:text-brand transition-colors tracking-tight">
                   {ind.title}
                 </h3>
               </div>
             </div>
          ))} autoPlay={false} />

          <div className="text-center mt-12">
            <Button
              onClick={async () => { await new Promise(r => setTimeout(r, 600)); onPageChange('industries'); }}
              className="bg-black text-white hover:bg-neutral-800 rounded-full font-bold px-8 py-6 ring-black mx-auto"
            >
              See Industry Profiles
            </Button>
          </div>
        </div>
      </section>

      {/* 8. Our Process Section - Apple Cards Carousel */}
      <section className="py-16 bg-neutral-50 border-y border-neutral-100 overflow-hidden" id="our-process-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight mt-1">Our 4-Step Structured Approach</h2>
          </div>

          <Carousel items={processSteps.map((p, i) => {
             const mockImages = [
               "/1.png",
               "/2.png",
               "/3.png",
               "/4.png"
             ];
             return (
              <Card 
                 key={i} 
                 index={i} 
                 card={{
                   category: p.step,
                   title: p.title,
                   src: mockImages[i % mockImages.length],
                   content: (
                     <div className="p-8 bg-neutral-100 rounded-2xl dark:bg-neutral-800">
                       <p className="text-xl font-bold text-black dark:text-white mb-4">{p.title}</p>
                       <p className="text-neutral-600 dark:text-neutral-300">{p.desc}</p>
                     </div>
                   )
                 }} 
              />
             );
          })} />
        </div>
      </section>

      {/* 9. Latest Digital Magazine Articles with Background Beams */}
      <section className="relative py-24 bg-neutral-950 border-b border-neutral-900 overflow-hidden" id="latest-magazine-articles">
        <BackgroundBeams className="z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">The Digital Magazine</h2>
              <p className="text-neutral-400 mt-2 text-sm leading-relaxed">
                Objective strategic guidance and case overviews published regularly by our founders.
              </p>
            </div>
            <button
              onClick={() => onPageChange('magazine')}
              className="inline-flex items-center gap-1 px-4 py-2 bg-brand text-black hover:bg-brand-hover rounded text-xs font-bold transition-all cursor-pointer"
            >
              Read Full Magazine <ArrowRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((art) => (
              <div key={art.id} className="bg-black/60 backdrop-blur-md rounded-2xl border border-neutral-800/50 overflow-hidden flex flex-col justify-between hover:border-neutral-700 transition-colors z-20">
                {art.imageUrl && (
                  <img src={art.imageUrl} alt={art.title} className="w-full h-40 object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => onPageChange('magazine')} />
                )}
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400">
                    <span className="uppercase font-semibold text-brand bg-brand/10 px-2 py-1 rounded">{art.category}</span>
                    <span className="font-sans">{art.readTime}</span>
                  </div>
                  <h3 className="font-bold text-white text-lg leading-snug cursor-pointer hover:text-brand transition-colors" onClick={() => onPageChange('magazine')}>
                    {art.title}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3">{art.excerpt}</p>
                </div>
                <div className="p-6 pt-0 border-t border-neutral-800/50 flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <img src={art.author.avatar} alt={art.author.name} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                    <div>
                      <p className="text-xs font-bold text-neutral-200 leading-none">{art.author.name}</p>
                      <p className="text-[10px] text-neutral-500 leading-none mt-1">{art.author.role}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-neutral-500 font-mono">{art.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Frequently Asked Questions (Black Themed) */}
      <section className="py-24 bg-neutral-950 text-white border-t border-neutral-900" id="home-faqs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-5xl font-extrabold tracking-tight leading-tight text-white">Frequently Asked Questions</h2>
            </div>
            <div className="lg:col-span-7 space-y-4">
              {homeFaqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={index} className="border-b border-neutral-850 last:border-0 pl-0 lg:pl-8 pb-4">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex justify-between items-center py-4 text-left font-bold text-xl text-white hover:text-brand transition-colors focus:outline-none"
                    >
                      <span>{faq.q}</span>
                      <motion.div
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        className="text-brand shrink-0 ml-4"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-neutral-400 pb-6 pr-12 leading-relaxed">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 11. Final Call To Action */}
      <section className="py-24 bg-black text-white text-center relative overflow-hidden" id="final-cta-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
          <h2 className="text-5xl lg:text-7xl font-extrabold tracking-tight">
            <SquigglyText
              stepDuration={80}
              scale={[4, 6]}
              className="text-white"
            >
              Accelerate
            </SquigglyText>{" "}
            <SquigglyText
              stepDuration={70}
              scale={[4, 6]}
              className="text-white"
            >
              Scale.
            </SquigglyText>
          </h2>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto leading-relaxed">
            Start your specialized services. Get flat-rates milestones engineering directly from our co-founders.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-6">
            <Button
              onClick={async () => { 
                await new Promise(r => setTimeout(r, 600)); 
                if (onOpenBookingModal) {
                  onOpenBookingModal();
                } else {
                  onPageChange('book'); 
                }
              }}
              className="bg-white text-black hover:bg-neutral-200 font-extrabold rounded-full px-10 py-6"
            >
              Start My Project
            </Button>
            <button
              onClick={() => onPageChange('contact')}
              className="hover:text-brand text-neutral-300 font-bold transition-all cursor-pointer underline underline-offset-8"
            >
              Inquire via Contact Form
            </button>
          </div>
        </div>
      </section>

      {/* Principle Detail Modal */}
      <AnimatePresence>
        {selectedPrinciple !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPrinciple(null)}
              className="absolute inset-0 bg-black backdrop-blur-sm shadow-xl"
            />
            
            {/* Modal Body */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl relative border border-neutral-150 z-10"
            >
              <div className="h-48 w-full relative">
                <img 
                  src={trustElements[selectedPrinciple].img}
                  alt={trustElements[selectedPrinciple].title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => setSelectedPrinciple(null)}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 backdrop-blur-md transition-colors border border-white/10 cursor-pointer"
                  aria-label="Close modal"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-8 space-y-3">
                <h3 className="text-2xl font-extrabold text-black font-sans tracking-tight">
                  {trustElements[selectedPrinciple].title}
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed font-sans">
                  {trustElements[selectedPrinciple].desc}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Playback Lightbox for AI Adoption Mockups */}
      <AnimatePresence>
        {lightboxOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop with Blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxOpen(false)}
              className="absolute inset-0 bg-neutral-950/90 backdrop-blur-xl cursor-zoom-out"
            />

            {/* Lightbox Container */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-5xl bg-neutral-900/60 rounded-[2rem] border border-neutral-800/80 p-6 md:p-8 flex flex-col items-center gap-6 z-10 overflow-hidden shadow-2xl backdrop-blur-md"
            >
              {/* Decorative radial background light */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />

              {/* Top Bar (Title & Close Button) */}
              <div className="relative w-full flex items-center justify-between pb-4 border-b border-neutral-800/60 z-10">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1.5 pl-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-red-500/80 block"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-yellow-500/80 block"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-green-500/80 block"></span>
                  </div>
                  <span className="text-xs md:text-sm font-mono tracking-wider text-neutral-400 uppercase font-bold">
                    Interactive Showcase • Screenshot {lightboxIndex + 1} of {chatGptImages.length}
                  </span>
                </div>
                
                <button 
                  onClick={() => setLightboxOpen(false)}
                  className="bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-300 hover:text-white rounded-full p-2.5 transition-colors border border-neutral-700/60 cursor-pointer shadow-lg active:scale-90"
                  aria-label="Close showcase"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Main Image View and Left/Right Arrows */}
              <div className="relative w-full flex-[1] min-h-[300px] md:min-h-[460px] max-h-[60vh] flex items-center justify-center group z-10 select-none">
                
                {/* Left Arrow */}
                <button
                  onClick={() => {
                    setLightboxIndex((prev) => (prev === 0 ? chatGptImages.length - 1 : prev - 1));
                    setLightboxPlaying(false); // pause on manual interaction
                  }}
                  className="absolute left-2 md:left-4 z-20 bg-neutral-800/70 hover:bg-neutral-700 hover:text-white hover:border-neutral-600 text-neutral-300 rounded-full p-3 md:p-4 border border-neutral-700/50 transition-all shadow-xl active:scale-90 cursor-pointer backdrop-blur-md"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Main Render Image */}
                <div className="w-full h-full flex items-center justify-center p-2 rounded-2xl bg-neutral-950/45 border border-neutral-800/40 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={lightboxIndex}
                      src={chatGptImages[lightboxIndex]}
                      alt={`ChatGPT Mockup ${lightboxIndex + 1}`}
                      initial={{ opacity: 0, scale: 0.98, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: -4 }}
                      transition={{ duration: 0.25 }}
                      className="max-w-full max-h-[55vh] object-contain rounded-xl shadow-2xl transition-all duration-300 pointer-events-none select-none"
                    />
                  </AnimatePresence>
                </div>

                {/* Right Arrow */}
                <button
                  onClick={() => {
                    setLightboxIndex((prev) => (prev + 1) % chatGptImages.length);
                    setLightboxPlaying(false); // pause on manual interaction
                  }}
                  className="absolute right-2 md:right-4 z-20 bg-neutral-800/70 hover:bg-neutral-700 hover:text-white hover:border-neutral-600 text-neutral-300 rounded-full p-3 md:p-4 border border-neutral-700/50 transition-all shadow-xl active:scale-90 cursor-pointer backdrop-blur-md"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Lower Controls & Autoplay Panel */}
              <div className="relative w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-800/60 z-10">
                
                {/* Autoplay Play/Pause */}
                <button
                  onClick={() => setLightboxPlaying(!lightboxPlaying)}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all border shadow-lg cursor-pointer ${
                    lightboxPlaying 
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25" 
                      : "bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700/60"
                  }`}
                >
                  {lightboxPlaying ? (
                    <>
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      {/* Custom Pause Icon */}
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      </svg>
                      Playing Showcase
                    </>
                  ) : (
                    <>
                      {/* Play Icon */}
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      Autoplay Showcase
                    </>
                  )}
                </button>

                {/* Navigation Indicator Stripes / Thumbnails */}
                <div className="flex gap-2.5">
                  {chatGptImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setLightboxIndex(idx);
                        setLightboxPlaying(false);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 shadow-md ${
                        idx === lightboxIndex 
                          ? "w-8 bg-brand" 
                          : "w-2 bg-neutral-700 hover:bg-neutral-600"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Info Text */}
                <div className="text-neutral-400 font-mono text-[10px] uppercase tracking-widest font-bold">
                  AI Transformation Vision
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

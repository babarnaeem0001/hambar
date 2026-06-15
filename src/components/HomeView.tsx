import React from 'react';
import { ActivePage } from '../types';
import { 
  ArrowRight, ShieldCheck, Zap, Users, Trophy, Lightbulb, 
  HelpCircle, ChevronDown, CheckCircle2, MessageSquare, BookOpen,
  Cpu, Code2, Compass, TrendingUp, Cloud
} from 'lucide-react';
import { processSteps, businessResults, serviceCategories, articles } from '../data';
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
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);
  const [slideIndex, setSlideIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % 3);
    }, 10000);
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
    { title: 'Transparent Communication', desc: 'No complex technical jargon. Clear status reports, plain-English metrics, and open codebase repositories from day one.' },
    { title: 'Business-Focused Solutions', desc: 'We prioritize investments that yield directly measurable return on investments (ROI), rather than adopting expensive tech defaults.' },
    { title: 'Long-Term Support', desc: 'We stay with your business long after deployment to host, maintain, secure, and incrementally scale your databases.' },
    { title: 'Strategic Planning', desc: 'We align raw technical blueprints precisely with your five-year corporate commercial growth and scaling targets.' }
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
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white font-sans leading-[1.2] flex flex-col gap-3">
                <span>Tech, AI & Softwares</span>
                <span className="text-xl sm:text-2xl lg:text-5xl font-bold text-neutral-300 flex items-center gap-2 flex-nowrap whitespace-nowrap">
                  for
                  <FlipWords
                    words={["Startups", "Growing Companies", "Established Businesses", "Enterprises"]}
                    duration={2500}
                    className="font-semibold text-white tracking-wide"
                  />
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-neutral-300 leading-relaxed max-w-lg">
                We help businesses attract more customers, streamline operations, implement AI solutions, build powerful software, and scale efficiently.
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
                    showPlayButton: true
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
             <h2 className="text-4xl font-extrabold tracking-tight text-black">Our Software Principles</h2>
           </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-20 mt-10">
            {trustElements.map((el, idx) => {
              const mockImages = [
                "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400",
                "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400",
                "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400",
                "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400"
              ];
              return (
                <div key={idx} className="flex items-center justify-center h-64">
                  <PinContainer title="View Details" href="#services">
                     <div className="flex basis-full flex-col p-4 tracking-tight sm:basis-1/2 w-[16rem] h-[16rem] bg-white rounded-2xl border border-neutral-100 shadow-xl overflow-hidden justify-between">
                       <div>
                         <h3 className="max-w-xs !pb-2 !m-0 font-extrabold text-lg text-black">
                           {el.title}
                         </h3>
                         <div className="text-xs !m-0 !p-0 font-normal leading-relaxed text-neutral-500">
                           {el.desc}
                         </div>
                       </div>
                       <div className="flex flex-1 w-full rounded-lg mt-4 overflow-hidden relative">
                         <img 
                           src={mockImages[idx % mockImages.length]} 
                           alt={el.title} 
                           referrerPolicy="no-referrer"
                           className="w-full h-full object-cover rounded-lg" 
                         />
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
                Select any skill column or direct capability below to view details, strategic discovery timelines, and pricing estimates.
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
                  Why Growing Companies Partner with Us
                </CardItem>
                <CardItem translateZ="60" className="text-neutral-500 text-base max-w-sm mx-auto">
                  We focus exclusively on practical outcomes instead of expensive generic tech defaults.
                </CardItem>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-10">
                <CardItem translateZ="40" className="w-full">
                  <div className="p-6 bg-black text-white rounded-2xl h-full space-y-4 shadow-xl">
                    <div className="h-12 w-12 flex items-center justify-center bg-neutral-900 border border-neutral-800 rounded-lg">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand">
                         <motion.path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} />
                         <motion.path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} />
                         <motion.path d="M4 22h16" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }} />
                         <motion.path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} />
                         <motion.path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} />
                         <motion.path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" fill="currentColor" initial={{ opacity: 0 }} whileInView={{ opacity: 0.2 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1 }} />
                      </svg>
                    </div>
                    <h4 className="font-bold text-lg text-white">Outcome First Execution</h4>
                    <p className="text-neutral-300 text-sm leading-relaxed">We measure success in hours saved, lead inquiry spikes, and secure database parameters.</p>
                  </div>
                </CardItem>
                <CardItem translateZ="60" className="w-full">
                  <div className="p-6 bg-black text-white rounded-2xl h-full space-y-4 shadow-xl">
                    <div className="h-12 w-12 flex items-center justify-center bg-neutral-900 border border-neutral-800 rounded-lg">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand">
                         <motion.path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.3 1.5 1.5 2.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }} />
                         <motion.path d="M9 18h6" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }} />
                         <motion.path d="M10 22h4" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.7 }} />
                         <motion.path d="M9 14h6" fill="currentColor" initial={{ opacity: 0 }} whileInView={{ opacity: 0.2 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1 }} />
                      </svg>
                    </div>
                    <h4 className="font-bold text-lg text-white">Deep Technical Competency</h4>
                    <p className="text-neutral-300 text-sm leading-relaxed">Our teams perform actual code audits, implement sandboxed AI, and optimize cloud nodes.</p>
                  </div>
                </CardItem>
                <CardItem translateZ="80" className="w-full">
                  <div className="p-6 bg-black text-white rounded-2xl h-full space-y-4 shadow-xl">
                    <div className="h-12 w-12 flex items-center justify-center bg-neutral-900 border border-neutral-800 rounded-lg">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand">
                         <motion.path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} />
                         <motion.path d="M9 12l2 2 4-4" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1.2 }} />
                      </svg>
                    </div>
                    <h4 className="font-bold text-lg text-white">Client & Asset Security</h4>
                    <p className="text-neutral-300 text-sm leading-relaxed">We draft software components that protect client files from public model leakage.</p>
                  </div>
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
        </div>
      </section>

      {/* 5. Business Results & Benefits (The Metric Section) */}
      <section className="relative p-2 sm:p-4" id="business-results">
        <div className="relative bg-neutral-950 text-white rounded-[2rem] overflow-hidden py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">Measurable Business Benefits</h2>
              <p className="text-slate-400 text-sm leading-relaxed mt-4">
                Our growth strategies and automation routines yield objective, observable benefits.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {businessResults.map((res, i) => {
              const svgPaths = [
                // Icon 1 (Trending Up)
                <><motion.path d="M3 3v18h18" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} /><motion.path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.5 }} /></>,
                // Icon 2 (Server/Database)
                <><motion.path d="M4 6a16 16 0 0116 0M4 12a16 16 0 0116 0M4 18a16 16 0 0116 0" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }} /><motion.rect x="4" y="4" width="16" height="4" rx="2" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.8 }} /><motion.rect x="4" y="10" width="16" height="4" rx="2" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1 }} /><motion.rect x="4" y="16" width="16" height="4" rx="2" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1.2 }} /></>,
                // Icon 3 (Shield Check)
                <><motion.path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} /><motion.path d="M9 12l2 2 4-4" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1.2 }} /></>,
                // Icon 4 (Zap/Lightning)
                <><motion.path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} /><motion.path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" initial={{ opacity: 0 }} whileInView={{ opacity: 0.2 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1 }} /></>
              ];

              return (
                <div key={i} className="group p-8 bg-black/50 rounded-2xl border border-slate-800 text-center space-y-4 hover:bg-slate-900 transition-colors">
                  <div className="flex justify-center h-16 w-16 mx-auto items-center">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand">
                       {svgPaths[i % svgPaths.length]}
                    </svg>
                  </div>
                  <div className="text-4xl font-extrabold text-white font-mono">{res.metric}</div>
                  <h3 className="font-bold text-sm text-white">{res.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{res.subtitle}</p>
                </div>
              );
            })}
          </div>
         </div>
        </div>
      </section>

      {/* 6. AI & Digital Transformation Section */}
      <section className="py-24 bg-white overflow-hidden" id="ai-transformation-about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-3xl mx-auto space-y-6">
            <span className="text-xs font-mono bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Modernization Path</span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-black tracking-tight leading-tight">
              AI Adoption & Modern Cloud Transition
            </h2>
            <p className="text-neutral-600 text-lg leading-relaxed max-w-2xl mx-auto">
              Many growing companies are weighed down by slow databases, legacy servers, or manual email checklists. We build the bridges connecting legacy records with advanced generative models and cloud hosts.
            </p>
          </div>

          <div className="py-12 flex justify-center">
             <ImagesBadge 
               text="View Documentation" 
               href="#view"
               images={[
                 "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400",
                 "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400",
                 "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400"
               ]}
               folderSize={{ width: 64, height: 48 }}
               teaserImageSize={{ width: 40, height: 28 }}
               hoverImageSize={{ width: 96, height: 64 }}
               className="bg-neutral-100 hover:bg-neutral-200 py-3 px-6 rounded-full"
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8 border-t border-neutral-100">
            <div className="space-y-3">
              <h4 className="font-bold text-black text-lg">Customer Chatbots</h4>
              <p className="text-neutral-600 text-sm leading-relaxed">Deploy 24/7 web assistants that learn directly from your manuals and help files to address user requests instantly.</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-black text-lg">Workflow Automation</h4>
              <p className="text-neutral-600 text-sm leading-relaxed">Connect your CRM, email channels, and document inventory using smart, script-led webhooks.</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-black text-lg">Contextual Search</h4>
              <p className="text-neutral-600 text-sm leading-relaxed">Search thousands of unstructured local logs or contracts safely via semantic lookup interfaces.</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-black text-lg">Executive Advisory</h4>
              <p className="text-neutral-600 text-sm leading-relaxed">Gain senior technology representation and code quality vetting on a flexible, part-time schedule.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Industries We Serve (Quick Preview) */}
      <section className="py-24 bg-neutral-50 border-t border-neutral-100" id="industries-serve-preview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
             <h2 className="text-4xl font-extrabold text-black tracking-tight">Structured For Your Industry</h2>
             <p className="text-neutral-600 mt-4 text-base leading-relaxed">We handle challenges across multiple corporate sectors.</p>
          </div>

          <Carousel3D items={[
            { title: "Startups", desc: "Accelerating early-stage minimum viable products (MVPs) to satisfy strategic runway milestones.", svg: <><motion.path d="M12 2v20" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} /><motion.path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} /></> },
            { title: "E-Commerce", desc: "Tuning checkout performance and customer retention pipelines for web consumer retail.", svg: <><motion.circle cx="8" cy="21" r="1" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1 }} /><motion.circle cx="19" cy="21" r="1" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1.2 }} /><motion.path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }} /></> },
            { title: "Small Businesses", desc: "Automating repetitive administrative spreadsheets to capture local buyer pipelines.", svg: <><motion.path d="M3 3v18h18" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} /><motion.path d="M18 17V9" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }} /><motion.path d="M13 17V5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.7 }} /><motion.path d="M8 17v-3" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.9 }} /></> },
            { title: "Healthcare Providers", desc: "Implementing secure scheduling pathways and compliant portals.", svg: <><motion.path d="M22 12h-4l-3 9L9 3l-3 9H2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }} /></> },
            { title: "SaaS Platforms", desc: "Refactoring codebases and implementing microservices for scalable platforms.", svg: <><motion.path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }} /></> }
          ].map((ind, idx) => (
             <div key={idx} className="p-10 bg-neutral-900 border border-neutral-800 rounded-3xl h-full flex flex-col justify-center text-center shadow-2xl hover:border-neutral-700 transition-colors group">
               <div className="h-16 w-16 mx-auto mb-6 flex items-center justify-center bg-neutral-950 rounded-2xl group-hover:bg-brand group-hover:text-black text-neutral-400 transition-colors">
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   {ind.svg}
                 </svg>
               </div>
               <h3 className="font-extrabold text-3xl text-white mb-6 group-hover:text-brand transition-colors">{ind.title}</h3>
               <p className="text-neutral-300 text-base leading-relaxed max-w-sm mx-auto">{ind.desc}</p>
             </div>
          ))} autoPlay={false} />

          <div className="text-center mt-12">
            <Button
              onClick={async () => { await new Promise(r => setTimeout(r, 600)); onPageChange('industries'); }}
              className="bg-black text-white hover:bg-neutral-800 rounded-full font-bold px-8 py-6 ring-black mx-auto"
            >
              View Strategic Industry Profiles
            </Button>
          </div>
        </div>
      </section>

      {/* 8. Our Process Section - Apple Cards Carousel */}
      <section className="py-16 bg-neutral-50 border-y border-neutral-100 overflow-hidden" id="our-process-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight mt-1">Our Structured 4-Step Process</h2>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              We guide companies from raw inquiry diagnostics to optimized deployment safety.
            </p>
          </div>

          <Carousel items={processSteps.map((p, i) => {
             const mockImages = [
               "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
               "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
               "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
               "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
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
              <p className="text-neutral-400 text-lg">Clear, transparent answers about our core parameters.</p>
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
            Initiate specialized service activation. Acquire flat-rate milestone engineering directly with our co-founders.
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
    </div>
  );
}

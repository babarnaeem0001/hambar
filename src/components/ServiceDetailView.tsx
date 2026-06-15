import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActivePage, MajorServiceDetail, Service } from '../types';
import { majorServicesDetails, serviceCategories } from '../data';
import { 
  ArrowRight, ShieldCheck, Mail, Phone, Clock, ChevronDown, CheckCircle2, 
  AlertCircle, Send, Sparkles, HelpCircle, ArrowLeft, Check 
} from 'lucide-react';

interface ServiceDetailViewProps {
  slug: string;
  onPageChange: (page: ActivePage, serviceSlug?: string) => void;
}

// Dynamically generate tailored profiles for each individual sub-service ID
function getServiceDetail(slug: string): MajorServiceDetail {
  // 1. Return manual static details if exact match exists (preserves hand-crafted major profiles)
  if (majorServicesDetails[slug]) {
    return majorServicesDetails[slug];
  }

  // 2. Discover the service in active categories
  let foundService: Service | undefined;
  let foundCategory: any;
  for (const cat of serviceCategories) {
    const svc = cat.services.find(s => s.id === slug);
    if (svc) {
      foundService = svc;
      foundCategory = cat;
      break;
    }
  }

  // 3. Fallback to general AI Consulting if missing entirely
  if (!foundService) {
    return majorServicesDetails['ai-consulting'];
  }

  const catId = foundCategory.id;
  const sName = foundService.name;
  const sDesc = foundService.description;

  let tagline = `Achieve strategic growth, optimize core databases, and streamline operations through ${sName}.`;
  let problemsSolved: string[] = [];
  let benefits: string[] = [];
  let process: string[] = [];
  let deliverables: string[] = [];

  if (catId === 'strategy') {
    tagline = `Define strategic directions, optimize tech stack architectures, and secure growth with elite ${sName} consulting.`;
    problemsSolved = [
      "Vague roadmap targets causing project delays and budget waste",
      "Unclear choices of web frameworks or software licensing models",
      "Lacking senior technical representation during investor and board meetings",
      "Under-optimized software architectures slowing down scale and build speeds"
    ];
    benefits = [
      "A clear actionable blueprint backed by realistic flat-rate project budgets",
      "Strategic alignment of codebase structures with commercial targets",
      "Avoidance of expensive framework or software licensing over-purchases",
      "A cohesive systems map ready for immediate developer team onboarding"
    ];
    process = [
      "Operational Diagnostics: Meeting with Hamid & Babar to analyze parameters and define targets.",
      "Strategic Blueprinting: Designing structural wireframes, system maps, and requirements specs.",
      "Milestone Sprints: Executing technology builds in clean, 2-week sprints with progress reviews.",
      "Secure Handover: Strict security auditing, custom training handbooks, and absolute IP transfer."
    ];
    deliverables = [
      `Tailored ${sName} Tactical Strategy & Specifications Blueprint`,
      "Interactive Operational Systems Map & Database Schema Diagrams",
      "Code Auditing Logs & Modular Framework Recommendations Report",
      "Co-Founder Approved Platform Scaling Guidelines & Training Guides"
    ];
  } else if (catId === 'growth') {
    tagline = `Capture buying customers and dominate organic ranks with specialized, speed-tuned ${sName}.`;
    problemsSolved = [
      "Low search engine positions losing high-value traffic to competitors",
      "High search ad marketing costs with low user registration rates",
      "Poor local search directories setup and map positioning parameters",
      "Slow web page rendering speeds driving mobile visitors away"
    ];
    benefits = [
      "Compounded, sustainable organic search traffic without passive ad bills",
      "Pragmatic landing pages designed strictly to maximize conversion inquiry rates",
      "Top-tier positions in targeted buyer intent keyword searches",
      "Complete transparency on client acquisition costs and actual ROI logs"
    ];
    process = [
      "SEO & Speed Diagnostic: Auditing keyword index positions, crawl parameters, and page speeds.",
      "On-Page Optimization: Injecting direct intent terms and streamlining asset payloads.",
      "Content Pipeline Execution: Authoring simple, plain-English solutions and target answers.",
      "Conversion Rate Alignment: Improving mobile touchpoints, call-to-actions, and landing forms."
    ];
    deliverables = [
      `Organic Search Keyword Opportunities Portfolio for ${sName}`,
      "Core Web Vitals Performance Audit & Speed Diagnostics Report",
      "Custom Solutions & Landing Page Content Strategy Wireframes",
      "Conversion Funnel Leads Acquisition Monitoring Dashboard Setup"
    ];
  } else if (catId === 'dev' || catId === 'software' || catId === 'design') {
    tagline = `Hand-craft fast, secure, and intuitive platforms configured strictly around your ${sName} targets.`;
    problemsSolved = [
      "Outdated software setups delaying invoice processing and team coordination",
      "Clumsy user panels driving support tickets and consumer drop-offs",
      "Fragmented data logs and search errors with no centralized SQL/NoSQL engine",
      "Unreliable backend setups crashing or slowing down during traffic spikes"
    ];
    benefits = [
      "A sleek Swiss-minimalist aesthetic that establishes solid brand trust",
      "Ultra-reliable database structures that automate manual spreadsheets securely",
      "100% intellectual property and modular source repository ownership",
      "Silky-smooth responsive performance across all mobile, tablet, and desk browsers"
    ];
    process = [
      "UX/UI Scoping: Defining visual user flows, interface guidelines, and layout blueprints.",
      "Database Schema Mapping: Designing streamlined database relationships and API routes.",
      "Component Handcrafting: Writing clean, modular TypeScript with solid responsive spacing.",
      "Security Audits & Go-Live: Performing port scanning, speed tuning, and secure deployment."
    ];
    deliverables = [
      `Interactive Figma/Wireframe Blueprints & Design Tokens for ${sName}`,
      "Clean Database Relationship Schemas & API Integration Plans",
      "Production-Ready Front-End & Back-End Code Repository",
      "Interactive Operational Platform Guide & Video Manual Handover"
    ];
  } else if (catId === 'ai-automation') {
    tagline = `Deploy autonomous workflow routines and custom security sandboxes with elite ${sName} setups.`;
    problemsSolved = [
      "Wasted team hours manually copy-pasting entries across platforms",
      "Incoming customer inquiries waiting hours for manual support replies",
      "Vast unindexed corporate files, PDFs, spreadsheets, and database folders",
      "Clumsy scheduling coordination and dispatch loops delaying client operations"
    ];
    benefits = [
      "Autonomous processing routines executing securely 24 hours a day with 0% error",
      "Instant, polite AI support ticket deflections trained on internal wikis",
      "Semantic keyword searching across thousands of unstructured contract files",
      "Up to 80% database coordination and admin assistant cost reductions"
    ];
    process = [
      "Workflow Tracking Audit: Mapping manual bottlenecks, email loops, and spreadsheets.",
      "Sandboxed Model Design: Tuning isolated model prompts with zero public training leakage.",
      "Webhook System Coupling: Setting up secure connections between databases, files, and CRM.",
      "Concurrency Review & Launch: Simulating multi-user workflows to verify payload security."
    ];
    deliverables = [
      `Custom Workflow Automation Topology & Webhooks Diagram for ${sName}`,
      "Secure Sandboxed Prompt Blueprints & Structured RAG Vector Maps",
      "Fully Interactive Intelligent Action Pipeline Service",
      "System Output Log Dashboard & Administrator Control Portal"
    ];
  } else if (catId === 'security' || catId === 'cloud' || catId === 'maintenance') {
    tagline = `Safeguard business systems, prevent crashes, and cut server overheads using certified ${sName} standards.`;
    problemsSolved = [
      "Corporate vulnerability to unauthorized logins or critical database breaches",
      "Over-allocated cloud services inflating monthly developer subscription bills",
      "Sudden server crashes, database lockouts, or sluggish page rendering times",
      "No automated offsite backup routine or quick disaster recovery protocol"
    ];
    benefits = [
      "Hardened systems that prevent data intrusions and state regulatory fines",
      "Substantial infrastructure hosting savings via active instance right-sizing",
      "Elastic, autoscaling servers that withstand traffic concurrency spikes",
      "Continuous system patching, security tracking, and prompt backup assurance"
    ];
    process = [
      "Security Audit Diagnostic: Scanning active firewall ports and backend dependencies.",
      "Right-Sizing Assessment: Running utility scans to determine exact server memory needs.",
      "CI/CD Integration: Building automated deployment sandboxes and source code validation.",
      "Failover Scripting: Setting up regular, isolated offsite data backups and recovery tests."
    ];
    deliverables = [
      `Systems Security Risks & Regulatory Compliance Report for ${sName}`,
      "Cost-Optimized Autoscaling Server Configuration Manifest",
      "Automated Continuous Integration Deployment Scripts",
      "Active Disaster Recovery Playbook & Service Level Agreement SLA"
    ];
  } else {
    problemsSolved = [
      "Repetitive, manual operations taking founder time away from core clients",
      "A fragmented digital setup causing workflow delays and system bottlenecks",
      "Outdated software tools failing to process customer data safely",
      "Lacking clear operational metrics to analyze growth or scalability"
    ];
    benefits = [
      "Highly streamlined workflows that minimize human entry mistakes",
      "Complete platform security with 100% intellectual property ownership",
      "Elastic system structures ready to scale as customer volumes double",
      "Direct, co-founder led execution focusing strictly on business growth"
    ];
    process = [
      "Operational Diagnostic: Meeting with Hamid & Babar to target bottlenecks and budgets.",
      "Blueprints Assembly: Designing detailed database schema blueprints and wireframes.",
      "Milestone development: Implementing secure modular components in fast sprints.",
      "Deployment Assurance: Speed diagnostics, automated data transfers, and staff manuals."
    ];
    deliverables = [
      "Tailored System Blueprints & Core Requirements Documentation",
      "Interactive Solution Wireframes & Database Schemas Map",
      "Structured TypeScript Source Code Repository",
      "Co-Founder Signed Support SLAs & Operations Training Manual"
    ];
  }

  const related = foundCategory.services
    .filter((s: Service) => s.id !== slug)
    .slice(0, 2)
    .map((s: Service) => ({ name: s.name, slug: s.id }));

  if (related.length === 0) {
    related.push({ name: 'AI Consulting & Strategy', slug: 'ai-consulting' });
    related.push({ name: 'Strategic IT Consulting', slug: 'it-consulting' });
  } else if (related.length === 1) {
    related.push({ name: 'Fractional CTO Services', slug: 'cto-as-a-service' });
  }

  const faqs = [
    {
      question: `What is the typical starting timeline to deploy ${sName}?`,
      answer: `The initial scope diagnostics and requirements blueprinting for ${sName} takes 1 to 2 weeks. Standard deployment for active systems is achieved within 3 to 5 weeks depending on your database complexity.`
    },
    {
      question: `Who owns the codebase and the intellectual property for ${sName}?`,
      answer: `You receive 100% complete intellectual property and source code ownership instantly upon milestone completion. All Git repositories and workspace folders are transferred securely to your organization.`
    },
    {
      question: `How do co-founders Hamid Saleem and Babar Naeem oversee ${sName}?`,
      answer: `Hamid Saleem (Co-Founder & Technology Specialist) personally reviews all systems architectures, database schema compliance, and code quality. Babar Naeem (Co-Founder & Product Strategist) leads client scope discovery and content growth alignments.`
    },
    {
      question: `Does implementing ${sName} require our team to have technical knowledge?`,
      answer: `No. We speak plain business language, completely avoid speculative developer jargon, and prioritize actual commercial outcomes. We provide clear walkthrough videos and simple operational guides for your non-technical staff.`
    },
    {
      question: `How do you safeguard client data safety and isolation during ${sName}?`,
      answer: `We enforce strict sandboxed environments and encrypted databases. Under no circumstances is any of your proprietary business folders, customer archives, or system coordinates exposed to public models or third-party training pipelines.`
    },
    {
      question: `Do you provide post-launch systems support and maintenance SLAs for ${sName}?`,
      answer: `Yes. We provide flexible post-launch Managed Services SLA plans. This covers predictive software library patches, continuous security checkups, active server hosting optimizations, and incremental feature updates.`
    }
  ];

  return {
    slug,
    title: sName,
    tagline,
    overview: `Our specialized ${sName} service is targeted directly at resolving manual inefficiencies and database bottlenecking. ${sDesc} Rather than implementing massive technical transformations overnight, we focus on safe, staged transitions tailored exactly around your unique company DNA. Hamid Saleem and Babar Naeem oversee each diagnostic alignment to ensure direct return on investment (ROI) with clean compliance specs.`,
    problemsSolved,
    benefits,
    process,
    deliverables,
    whyChooseUs: [
      "Outcome-first implementation prioritizing observable growth and manual task savings above speculative technology jargon.",
      "Immediate and untethered 100% codebase ownership with direct Git repository access and no vendor software licensing blocks.",
      "Vigilant governance directly overseen by co-founders Hamid Saleem (Systems/Dev) and Babar Naeem (Strategy/SEO/Product)."
    ],
    relatedServices: related,
    faqs
  };
}

export default function ServiceDetailView({ slug, onPageChange }: ServiceDetailViewProps) {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  
  // Local Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    goals: '',
    preferredContact: 'email'
  });
  const [submitted, setSubmitted] = useState(false);

  // Retrieve the dynamic details specifically generated for this slug
  const detail = getServiceDetail(slug);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Please fill out Name and Email');
      return;
    }
    setSubmitted(true);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', goals: '', preferredContact: 'email' });
    setSubmitted(false);
  };

  return (
    <div className="font-sans text-neutral-800 bg-white min-h-screen" id={`service-detail-${slug}`}>
      
      {/* 1. Back button & Breadcrumbs */}
      <section className="bg-white pt-6 border-b border-neutral-100" id="service-breadcrumbs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <button
            onClick={() => onPageChange('services')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-black transition-colors cursor-pointer"
            id="back-to-services-link"
          >
            <ArrowLeft size={13} /> Back to Services Menu
          </button>
        </div>
      </section>

      {/* 2. Hero Section */}
      <section className="bg-white py-12 lg:py-16" id="service-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold text-black tracking-tight">{detail.title}</h1>
            <p className="text-neutral-600 text-sm sm:text-base font-semibold leading-relaxed">{detail.tagline}</p>
          </div>
        </div>
      </section>

      {/* 3. Main Split Layout */}
      <section className="py-12 bg-white" id="service-split">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Main Content (8 cols) */}
            <div className="lg:col-span-8 space-y-16">
              
              {/* Overview */}
              <div className="space-y-4">
                <h3 className="font-extrabold text-black text-xl tracking-tight border-b border-neutral-100 pb-2">Service Overview</h3>
                <p className="text-neutral-600 text-sm leading-relaxed whitespace-pre-line">{detail.overview}</p>
              </div>

              {/* Problems & Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-bold text-black text-sm tracking-tight border-b border-neutral-100 pb-2">Problems We Solve</h3>
                  <ul className="space-y-3">
                    {detail.problemsSolved.map((prob, i) => (
                      <li key={i} className="flex gap-2.5 text-xs text-neutral-700 leading-relaxed">
                        <span className="font-bold text-black font-mono mt-0.5">!</span>
                        <span>{prob}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-black text-sm tracking-tight border-b border-neutral-100 pb-2 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-black" />
                    Key Business Benefits
                  </h3>
                  <ul className="space-y-3">
                    {detail.benefits.map((ben, i) => (
                      <li key={i} className="flex gap-2.5 text-xs text-neutral-700 leading-relaxed">
                        <CheckCircle2 size={16} className="text-black shrink-0 mt-0.5" />
                        <span>{ben}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Process Steps */}
              <div className="space-y-6">
                <h3 className="font-extrabold text-black text-xl tracking-tight border-b border-neutral-100 pb-2">Our Staged Process</h3>
                <div className="space-y-4">
                  {detail.process.map((proc, i) => {
                    const [title, desc] = proc.split(': ');
                    return (
                      <div key={i} className="p-5 bg-neutral-50 rounded-lg space-y-1">
                        <span className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-wider block mb-2">Phase {i+1}</span>
                        <h4 className="font-bold text-sm text-black">{title}</h4>
                        {desc && <p className="text-neutral-600 text-xs mt-1 leading-relaxed">{desc}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FAQs */}
              <div className="space-y-6">
                <h3 className="font-extrabold text-black text-xl tracking-tight border-b border-neutral-100 pb-2">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  {detail.faqs.map((faq, index) => {
                    const isToggled = openFaqIdx === index;
                    return (
                      <div key={index} className="bg-neutral-50 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setOpenFaqIdx(isToggled ? null : index)}
                          className="w-full flex justify-between items-center p-5 text-left font-bold text-black text-sm hover:bg-neutral-100 transition-colors focus:outline-none"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown size={16} className={`transform transition-transform text-neutral-500 ${isToggled ? 'rotate-180 text-black' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {isToggled && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 pb-5 pt-1 text-xs text-neutral-600 leading-relaxed">
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Side Panel (4 cols) - Sticky */}
            <div className="lg:col-span-4 relative">
              <div className="sticky top-24 space-y-8">
                
                {/* Deliverables Card */}
                <div className="bg-black text-white p-6 rounded-xl shadow-2xl">
                  <h3 className="font-bold text-lg mb-4">Key Deliverables</h3>
                  <ul className="space-y-3">
                    {detail.deliverables.map((del, i) => (
                      <li key={i} className="flex gap-3 text-xs leading-relaxed text-neutral-300">
                        <Check size={14} className="text-white shrink-0 mt-0.5" />
                        {del}
                      </li>
                    ))}
                  </ul>
                </div>

                 {/* Consultation Form Card */}
                <div className="bg-neutral-50 border border-neutral-200 p-6 rounded-xl">
                  <h3 className="font-bold text-black text-lg mb-2">Initiate Service Purchase</h3>
                  <p className="text-xs text-neutral-500 mb-6 leading-relaxed">Submit your specifications to initiate service activation. Co-founders Hamid & Babar will contact you with flat-rate milestone pricing.</p>
                  
                  {submitted ? (
                    <div className="text-center py-6 space-y-4">
                      <Check className="h-10 w-10 text-white bg-black rounded-full p-2 mx-auto" />
                      <h4 className="font-bold text-black text-sm">Purchase Spec Logged!</h4>
                      <p className="text-neutral-600 text-xs leading-relaxed">
                        Thank you, {formData.name}. Our co-founders are reviewing your request to buy this service and will send checkout/onboarding info directly to {formData.email}.
                      </p>
                      <button onClick={resetForm} className="mt-2 w-full px-4 py-2 border border-black bg-white text-black hover:bg-neutral-100 rounded text-xs font-bold transition-colors">
                        Order Another Service
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold">Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-white border border-neutral-200 rounded px-3 py-2.5 text-xs focus:outline-none focus:border-black transition-colors"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-white border border-neutral-200 rounded px-3 py-2.5 text-xs focus:outline-none focus:border-black transition-colors"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold">Goals</label>
                        <textarea
                          value={formData.goals}
                          onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                          rows={3}
                          className="w-full bg-white border border-neutral-200 rounded px-3 py-2.5 text-xs focus:outline-none focus:border-black transition-colors resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full mt-2 inline-flex justify-center items-center gap-2 px-4 py-3 bg-black hover:bg-neutral-800 text-white rounded text-xs font-bold transition-all"
                      >
                        Submit Purchase Spec
                        <Send size={12} />
                      </button>
                    </form>
                  )}
                </div>

                {/* Why Choose Us */}
                <div className="space-y-3">
                  <h4 className="font-bold text-black text-xs uppercase tracking-wide border-b border-neutral-100 pb-2">Why Us?</h4>
                  <ul className="space-y-2">
                    {detail.whyChooseUs.map((item, idx) => (
                      <li key={idx} className="text-xs text-neutral-500 leading-relaxed flex gap-2">
                        <span className="text-black font-bold">—</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

import React from 'react';
import { ActivePage } from '../types';
import { CheckCircle2, Award, Clock, Heart, Users } from 'lucide-react';
import Carousel3D from './Carousel3D';

interface AboutViewProps {
  onPageChange: (page: ActivePage) => void;
  onOpenBookingModal?: (serviceName?: string) => void;
}

export default function AboutView({ onPageChange, onOpenBookingModal }: AboutViewProps) {
  const coreValues = [
    { name: 'Client Success', desc: 'Every technical milestone we deploy must yield measurable operational returns, increased speed, or secure transaction scales.' },
    { name: 'Transparency', desc: 'No vendor lock-ins, plain-English code diagrams, and 100% intellectual property ownership handovers.' },
    { name: 'Innovation', desc: 'Applying sandboxed LLMs, lightning-fast interfaces, and modern database replication systems safely.' },
    { name: 'Reliability', desc: 'Designing resilient server architectures with auto-healing and encrypted point-in-time snapshot restorations.' },
    { name: 'Long-Term Support', desc: 'Maintaining, refactoring, and optimizing software engines to facilitate uninterrupted development growth.' }
  ];

  const valuesCarouselItems = coreValues.map((val, idx) => (
    <div key={idx} className="p-10 h-full w-full bg-white border border-neutral-200 rounded-2xl space-y-4 shadow-xl flex flex-col justify-center text-center">
      <div className="h-12 w-12 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold font-mono mx-auto shadow-md">
        0{idx + 1}
      </div>
      <h3 className="font-extrabold text-black text-2xl mt-4">{val.name}</h3>
      <p className="text-neutral-500 text-sm leading-relaxed">{val.desc}</p>
    </div>
  ));

  return (
    <div className="font-sans text-slate-800" id="about-view">
      
      {/* Hero Header */}
      <section className="bg-slate-50 py-16 border-b border-slate-100" id="about-hero">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">Our Origin & Core Values</h1>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
            Hambar is a premium software engineering and technology development company aimed at transferring companies to the digital era safely and securely.
          </p>
        </div>
      </section>

      {/* Story & Founders Section */}
      <section className="py-16 bg-white border-b border-slate-100" id="about-story-founders">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">Originating From the Practice of Technology Implementation</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Hambar was founded by <strong>Hamid Saleem</strong> and <strong>Babar Naeem</strong> for helping companies implement their business goals through development of secure, scalable and modern software products and speed platforms.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Before starting the work at Hambar, Hamid and Babar saw an emerging problem – managers got slide-decks and diagrams, but no production-ready and custom-developed source code. So, Hambar was created as an ecosystem of developers which can translate your technical specifications into robust corporate systems.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    if (onOpenBookingModal) {
                      onOpenBookingModal();
                    } else {
                      onPageChange('book');
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white rounded text-xs font-semibold shadow transition-all cursor-pointer"
                >
                  Start Project With the Founders
                </button>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 space-y-4">
              <h3 className="font-bold text-slate-950 text-sm uppercase tracking-wide">Key Metrics</h3>
              <ul className="space-y-3.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-slate-900 mt-0.5 shrink-0" />
                  <span><strong>100% IP transfer:</strong> your company will own all the source code.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-slate-900 mt-0.5 shrink-0" />
                  <span><strong>No tech-larping:</strong> we do not use any vanity metrics or logs but only focus on ROI.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-slate-900 mt-0.5 shrink-0" />
                  <span><strong>Secure sandboxes:</strong> all data pipelines of customers operate isolated.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Founders Profile Cards */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-xl font-extrabold text-slate-950 tracking-tight">Co-founder profiles</h3>
              <p className="text-xs text-slate-500 mt-1">Technology leaders working on each and every milestone.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto" id="founders-grid">
              {/* Founder 1 */}
              <article className="p-6 bg-slate-50 border border-slate-100 rounded-lg space-y-4 flex flex-col justify-between" id="founder-profile-hamid">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src="/hamid.png"
                      alt="Hamid Saleem, Hambar co-founder"
                      className="w-16 h-16 rounded-full border border-slate-200 object-cover"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                    />
                    <div>
                      <h4 className="font-bold text-slate-950 text-base leading-tight">Hamid Saleem</h4>
                      <p className="text-xs font-mono text-slate-500 font-semibold text-brand-dark">Co-Founder</p>
                    </div>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Hamid is responsible for product engineering, technology alignment, and systems architecture. He collaborates directly with the stakeholders to create technical requirements and develop high performance software systems.
                  </p>
                </div>
              </article>

              {/* Founder 2 */}
              <article className="p-6 bg-slate-50 border border-slate-100 rounded-lg space-y-4 flex flex-col justify-between" id="founder-profile-babar">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src="/babar.png"
                      alt="Babar Naeem, Hambar co-founder"
                      className="w-16 h-16 rounded-full border border-slate-200 object-cover"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                    />
                    <div>
                      <h4 className="font-bold text-slate-950 text-base leading-tight">Babar Naeem</h4>
                      <p className="text-xs font-mono text-slate-500 font-semibold text-brand-dark">Co-Founder</p>
                    </div>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Babar is responsible for product engineering, technology alignment, and systems architecture. He collaborates directly with the stakeholders to create technical requirements and develop high performance software systems.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 bg-neutral-50" id="about-values">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-3xl font-extrabold text-black tracking-tight">Our Core Values</h2>
            <p className="text-sm text-neutral-600 mt-2">
              Five metrics which define us every day while operating with clients.
            </p>
          </div>

          <Carousel3D items={valuesCarouselItems} autoPlay={true} interval={4000} />
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import { ActivePage } from '../types';
import { projects } from '../data';
import { ArrowUpRight } from 'lucide-react';
import Carousel3D from './Carousel3D';

interface ProjectsViewProps {
  onPageChange: (page: ActivePage) => void;
}

export default function ProjectsView({ onPageChange }: ProjectsViewProps) {
  const customItems = projects.map((proj, idx) => (
    <article key={proj.id} className="w-full bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
      <div className="relative h-1/2 w-full overflow-hidden bg-neutral-100">
        <img 
          src={proj.image} 
          alt={`${proj.title} project for ${proj.client}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-neutral-900/10 mix-blend-multiply" />
      </div>
      
      <div className="p-8 flex flex-col justify-between h-1/2">
        <div>
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-1 block">{proj.client}</span>
              <h2 className="text-xl font-bold tracking-tight text-neutral-900">{proj.title}</h2>
            </div>
          </div>
          <p className="text-sm text-neutral-500 leading-relaxed mt-3 line-clamp-3">
            {proj.description}
          </p>
        </div>

        <div className="flex justify-between items-end mt-4">
          <div className="flex flex-wrap gap-2">
            {proj.tags.slice(0,2).map((tag, tIdx) => (
              <span key={tIdx} className="px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded text-[10px] uppercase font-mono font-semibold tracking-wider">
                {tag}
              </span>
            ))}
          </div>
          <button 
            onClick={() => onPageChange('contact')}
            aria-label={`Discuss a project like ${proj.title}`}
            className="w-10 h-10 border border-neutral-200 rounded-full flex items-center justify-center shrink-0 hover:bg-neutral-950 hover:text-white transition-all cursor-pointer bg-white"
          >
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
    </article>
  ));

  return (
    <div className="font-sans text-neutral-900 bg-white min-h-screen" id="projects-view-section">
      
      {/* Hero Header */}
      <section className="py-16 sm:py-24 border-b border-neutral-200" id="projects-hero">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Recent Projects</h1>
          <p className="text-neutral-500 text-sm max-w-2xl mx-auto leading-relaxed">
            We design scalable solutions that make a difference in the digital world for emerging firms. Discover our projects in custom software, AI automation loops, and high performance applications.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 sm:py-24 overflow-hidden bg-neutral-50" id="projects-grid">
        <Carousel3D items={customItems} autoPlay={false} />
      </section>
    </div>
  );
}

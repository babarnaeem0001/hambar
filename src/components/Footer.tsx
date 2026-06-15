import React from 'react';
import { ActivePage } from '../types';
import { Mail, Phone, Clock, ArrowRight, Linkedin, Twitter, MessageSquare } from 'lucide-react';

interface FooterProps {
  onPageChange: (page: ActivePage, serviceSlug?: string) => void;
}

export default function Footer({ onPageChange }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleServiceDetailClick = (slug: string) => {
    onPageChange('services', slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSectionClick = (page: ActivePage) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#090909] text-neutral-300 border-t border-neutral-900 font-sans" id="hb-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12" id="footer-grid">
          
          {/* Column 1: Company Logo & Info */}
          <div className="space-y-4" id="footer-col-about">
            <div className="flex items-center cursor-pointer h-10 md:h-12" onClick={() => handleSectionClick('home')}>
              <img src="/logo.png" alt="Hambar" className="h-full w-auto object-contain" />
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Founded by Hamid Saleem & Babar Naeem. We help growing companies streamline operations, integrate custom-trained AI architectures, build software, and acquire organic buyer pipelines.
            </p>
            <div className="pt-2 text-xs font-mono text-neutral-500">
              <p>Founders:</p>
              <p className="text-neutral-400 font-sans font-medium">Hamid Saleem & Babar Naeem</p>
            </div>
            {/* Socials */}
            <div className="flex items-center gap-3 pt-2">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded transition-colors" aria-label="LinkedIn Profile">
                <Linkedin size={16} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded transition-colors" aria-label="Twitter Profile">
                <Twitter size={16} />
              </a>
              <a href="https://wa.me/something" target="_blank" rel="noopener noreferrer" className="p-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded transition-colors" aria-label="WhatsApp Contact">
                <MessageSquare size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Key Services */}
          <div className="space-y-4" id="footer-col-services">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Key Services</h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <button onClick={() => handleServiceDetailClick('ai-solutions')} className="hover:text-white transition-colors text-left">
                  AI Solutions & Strategy
                </button>
              </li>
              <li>
                <button onClick={() => handleServiceDetailClick('it-solutions')} className="hover:text-white transition-colors text-left">
                  Strategic IT Solutions
                </button>
              </li>
              <li>
                <button onClick={() => handleServiceDetailClick('digital-transformation-solutions')} className="hover:text-white transition-colors text-left">
                  Digital Transformation
                </button>
              </li>
              <li>
                <button onClick={() => handleServiceDetailClick('web-development')} className="hover:text-white transition-colors text-left">
                  Website & App Development
                </button>
              </li>
              <li>
                <button onClick={() => handleServiceDetailClick('custom-software-development')} className="hover:text-white transition-colors text-left">
                  Custom Software Development
                </button>
              </li>
              <li>
                <button onClick={() => handleServiceDetailClick('ai-automation')} className="hover:text-white transition-colors text-left">
                  AI & Automation Solutions
                </button>
              </li>
              <li>
                <button onClick={() => handleSectionClick('services')} className="text-neutral-300 hover:text-white font-medium flex items-center gap-1 mt-2">
                  View All Services <ArrowRight size={12} />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Solutions & Goals */}
          <div className="space-y-4" id="footer-col-solutions">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Solutions</h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <button onClick={() => handleServiceDetailClick('ai-automation')} className="hover:text-white transition-colors text-left">
                  Automate Business Processes
                </button>
              </li>
              <li>
                <button onClick={() => handleServiceDetailClick('seo-services')} className="hover:text-white transition-colors text-left">
                  Increase Website Traffic
                </button>
              </li>
              <li>
                <button onClick={() => handleServiceDetailClick('data-analytics')} className="hover:text-white transition-colors text-left">
                  Improve Data Visibility
                </button>
              </li>
              <li>
                <button onClick={() => handleServiceDetailClick('cybersecurity')} className="hover:text-white transition-colors text-left">
                  Strengthen Cybersecurity
                </button>
              </li>
              <li>
                <button onClick={() => handleServiceDetailClick('cloud-solutions')} className="hover:text-white transition-colors text-left">
                  Scale Business Operations
                </button>
              </li>
              <li>
                <button onClick={() => handleServiceDetailClick('project-solutions')} className="hover:text-white transition-colors text-left">
                  Launch New Products
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Operations */}
          <div className="space-y-4" id="footer-col-contact">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Contact & Support</h3>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li className="flex items-start gap-2.5">
                <Mail size={16} className="text-neutral-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-neutral-500">Discovery Call Email</p>
                  <a href="mailto:info@hbdigital.com" className="hover:text-white transition-colors break-all">
                    info@hbdigital.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone size={16} className="text-neutral-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-neutral-500">Phone & WhatsApp</p>
                  <a href="https://wa.me/123456789" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    +1 (234) 567-8900
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={16} className="text-neutral-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-neutral-500">Operation Hours</p>
                  <p className="text-neutral-300">Mon - Fri: 9AM - 6PM GMT</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-900 text-xs text-neutral-500 flex flex-col sm:flex-row justify-between items-center gap-4" id="footer-bottom">
          <p>© {currentYear} Hambar. All rights reserved. Strategic Business & Technical Services.</p>
          <div className="flex gap-4">
            <button onClick={() => handleSectionClick('about')} className="hover:text-neutral-400 transition-colors">About Us</button>
            <button onClick={() => handleSectionClick('contact')} className="hover:text-neutral-400 transition-colors">Privacy Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

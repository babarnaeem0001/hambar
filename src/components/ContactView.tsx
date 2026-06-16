import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { adminStore } from '../lib/admin-store';

export default function ContactView() {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    serviceInterested: 'AI Solutions',
    budgetRange: '$5,000 - $15,000',
    details: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const servicesList = [
    'AI Solutions & Strategy',
    'Strategic IT Solutions',
    'Digital Transformation Solutions',
    'Project Planning & Discovery',
    'CTO as a Service',
    'SEO & Website Optimization',
    'Website & App Development',
    'Custom Software Solutions',
    'AI, Automation & Chatbots',
    'Cloud Migration & DevOps',
    'Quality, Security & Auditing',
    'Data Analytics & BI'
  ];

  const budgetRanges = [
    '< $5,000',
    '$5,000 - $15,000',
    '$15,000 - $40,000',
    '$40,000 - $100,000',
    '$100,000+'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.details) {
      setError('Please fill out all required fields (Name, Email, and Project Details).');
      return;
    }
    setError('');
    
    // Persist to adminStore
    adminStore.addSubmission({
      type: 'contact',
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone || undefined,
      companyName: formData.companyName || undefined,
      serviceInterested: formData.serviceInterested,
      budgetRange: formData.budgetRange,
      details: formData.details
    });

    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      companyName: '',
      email: '',
      phone: '',
      serviceInterested: 'AI Solutions',
      budgetRange: '$5,000 - $15,000',
      details: ''
    });
    setSubmitted(false);
  };

  return (
    <div className="font-sans text-slate-800" id="contact-view">
      
      {/* Hero Header */}
      <section className="bg-slate-50 py-16 border-b border-slate-100" id="contact-hero">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="text-xs font-mono uppercase bg-slate-900 text-white px-2 py-0.5 rounded font-bold">Contact Us</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">Direct Client Inquiry Panel</h1>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
            Tell us about your technical specifications or organizational goals and we will schedule an initial review call with the founders.
          </p>
        </div>
      </section>

      {/* Main Grid: Form + Info */}
      <section className="py-16 bg-white" id="contact-grid-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Info Side (Col 1-5) */}
            <div className="lg:col-span-5 space-y-8" id="contact-info-panel">
              <div className="space-y-4">
                <h2 className="text-xl font-extrabold text-slate-950 tracking-tight">Connect with Hamid & Babar</h2>
                <p className="text-slate-600 text-xs leading-relaxed">
                  We reply to all qualified strategic inquiries within one business day. Feel free to reach out via email or start a direct instant message conversation on WhatsApp.
                </p>
              </div>

              {/* Direct channels */}
              <div className="space-y-4">
                <a 
                  href="https://wa.me/123456789?text=Hello%20HB%20Digital%20Solutions,%20I%20would%20like%20to%20discuss%20a%20project." 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg group transition-all"
                  id="direct-whatsapp-link"
                >
                  <div className="p-3 bg-slate-900 text-white rounded">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-950 text-sm">Instant WhatsApp Chat</h4>
                    <p className="text-slate-600 text-xs mt-0.5 group-hover:underline">Start messaging now ↗</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="p-3 bg-slate-900 text-white rounded">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-950 text-sm">General Inquiries</h4>
                    <p className="text-slate-600 text-xs mt-0.5">info@hbdigital.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="p-3 bg-slate-900 text-white rounded">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-950 text-sm">Call & Messaging HQ</h4>
                    <p className="text-slate-600 text-xs mt-0.5">+1 (234) 567-8900</p>
                  </div>
                </div>
              </div>

              <div className="p-5 border border-slate-100 rounded bg-slate-50/50 space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Business Standards</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Every message we capture is treated with absolute security and strict parameters. Our teams do not share specifications or client information with other organizations.
                </p>
              </div>
            </div>

            {/* Form Side (Col 6-12) */}
            <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-lg border border-slate-200" id="contact-form-panel">
              {submitted ? (
                <div className="text-center py-12 space-y-4" id="submit-success-state">
                  <div className="inline-flex items-center justify-center p-3 bg-slate-100 text-slate-950 rounded-full mb-2">
                    <CheckCircle2 size={48} className="text-slate-950" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-950">Inquiry Captured Successfully!</h3>
                  <p className="text-slate-600 text-xs max-w-md mx-auto leading-relaxed">
                    Thank you, <strong>{formData.fullName}</strong>. We have logged your request regarding <strong>{formData.serviceInterested}</strong> and our team will prepare initial analysis before booking your review call.
                  </p>
                  <div className="p-4 bg-white border border-slate-200 rounded text-left text-xs space-y-1 max-w-md mx-auto">
                    <p><strong>Company Name:</strong> {formData.companyName || 'Not Specified'}</p>
                    <p><strong>Proposed Budget Range:</strong> {formData.budgetRange}</p>
                    <p><strong>Phone:</strong> {formData.phone || 'Not Specified'}</p>
                  </div>
                  <div className="pt-4">
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold rounded"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" id="contact-inquiry-form">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">Request a Discovery Call / Quote</h3>
                  
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-xs text-red-700 font-medium">
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="fullName" className="block text-xs font-semibold text-slate-700">Full Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. John Doe"
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-slate-950 focus:outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="companyName" className="block text-xs font-semibold text-slate-700">Company Name</label>
                      <input
                        type="text"
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="e.g. My Startup Inc."
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-slate-950 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="email" className="block text-xs font-semibold text-slate-700">Email Address <span className="text-red-500">*</span></label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@company.com"
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-slate-950 focus:outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="phone" className="block text-xs font-semibold text-slate-700">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-slate-950 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="serviceInterested" className="block text-xs font-semibold text-slate-700">Service Interested In</label>
                      <select
                        id="serviceInterested"
                        value={formData.serviceInterested}
                        onChange={(e) => setFormData({ ...formData, serviceInterested: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-slate-950 focus:outline-none"
                      >
                        {servicesList.map((svc, i) => (
                          <option key={i} value={svc}>{svc}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="budgetRange" className="block text-xs font-semibold text-slate-700">Proposed Budget Range</label>
                      <select
                        id="budgetRange"
                        value={formData.budgetRange}
                        onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-slate-950 focus:outline-none"
                      >
                        {budgetRanges.map((b, i) => (
                          <option key={i} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="details" className="block text-xs font-semibold text-slate-700">Describe Your Project and Business Goals <span className="text-red-500">*</span></label>
                    <textarea
                      id="details"
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      placeholder="Please include details about your existing tools, target timeline, systems issues, and why you are seeking technology or growth solutions."
                      rows={5}
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-slate-950 focus:outline-none"
                      required
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center items-center gap-2 px-5 py-3 bg-slate-950 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors"
                      id="contact-form-submit"
                    >
                      Submit Secure Inquiry
                      <Send size={12} />
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

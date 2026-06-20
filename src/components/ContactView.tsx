import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, Send, CheckCircle2, AlertCircle, MapPin } from 'lucide-react';
import { adminStore } from '../lib/admin-store';

export default function ContactView() {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    serviceInterested: 'AI Solutions',
    budgetRange: '$5,000 - $15,000',
    details: '',
    address: '',
    city: '',
    country: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [isMapsLoaded, setIsMapsLoaded] = useState(false);

  React.useEffect(() => {
    const apiKey = (process.env.GOOGLE_MAPS_PLATFORM_KEY) || '';
    if (!apiKey) return;
    if ((window as any).google && (window as any).google.maps) {
      setIsMapsLoaded(true);
      return;
    }
    const existingScript = document.getElementById('google-maps-api-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => setIsMapsLoaded(true));
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-maps-api-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.addEventListener('load', () => setIsMapsLoaded(true));
    document.head.appendChild(script);
  }, []);

  const REAL_ADDRESS_FALLBACKS = [
    "1600 Amphitheatre Pkwy, Mountain View, CA 94043",
    "1 Infinite Loop, Cupertino, CA 95014",
    "One Hacker Way, Menlo Park, CA 94025",
    "One Microsoft Way, Redmond, WA 98052",
    "350 5th Ave, New York, NY 10118",
    "601 Townsend St, San Francisco, CA 94103",
    "111 8th Ave, New York, NY 10011",
    "410 Terry Ave N, Seattle, WA 98109",
    "100 Bovet Rd, San Mateo, CA 94402",
    "530 Lytton Ave, Palo Alto, CA 94301"
  ];

  const countryCodes = [
    { code: '+1', name: 'United States', flag: '🇺🇸' },
    { code: '+1', name: 'Canada', flag: '🇨🇦' },
    { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
    { code: '+61', name: 'Australia', flag: '🇦🇺' },
    { code: '+64', name: 'New Zealand', flag: '🇳🇿' },
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+92', name: 'Pakistan', flag: '🇵🇰' },
    { code: '+971', name: 'United Arab Emirates', flag: '🇦🇪' },
    { code: '+81', name: 'Japan', flag: '🇯🇵' },
    { code: '+49', name: 'Germany', flag: '🇩🇪' },
    { code: '+33', name: 'France', flag: '🇫🇷' },
    { code: '+39', name: 'Italy', flag: '🇮🇹' },
    { code: '+34', name: 'Spain', flag: '🇪🇸' },
    { code: '+86', name: 'China', flag: '🇨🇳' },
    { code: '+55', name: 'Brazil', flag: '🇧🇷' },
    { code: '+52', name: 'Mexico', flag: '🇲🇽' },
    { code: '+7', name: 'Russia', flag: '🇷🇺' },
    { code: '+27', name: 'South Africa', flag: '🇿🇦' },
    { code: '+82', name: 'South Korea', flag: '🇰🇷' },
    { code: '+65', name: 'Singapore', flag: '🇸🇬' },
  ];

  const fetchAddressPredictions = (text: string) => {
    if (!text || text.trim().length < 3) {
      setAddressSuggestions([]);
      return;
    }

    if (isMapsLoaded && (window as any).google?.maps?.places?.AutocompleteService) {
      try {
        const service = new (window as any).google.maps.places.AutocompleteService();
        service.getPlacePredictions(
          { input: text, types: ['address'] },
          (predictions: any, status: any) => {
            if (status === 'OK' && predictions) {
              setAddressSuggestions(predictions.map((p: any) => p.description));
            } else {
              const filtered = REAL_ADDRESS_FALLBACKS.filter(addr => 
                addr.toLowerCase().includes(text.toLowerCase())
              );
              setAddressSuggestions(filtered);
            }
          }
        );
        return;
      } catch (e) {
        console.warn('AutocompleteService error:', e);
      }
    }

    const filtered = REAL_ADDRESS_FALLBACKS.filter(addr => 
      addr.toLowerCase().includes(text.toLowerCase())
    );
    setAddressSuggestions(filtered);
  };

  const handleAddressChange = (val: string) => {
    setFormData(prev => ({ ...prev, address: val }));
    fetchAddressPredictions(val);
    setShowAddressSuggestions(true);
  };

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

    const hasFullAddress = formData.address.trim() !== '';
    const hasCityAndCountry = formData.city.trim() !== '' && formData.country.trim() !== '';
    if (!hasFullAddress && !hasCityAndCountry) {
      setError('Please enter your Postal Address, or both City and Country.');
      return;
    }

    setError('');
    
    const computedAddress = formData.address.trim() || (formData.city && formData.country ? `${formData.city.trim()}, ${formData.country.trim()}` : '');

    // Persist to adminStore
    adminStore.addSubmission({
      type: 'contact',
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone || undefined,
      companyName: formData.companyName || undefined,
      serviceInterested: formData.serviceInterested,
      budgetRange: formData.budgetRange,
      details: formData.details,
      address: computedAddress || undefined
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
      details: '',
      address: '',
      city: '',
      country: ''
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
                    <p><strong>Postal Address:</strong> {formData.address || (formData.city && formData.country ? `${formData.city}, ${formData.country}` : 'Not Specified')}</p>
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

                  <div className="space-y-3 pt-1">
                    <div className="space-y-1 relative">
                      <label className="block text-xs font-semibold text-slate-700">
                        Operational / Postal Address {!formData.city.trim() && !formData.country.trim() && <span className="text-red-500">*</span>}
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text"
                          required={!formData.city.trim() && !formData.country.trim()}
                          value={formData.address}
                          onChange={e => handleAddressChange(e.target.value)}
                          onFocus={() => setShowAddressSuggestions(true)}
                          onBlur={() => setTimeout(() => setShowAddressSuggestions(false), 200)}
                          placeholder="Type or enter your address..."
                          className="w-full bg-white border border-slate-300 rounded pl-10 pr-4 py-2 text-xs focus:ring-1 focus:ring-slate-950 focus:outline-none"
                        />
                      </div>
                      
                      {showAddressSuggestions && addressSuggestions.length > 0 && (
                        <div className="absolute z-20 w-full bg-white border border-slate-200 mt-1 rounded shadow-lg max-h-48 overflow-y-auto">
                          {addressSuggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, address: suggestion });
                                setAddressSuggestions([]);
                                setShowAddressSuggestions(false);
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 cursor-pointer block"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* City input */}
                      <div className="space-y-1 flex flex-col">
                        <label className="text-xs font-semibold text-slate-700">
                          City {!formData.address.trim() && <span className="text-red-500">*</span>}
                        </label>
                        <input 
                          type="text"
                          required={!formData.address.trim()}
                          value={formData.city}
                          onChange={e => setFormData({ ...formData, city: e.target.value })}
                          placeholder="e.g. San Francisco"
                          className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-slate-950 focus:outline-none text-slate-800"
                        />
                      </div>

                      {/* Country select */}
                      <div className="space-y-1 flex flex-col">
                        <label className="text-xs font-semibold text-slate-700">
                          Country {!formData.address.trim() && <span className="text-red-500">*</span>}
                        </label>
                        <select
                          required={!formData.address.trim()}
                          value={formData.country}
                          onChange={e => setFormData({ ...formData, country: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-slate-950 focus:outline-none text-slate-800 cursor-pointer"
                        >
                          <option value="" className="text-slate-400">Select country...</option>
                          {countryCodes.map((country, idx) => (
                            <option key={idx} value={country.name} className="text-slate-800">
                              {country.flag} {country.name}
                            </option>
                          ))}
                        </select>
                      </div>
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

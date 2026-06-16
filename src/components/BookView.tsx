import React, { useState, useRef } from 'react';
import { 
  User, Mail, Phone, Building, Globe, ShieldCheck, HelpCircle, 
  MapPin, Upload, Calendar as CalendarIcon, Clock, ChevronRight, 
  ChevronLeft, CheckCircle2, FileText, Trash2, Sparkles, Send, Lock, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/stateful-button';
import { serviceCategories } from '../data';
import { adminStore } from '../lib/admin-store';

interface FileUploadState {
  name: string;
  size: string;
  progress: number;
  uploaded: boolean;
}

interface BookViewProps {
  initialServiceName?: string;
  onClose?: () => void;
  isModal?: boolean;
}

export default function BookView({ initialServiceName, onClose, isModal }: BookViewProps = {}) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submittingText, setSubmittingText] = useState('Thinking...');
  const [isCompleted, setIsCompleted] = useState(false);

  // Form states matching exactly your fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneCode: '+1',
    phone: '',
    companyName: '',
    description: '',
    ndaRequired: 'no',
    websiteUrl: '',
    howHeard: 'Twitter / X',
    primaryService: initialServiceName || 'AI Consulting & Strategy',
    additionalServices: [] as string[],
    otherServiceText: '',
    address: '',
    meetingDate: '',
    meetingTimeSlot: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState<FileUploadState[]>([]);
  const [isPhoneDropdownOpen, setIsPhoneDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Popular services options
  const servicesList = [
    'AI Consulting & Strategy',
    'Strategic IT Consulting',
    'Digital Transformation Consulting',
    'Project Planning & Discovery',
    'CTO as a Service',
    'SEO & Website Optimization',
    'Website & App Development',
    'Custom Software Solutions',
    'AI, Automation & Chatbots',
    'Cloud Migration & DevOps',
    'Data Analytics / BI Solutions',
    ...(initialServiceName && ![
      'AI Consulting & Strategy',
      'Strategic IT Consulting',
      'Digital Transformation Consulting',
      'Project Planning & Discovery',
      'CTO as a Service',
      'SEO & Website Optimization',
      'Website & App Development',
      'Custom Software Solutions',
      'AI, Automation & Chatbots',
      'Cloud Migration & DevOps',
      'Data Analytics / BI Solutions'
    ].includes(initialServiceName) ? [initialServiceName] : []),
    'Other (Specify below)'
  ];

  // Country select flags list
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
    { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
    { code: '+62', name: 'Indonesia', flag: '🇮🇩' },
    { code: '+63', name: 'Philippines', flag: '🇵🇭' },
    { code: '+66', name: 'Thailand', flag: '🇹🇭' },
    { code: '+84', name: 'Vietnam', flag: '🇻🇳' },
    { code: '+90', name: 'Turkey', flag: '🇹🇷' },
    { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+20', name: 'Egypt', flag: '🇪🇬' },
    { code: '+31', name: 'Netherlands', flag: '🇳🇱' },
    { code: '+32', name: 'Belgium', flag: '🇧🇪' },
    { code: '+41', name: 'Switzerland', flag: '🇨🇭' },
    { code: '+43', name: 'Austria', flag: '🇦🇹' },
    { code: '+46', name: 'Sweden', flag: '🇸🇪' },
    { code: '+47', name: 'Norway', flag: '🇳🇴' },
    { code: '+45', name: 'Denmark', flag: '🇩🇰' },
    { code: '+353', name: 'Ireland', flag: '🇮🇪' },
    { code: '+351', name: 'Portugal', flag: '🇵🇹' },
    { code: '+358', name: 'Finland', flag: '🇫🇮' },
    { code: '+48', name: 'Poland', flag: '🇵🇱' },
    { code: '+30', name: 'Greece', flag: '🇬🇷' },
    { code: '+380', name: 'Ukraine', flag: '🇺🇦' },
    { code: '+964', name: 'Iraq', flag: '🇮🇶' },
    { code: '+98', name: 'Iran', flag: '🇮🇷' },
    { code: '+963', name: 'Syria', flag: '🇸🇾' },
    { code: '+962', name: 'Jordan', flag: '🇯🇴' },
    { code: '+961', name: 'Lebanon', flag: '🇱🇧' },
    { code: '+965', name: 'Kuwait', flag: '🇰🇼' },
    { code: '+968', name: 'Oman', flag: '🇴🇲' },
    { code: '+974', name: 'Qatar', flag: '🇶🇦' },
    { code: '+973', name: 'Bahrain', flag: '🇧🇭' },
    { code: '+967', name: 'Yemen', flag: '🇾🇪' },
    { code: '+212', name: 'Morocco', flag: '🇲🇦' },
    { code: '+213', name: 'Algeria', flag: '🇩🇿' },
    { code: '+216', name: 'Tunisia', flag: '🇹🇳' },
    { code: '+218', name: 'Libya', flag: '🇱🇾' },
    { code: '+356', name: 'Malta', flag: '🇲🇹' },
    { code: '+354', name: 'Iceland', flag: '🇮🇸' },
    { code: '+352', name: 'Luxembourg', flag: '🇱🇺' },
    { code: '+420', name: 'Czechia', flag: '🇨🇿' },
    { code: '+421', name: 'Slovakia', flag: '🇸🇰' },
    { code: '+36', name: 'Hungary', flag: '🇭🇺' },
    { code: '+40', name: 'Romania', flag: '🇷🇴' },
    { code: '+359', name: 'Bulgaria', flag: '🇧🇬' },
    { code: '+381', name: 'Serbia', flag: '🇷🇸' },
    { code: '+385', name: 'Croatia', flag: '🇭🇷' },
    { code: '+386', name: 'Slovenia', flag: '🇸🇮' },
    { code: '+370', name: 'Lithuania', flag: '🇱🇹' },
    { code: '+371', name: 'Latvia', flag: '🇱🇻' },
    { code: '+372', name: 'Estonia', flag: '🇪🇪' },
    { code: '+373', name: 'Moldova', flag: '🇲🇩' },
    { code: '+355', name: 'Albania', flag: '🇦🇱' },
    { code: '+389', name: 'North Macedonia', flag: '🇲🇰' },
    { code: '+387', name: 'Bosnia & Herzegovina', flag: '🇧🇦' },
    { code: '+382', name: 'Montenegro', flag: '🇲🇪' },
    { code: '+374', name: 'Armenia', flag: '🇦🇲' },
    { code: '+994', name: 'Azerbaijan', flag: '🇦🇿' },
    { code: '+995', name: 'Georgia', flag: '🇬🇪' },
    { code: '+996', name: 'Kyrgyzstan', flag: '🇰🇬' },
    { code: '+992', name: 'Tajikistan', flag: '🇹🇯' },
    { code: '+993', name: 'Turkmenistan', flag: '🇹🇲' },
    { code: '+998', name: 'Uzbekistan', flag: '🇺🇿' },
    { code: '+7', name: 'Kazakhstan', flag: '🇰🇿' },
    { code: '+976', name: 'Mongolia', flag: '🇲🇳' },
    { code: '+977', name: 'Nepal', flag: '🇳🇵' },
    { code: '+94', name: 'Sri Lanka', flag: '🇱🇰' },
    { code: '+880', name: 'Bangladesh', flag: '🇧🇩' },
    { code: '+95', name: 'Myanmar', flag: '🇲🇲' },
    { code: '+855', name: 'Cambodia', flag: '🇰🇭' },
    { code: '+856', name: 'Laos', flag: '🇱🇦' },
    { code: '+852', name: 'Hong Kong', flag: '🇭🇰' },
    { code: '+886', name: 'Taiwan', flag: '🇹🇼' },
    { code: '+853', name: 'Macau', flag: '🇲🇴' },
    { code: '+54', name: 'Argentina', flag: '🇦🇷' },
    { code: '+56', name: 'Chile', flag: '🇨🇱' },
    { code: '+57', name: 'Colombia', flag: '🇨🇴' },
    { code: '+51', name: 'Peru', flag: '🇵🇪' },
    { code: '+58', name: 'Venezuela', flag: '🇻🇪' },
    { code: '+593', name: 'Ecuador', flag: '🇪🇨' },
    { code: '+591', name: 'Bolivia', flag: '🇧🇴' },
    { code: '+595', name: 'Paraguay', flag: '🇵🇾' },
    { code: '+598', name: 'Uruguay', flag: '🇺🇾' },
    { code: '+506', name: 'Costa Rica', flag: '🇨🇷' },
    { code: '+507', name: 'Panama', flag: '🇵🇦' },
    { code: '+502', name: 'Guatemala', flag: '🇬🇹' },
    { code: '+503', name: 'El Salvador', flag: '🇸🇻' },
    { code: '+504', name: 'Honduras', flag: '🇭🇳' },
    { code: '+505', name: 'Nicaragua', flag: '🇳🇮' },
    { code: '+597', name: 'Suriname', flag: '🇸🇷' },
    { code: '+592', name: 'Guyana', flag: '🇬🇾' },
    { code: '+1', name: 'Jamaica', flag: '🇯🇲' },
    { code: '+509', name: 'Haiti', flag: '🇭🇹' },
    { code: '+1', name: 'Bahamas', flag: '🇧🇸' },
    { code: '+1', name: 'Barbados', flag: '🇧🇧' },
    { code: '+234', name: 'Nigeria', flag: '🇳🇬' },
    { code: '+254', name: 'Kenya', flag: '🇰🇪' },
    { code: '+233', name: 'Ghana', flag: '🇬🇭' },
    { code: '+251', name: 'Ethiopia', flag: '🇪🇹' },
    { code: '+255', name: 'Tanzania', flag: '🇹🇿' },
    { code: '+256', name: 'Uganda', flag: '🇺🇬' },
    { code: '+244', name: 'Angola', flag: '🇦🇴' },
    { code: '+237', name: 'Cameroon', flag: '🇨🇲' },
    { code: '+225', name: 'Ivory Coast', flag: '🇨🇮' },
    { code: '+221', name: 'Senegal', flag: '🇸🇳' },
    { code: '+263', name: 'Zimbabwe', flag: '🇿🇼' },
    { code: '+260', name: 'Zambia', flag: '🇿🇲' },
    { code: '+250', name: 'Rwanda', flag: '🇷🇼' },
    { code: '+264', name: 'Namibia', flag: '🇳🇦' },
    { code: '+267', name: 'Botswana', flag: '🇧🇼' },
    { code: '+230', name: 'Mauritius', flag: '🇲🇺' },
    { code: '+262', name: 'Réunion', flag: '🇷🇪' },
    { code: '+261', name: 'Madagascar', flag: '🇲🇬' },
  ];

  // Traffic / Referral options
  const referralsList = [
    'Twitter / X',
    'Google Search',
    'Hambar Magazine',
    'Personal Recommendation',
    'LinkedIn',
    'Y Combinator / Startup Forums',
    'Other'
  ];

  // Custom Calendar generation states
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper code to render calendar days
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayIndex = getFirstDayOfMonth(currentMonth, currentYear);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Generate date strings and disable past dates
  const isDateInPast = (day: number) => {
    const testDate = new Date(currentYear, currentMonth, day);
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return testDate < todayMidnight;
  };

  const isTodayDate = (day: number) => {
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  const handleDateSelect = (day: number) => {
    if (isDateInPast(day)) return;
    const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setFormData(prev => ({ ...prev, meetingDate: formattedDate, meetingTimeSlot: '' }));
  };

  // Preset time slots
  const availableSlots = [
    '09:30 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:30 PM'
  ];

  // Validation checks per step
  const canGoNext = () => {
    if (step === 1) {
      return formData.name.trim() !== '' && formData.email.trim() !== '' && formData.phone.trim() !== '';
    }
    if (step === 2) {
      return formData.companyName.trim() !== '' && formData.description.trim() !== '';
    }
    if (step === 3) {
      if (formData.primaryService === 'Other (Specify below)' && formData.otherServiceText.trim() === '') {
        return false;
      }
      return formData.address.trim() !== '';
    }
    if (step === 4) {
      return formData.meetingDate !== '' && formData.meetingTimeSlot !== '';
    }
    return true;
  };

  const handleNext = () => {
    if (canGoNext()) {
      setStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  // Interactive mock file upload
  const processFiles = (filesList: FileList) => {
    const newFiles: FileUploadState[] = Array.from(filesList).map(file => {
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(file.size / 1024).toFixed(0)} KB`;
        
      return {
        name: file.name,
        size: sizeStr,
        progress: 0,
        uploaded: false
      };
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);

    newFiles.forEach((file) => {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 20) + 10;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          setUploadedFiles(prev => prev.map(f => {
            if (f.name === file.name) {
              return { ...f, progress: 100, uploaded: true };
            }
            return f;
          }));
        } else {
          setUploadedFiles(prev => prev.map(f => {
            if (f.name === file.name) {
              return { ...f, progress: currentProgress };
            }
            return f;
          }));
        }
      }, 150);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const fileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Toggle selection for multiple services
  const toggleSubService = (service: string) => {
    setFormData(prev => {
      const exists = prev.additionalServices.includes(service);
      if (exists) {
        return {
          ...prev,
          additionalServices: prev.additionalServices.filter(s => s !== service)
        };
      } else {
        return {
          ...prev,
          additionalServices: [...prev.additionalServices, service]
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingText('Thinking...');
    setSubmitting(true);
    
    // Smooth delay for simulated consulting architecture check and registration
    await new Promise(resolve => setTimeout(resolve, 1400));
    setSubmittingText('Sending...');
    await new Promise(resolve => setTimeout(resolve, 1400));
    
    // Persist to adminStore
    adminStore.addSubmission({
      type: 'booking',
      name: formData.name,
      email: formData.email,
      phone: `${formData.phoneCode} ${formData.phone}`,
      companyName: formData.companyName || undefined,
      description: formData.description,
      ndaRequired: formData.ndaRequired,
      websiteUrl: formData.websiteUrl || undefined,
      howHeard: formData.howHeard,
      primaryService: formData.primaryService,
      additionalServices: formData.additionalServices,
      meetingDate: formData.meetingDate || undefined,
      meetingTimeSlot: formData.meetingTimeSlot || undefined,
      uploadedFilesCount: uploadedFiles.length
    });

    setSubmitting(false);
    setIsCompleted(true);
  };

  const activeCountry = countryCodes.find(c => c.code === formData.phoneCode) || countryCodes[0];

  return (
    <div 
      className={`font-sans text-neutral-900 ${isModal ? 'bg-transparent py-2 px-2' : 'bg-neutral-950 min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8'}`} 
      id="book-consultation-view"
      style={isModal ? { scrollbarWidth: 'none', msOverflowStyle: 'none', overflowY: 'hidden' } : undefined}
    >
      <div className="max-w-4xl mx-auto">
        
        {/* Progress Navigation Header */}
        {!isCompleted && !submitting && (
          <div className={`${isModal ? 'mb-4' : 'mb-10'} text-center space-y-2 animate-fade-in`} id="book-progress-tracker">
            <h1 className={`${isModal ? 'text-2xl font-bold' : 'text-4xl sm:text-6xl font-extrabold'} text-white tracking-tight font-sans`}>Claim Your Solution</h1>

            {/* Elegant Animating Progress Line */}
            <div className="pt-1 max-w-xl mx-auto">
              <div className="w-full bg-neutral-900 h-[3px] rounded-full overflow-hidden border border-neutral-800/80">
                <motion.div 
                  className="bg-gradient-to-r from-brand to-brand-hover h-full" 
                  initial={{ width: '20%' }}
                  animate={{ width: `${(step / 5) * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Content Wizard Body */}
        <AnimatePresence mode="wait">
          {submitting ? (
            /* Circle Completion style dynamic loader with status tracking and percent counter */
            <motion.div 
              key="submitting-state"
              className="bg-[#0c0c0c] border border-neutral-800/80 rounded-3xl p-12 text-center text-white space-y-6 shadow-2xl flex flex-col items-center justify-center min-h-[300px]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="relative w-24 h-24 flex items-center justify-center">
                {/* Completion circular track SVG */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Track Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-neutral-800/80 fill-transparent"
                    strokeWidth="5"
                  />
                  {/* Animated Foreground Progress Circle */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-brand fill-transparent"
                    strokeWidth="5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2.8, ease: "easeInOut" }}
                  />
                </svg>
              </div>
              <motion.div 
                key={submittingText}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-base font-semibold text-neutral-300 font-sans tracking-wide"
              >
                {submittingText}
              </motion.div>
            </motion.div>
          ) : isCompleted ? (
            /* Minimalist green tick SVG and thank you text as requested */
            <motion.div 
              key="completed-state"
              className="bg-[#0c0c0c] border border-neutral-800/80 rounded-[#2rem] p-16 text-center text-white space-y-6 shadow-2xl flex flex-col items-center justify-center min-h-[355px]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 shadow-xl mb-4">
                <svg
                  className="w-8 h-8 text-green-500"
                  viewBox="0 0 52 52"
                >
                  <motion.circle
                    cx="26"
                    cy="26"
                    r="23"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                  <motion.path
                    d="M16 27l7 7 14-14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.5, duration: 0.3, ease: "easeInOut" }}
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white font-sans">
                Thank you
              </h2>
            </motion.div>
          ) : (
            /* Multi step form wizard panel container */
            <motion.form 
              key="wizard-form"
              onSubmit={handleSubmit}
              className={`${isModal ? 'bg-[#090909] border border-neutral-800/60 rounded-2xl p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar-hidden' : 'bg-[#0c0c0c] border border-neutral-800/85 rounded-3xl p-6 sm:p-10 space-y-6'} text-white shadow-2xl relative`}
              style={isModal ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : undefined}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >


              {/* Form Active View Fields */}
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-4 pt-4"
                  >


                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1.5 flex flex-col">
                        <label className="text-xs font-semibold text-neutral-400 font-sans">
                          Your Full Name <span className="text-brand">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                          <input 
                            type="text"
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Hamid Saleem"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors text-white text-xs sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 flex flex-col">
                        <label className="text-xs font-semibold text-neutral-400 font-sans">
                          Your Email Address <span className="text-brand">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                          <input 
                            type="email"
                            required
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            placeholder="hamid@hb-digital.co"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors text-white text-xs sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-semibold text-neutral-400 font-sans">
                        Phone / Signal Number <span className="text-brand">*</span>
                      </label>
                      
                      <div className="flex gap-2 relative">
                        {/* Custom visual country selector */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setIsPhoneDropdownOpen(!isPhoneDropdownOpen)}
                            className="bg-neutral-950 border border-neutral-800 hover:border-neutral-700 h-11 rounded-xl px-3 flex items-center gap-2 text-xs sm:text-sm text-neutral-300 font-medium whitespace-nowrap"
                          >
                            <span>{activeCountry.flag}</span>
                            <span>{activeCountry.code}</span>
                          </button>

                          {isPhoneDropdownOpen && (
                            <div className="absolute left-0 top-14 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl z-50 py-1 w-44 max-h-48 overflow-y-auto">
                              {countryCodes.map((c, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, phoneCode: c.code });
                                    setIsPhoneDropdownOpen(false);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs text-neutral-300 hover:bg-neutral-800/80 transition-colors"
                                >
                                  <span>{c.flag}</span>
                                  <span className="font-sans font-medium">{c.code}</span>
                                  <span className="text-neutral-500 text-[10px] truncate">{c.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Text Phone Input */}
                        <div className="relative flex-grow">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                          <input 
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="(555) 000-0000"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors text-white text-xs sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-4 pt-4"
                  >


                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 flex flex-col">
                        <label className="text-xs font-semibold text-neutral-400 font-sans">
                          Company Name <span className="text-brand">*</span>
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                          <input 
                            type="text"
                            required
                            value={formData.companyName}
                            onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                            placeholder="My Startup LLC / Personal Brand"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors text-white text-xs sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 flex flex-col">
                        <label className="text-xs font-semibold text-neutral-400 font-sans">
                          Website URL (Optional)
                        </label>
                        <div className="relative">
                          <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                          <input 
                            type="url"
                            value={formData.websiteUrl}
                            onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })}
                            placeholder="https://yoursite.com"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors text-white text-xs sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Description Paragraph Container */}
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-semibold text-neutral-400 font-sans">
                        Tell us about your project or core bottlenecks <span className="text-brand">*</span>
                      </label>
                      <textarea 
                        required
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Please details what spreadsheets need automation, system load targets, cloud budgets, or website ranking objectives."
                        rows={4}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand transition-colors text-white leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Interactive NDA Toggle Switch Cards */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-neutral-400 font-sans block">
                          Is Mutual NDA Required?
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, ndaRequired: 'yes' })}
                            className={`py-2.5 px-3 rounded-xl border text-xs font-medium font-sans text-center transition-all ${
                              formData.ndaRequired === 'yes'
                                ? 'bg-brand/10 border-brand text-brand'
                                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                            }`}
                          >
                            ⚠️ YES, NDA
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, ndaRequired: 'no' })}
                            className={`py-2.5 px-3 rounded-xl border text-xs font-medium font-sans text-center transition-all ${
                              formData.ndaRequired === 'no'
                                ? 'bg-neutral-950 border-neutral-800 text-neutral-300'
                                : 'bg-neutral-950 border-neutral-800 text-neutral-500 hover:border-neutral-700'
                            }`}
                          >
                            No NDA Needed
                          </button>
                        </div>
                      </div>

                      {/* Referral source Dropdown select box */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-neutral-400 font-sans block">
                          How did you hear about us?
                        </label>
                        <div className="relative bg-neutral-950 rounded-xl">
                          <HelpCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                          <select
                            value={formData.howHeard}
                            onChange={e => setFormData({ ...formData, howHeard: e.target.value })}
                            className="w-full bg-transparent border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-brand transition-colors text-white appearance-none cursor-pointer"
                          >
                            {referralsList.map((refSource, idx) => (
                              <option key={idx} value={refSource} className="bg-neutral-900">{refSource}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-4 pt-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Service Standard select box with optgroups */}
                      <div className="space-y-1.5 flex flex-col">
                        <label className="text-xs font-semibold text-neutral-400 font-sans">
                          Primary Service Required <span className="text-brand">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={formData.primaryService}
                            onChange={e => setFormData({ ...formData, primaryService: e.target.value })}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-brand transition-colors text-white appearance-none cursor-pointer"
                          >
                            <option value="" disabled className="bg-neutral-900">Select a primary service...</option>
                            {serviceCategories.map((cat, i) => (
                              <optgroup key={i} label={cat.name} className="bg-neutral-900 text-brand font-bold">
                                {cat.services.map((svc, sIdx) => (
                                  <option key={sIdx} value={svc.name} className="bg-neutral-900 text-white font-normal">{svc.name}</option>
                                ))}
                              </optgroup>
                            ))}
                            <option value="Other (Specify below)" className="bg-neutral-900 text-white font-normal">Other (Specify below)</option>
                          </select>
                        </div>
                      </div>

                      {/* Operational Address */}
                      <div className="space-y-1.5 flex flex-col">
                        <label className="text-xs font-semibold text-neutral-400 font-sans">
                          Operational/Postal Address <span className="text-brand">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                          <input 
                            type="text"
                            required
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                            placeholder="123 Silicon Boulevard, SF"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors text-white text-xs sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {formData.primaryService === 'Other (Specify below)' && (
                      <div className="space-y-1.5 flex flex-col animate-fade-in">
                        <label className="text-xs font-semibold text-neutral-400 font-sans">
                          Please specify custom engineering target below <span className="text-brand">*</span>
                        </label>
                        <input 
                          type="text"
                          required
                          value={formData.otherServiceText}
                          onChange={e => setFormData({ ...formData, otherServiceText: e.target.value })}
                          placeholder="E.g., Custom computer vision pipeline deployment"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-brand transition-colors text-white"
                        />
                      </div>
                    )}

                    {/* Add option should give a dropdown to add additional services max 3 */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-neutral-400 font-sans block">
                        Add Additional Services (Max 3)
                      </label>
                      <select
                        value=""
                        disabled={formData.additionalServices.length >= 3}
                        onChange={e => {
                          const val = e.target.value;
                          if (val && !formData.additionalServices.includes(val) && formData.additionalServices.length < 3) {
                            setFormData(prev => ({
                              ...prev,
                              additionalServices: [...prev.additionalServices, val]
                            }));
                          }
                        }}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-brand transition-colors text-white disabled:opacity-50 appearance-none cursor-pointer text-neutral-350"
                      >
                        <option value="" className="bg-neutral-900 text-neutral-500">
                          {formData.additionalServices.length >= 3 
                            ? 'Maximum of 3 additional services reached' 
                            : 'Choose additional service to add...'}
                        </option>
                        {serviceCategories.map((cat, i) => (
                          <optgroup key={i} label={cat.name} className="bg-neutral-900 text-neutral-400">
                            {cat.services.map((svc, sIdx) => {
                              const isSelectedPrimary = formData.primaryService === svc.name;
                              const isSelectedAdditional = formData.additionalServices.includes(svc.name);
                              return (
                                <option 
                                  key={sIdx} 
                                  value={svc.name} 
                                  disabled={isSelectedPrimary || isSelectedAdditional}
                                  className="bg-neutral-900 text-white disabled:opacity-40"
                                >
                                  {svc.name}
                                </option>
                              );
                            })}
                          </optgroup>
                        ))}
                      </select>

                      {/* Displaying selected additional services with remove mechanism */}
                      {formData.additionalServices.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {formData.additionalServices.map((subSvc, i) => (
                            <span 
                              key={i} 
                              className="inline-flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-brand animate-fade-in"
                            >
                              <span>{subSvc}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    additionalServices: prev.additionalServices.filter(s => s !== subSvc)
                                  }));
                                }}
                                className="text-neutral-500 hover:text-red-400 ml-1 font-bold focus:outline-none text-[14px]"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Integrated Drag & Drop / Click manual Files Uploader */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-neutral-400 font-sans block">
                        Attach Reference Assets / Brief specifications PDF (Optional)
                      </label>
                      <div 
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                          dragActive 
                            ? 'border-brand bg-brand/5' 
                            : 'border-neutral-800/80 bg-neutral-950 hover:border-neutral-700'
                        }`}
                      >
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={fileSelected}
                          multiple
                          className="hidden" 
                        />
                        <Upload className="mx-auto w-5 h-5 text-neutral-500 mb-2 animate-bounce" />
                        <p className="text-xs font-medium text-neutral-300">
                          Drag and Drop assets here or <span className="text-brand hover:underline">browse files</span>
                        </p>
                        <p className="text-[10px] text-neutral-500 mt-1">
                          Accepts PDF, DOCX, ZIP, PNG, JSON up to 35MB
                        </p>
                      </div>

                      {/* Displaying Upload progress files */}
                      {uploadedFiles.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <span className="text-[10px] font-sans font-bold text-neutral-500 uppercase">Uploaded Attachments:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {uploadedFiles.map((file, idx) => (
                              <div key={idx} className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <FileText className="w-5 h-5 text-neutral-400 shrink-0" />
                                  <div className="overflow-hidden">
                                    <p className="text-neutral-200 truncate font-medium text-[11px]">{file.name}</p>
                                    <p className="text-neutral-500 text-[10px] font-sans font-medium">{file.size}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  {!file.uploaded ? (
                                    <div className="w-8 bg-neutral-900 h-1 rounded-full overflow-hidden">
                                      <div className="bg-brand h-full" style={{ width: `${file.progress}%` }} />
                                    </div>
                                  ) : (
                                    <span className="text-[10px] text-green-400 font-semibold font-sans">100% DONE</span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeFile(idx);
                                    }}
                                    className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-4 pt-4"
                  >


                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                      
                      {/* Premium Custom Local Calendar Selector Component */}
                      <div className="md:col-span-7 bg-neutral-950 border border-neutral-800 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-sans font-bold text-neutral-300">
                            {months[currentMonth]} {currentYear}
                          </span>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={prevMonth}
                              className="p-1 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-lg text-neutral-300"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={nextMonth}
                              className="p-1 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-lg text-neutral-300"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Calendar Grid Header */}
                        <div className="grid grid-cols-7 gap-1 text-center font-sans text-[10px] font-bold text-neutral-500 mb-2 tracking-wider">
                          <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                        </div>

                        {/* Month Days Block grid slots */}
                        <div className="grid grid-cols-7 gap-1 text-center text-xs">
                          {/* Offset placeholders */}
                          {Array.from({ length: firstDayIndex }).map((_, i) => (
                            <div key={`empty-${i}`} className="p-2" />
                          ))}

                          {/* Render Days */}
                          {Array.from({ length: daysInMonth }).map((_, i) => {
                            const dayNum = i + 1;
                            const isPast = isDateInPast(dayNum);
                            const isToday = isTodayDate(dayNum);
                            
                            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                            const isSelected = formData.meetingDate === dateStr;

                            return (
                              <button
                                key={`day-${dayNum}`}
                                type="button"
                                disabled={isPast}
                                onClick={() => handleDateSelect(dayNum)}
                                className={`p-2 rounded-xl transition-all relative font-medium ${
                                  isPast 
                                    ? 'text-neutral-700 line-through cursor-not-allowed opacity-25' 
                                    : isSelected 
                                      ? 'bg-brand text-black font-extrabold shadow-md shadow-brand/10' 
                                      : isToday 
                                        ? 'border border-brand/50 text-neutral-200' 
                                        : 'hover:bg-neutral-900 text-neutral-300 animate-fade-in'
                                }`}
                              >
                                {dayNum}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Pick Time Slots pill selection */}
                      <div className="md:col-span-5 space-y-4">
                        <span className="text-xs font-semibold text-neutral-400 font-sans block">
                          Picked Date:
                        </span>
                        <div className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-300 font-sans font-bold text-center tracking-normal">
                          {formData.meetingDate ? formData.meetingDate : 'Select Date on Calendar first'}
                        </div>

                        {formData.meetingDate && (
                          <div className="space-y-3">
                            <span className="text-xs font-semibold text-neutral-400 font-sans block">
                              Available Hour Slots:
                            </span>
                            <div className="grid grid-cols-1 gap-2">
                              {availableSlots.map((slotTime, slotIdx) => {
                                const activeSlot = formData.meetingTimeSlot === slotTime;
                                return (
                                  <button
                                    key={slotIdx}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, meetingTimeSlot: slotTime })}
                                    className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all text-center flex items-center justify-between ${
                                      activeSlot
                                        ? 'bg-brand border-transparent text-black shadow-lg'
                                        : 'bg-neutral-950 border-neutral-800 text-neutral-350 hover:border-neutral-700'
                                    }`}
                                  >
                                    <span className="font-sans font-medium">{slotTime}</span>
                                    <span className={`text-[10px] font-sans font-bold ${activeSlot ? 'text-black/80' : 'text-neutral-400'}`}>
                                      {activeSlot ? '✓ Selected' : 'Reserve'}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div
                    key="step-5"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-6 pt-4"
                  >


                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Left: Metadata Details */}
                      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between text-xs">
                        <div className="border-b border-neutral-900 pb-2">
                          <span className="font-sans block text-[10px] font-bold text-neutral-400 mb-0.5">Your Full Name:</span>
                          <span className="text-white font-bold">{formData.name}</span>
                        </div>
                        <div className="border-b border-neutral-900 pb-2">
                          <span className="font-sans block text-[10px] font-bold text-neutral-400 mb-0.5">Email Destination:</span>
                          <span className="text-white font-bold">{formData.email}</span>
                        </div>
                        <div className="border-b border-neutral-900 pb-2">
                          <span className="font-sans block text-[10px] font-bold text-neutral-400 mb-0.5">Phone Network:</span>
                          <span className="text-white font-sans font-semibold">{formData.phoneCode} {formData.phone}</span>
                        </div>
                        <div className="border-b border-neutral-900 pb-2">
                          <span className="font-sans block text-[10px] font-bold text-neutral-400 mb-0.5">NDA Mutual status:</span>
                          <span className="text-white font-semibold flex items-center gap-1">
                            {formData.ndaRequired === 'yes' ? '⚠️ Yes, request signed briefing mutual NDA' : 'Standard briefing'}
                          </span>
                        </div>
                        <div>
                          <span className="font-sans block text-[10px] font-bold text-neutral-400 mb-0.5">Address:</span>
                          <span className="text-white font-semibold line-clamp-1">{formData.address}</span>
                        </div>
                      </div>

                      {/* Right: Architecture details */}
                      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between text-xs">
                        <div className="border-b border-neutral-900 pb-2">
                          <span className="font-sans block text-[10px] font-bold text-neutral-400 mb-0.5">Current Project Company:</span>
                          <span className="text-white font-bold">{formData.companyName}</span>
                        </div>
                        {formData.websiteUrl && (
                          <div className="border-b border-neutral-900 pb-2">
                            <span className="font-sans block text-[10px] font-bold text-neutral-400 mb-0.5">Website Domain:</span>
                            <span className="text-white font-medium underline select-all">{formData.websiteUrl}</span>
                          </div>
                        )}
                        <div className="border-b border-neutral-900 pb-2">
                          <span className="font-sans block text-[10px] font-bold text-neutral-400 mb-0.5">Primary Tech Needed:</span>
                          <span className="text-white font-medium text-neutral-300 font-sans">
                            {formData.primaryService === 'Other (Specify below)' ? formData.otherServiceText : formData.primaryService}
                          </span>
                        </div>

                        {formData.additionalServices.length > 0 && (
                          <div className="border-b border-neutral-900 pb-2">
                            <span className="font-sans block text-[10px] font-bold text-neutral-400 mb-0.5">Support Verticals:</span>
                            <div className="flex flex-wrap gap-1 mt-1 font-sans">
                              {formData.additionalServices.map((as, asI) => (
                                <span key={asI} className="bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded text-[10px] text-neutral-300 font-semibold font-sans">
                                  {as}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <span className="font-sans block text-[10px] font-bold text-neutral-400 mb-0.5">Consultation Bloc:</span>
                          <span className="bg-brand/10 text-brand border border-brand/20 px-2.5 py-1 rounded text-[11px] font-sans font-bold block w-fit">
                            {formData.meetingDate} @ {formData.meetingTimeSlot}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description Paragraph brief box */}
                    <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 text-xs space-y-1">
                      <span className="font-sans block text-[10px] font-bold text-neutral-400">Project Spec details:</span>
                      <p className="text-neutral-300 leading-relaxed italic font-sans">
                        "{formData.description}"
                      </p>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="p-1">
                        <span className="font-sans block text-[10px] font-bold text-neutral-400 mb-1">Attached Assets:</span>
                        <div className="flex flex-wrap gap-1 font-sans">
                          {uploadedFiles.map((file, idx) => (
                            <span key={idx} className="bg-neutral-900 border border-neutral-800 text-[10px] px-2 py-1 rounded text-neutral-300 flex items-center gap-1.5 font-sans">
                              📎 {file.name} ({file.size})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Wizard Control Action bar */}
              <div className="flex items-center justify-between border-t border-neutral-900 pt-6 mt-4">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="group py-3 px-6 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-sans font-bold text-neutral-400 hover:text-white rounded-full transition-colors flex items-center gap-2"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 5 ? (
                  <Button
                    type="button"
                    disabled={!canGoNext()}
                    onClick={async () => {
                      await new Promise(r => setTimeout(r, 600));
                      handleNext();
                    }}
                    className={`bg-brand hover:bg-brand-hover text-black rounded-full font-bold px-8 py-5 ring-brand min-w-[180px] text-sm flex items-center justify-center transition-all ${
                      !canGoNext() ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <span className="flex items-center gap-2 justify-center font-bold text-black bg-transparent">
                      <span>Continue</span>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </Button>
                ) : (
                  /* Form trigger final button - utilizing stateful button component style matching Hero CTA exactly */
                  <Button
                    type="submit"
                    className="bg-brand hover:bg-brand-hover text-black rounded-full font-bold px-8 py-5 ring-brand min-w-[240px] text-sm flex items-center justify-center transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-2 justify-center font-bold text-black bg-transparent">
                      <span>Claim Your Solution</span>
                      <Send className="w-4 h-4" />
                    </span>
                  </Button>
                )}
              </div>
            </motion.form>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

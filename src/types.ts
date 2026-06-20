export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  services: Service[];
}

export interface MajorServiceDetail {
  slug: string;
  title: string;
  tagline: string;
  overview: string;
  problemsSolved: string[];
  benefits: string[];
  process: string[];
  deliverables: string[];
  whyChooseUs: string[];
  relatedServices: { name: string; slug: string }[];
  faqs: { question: string; answer: string }[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  tags: string[];
  status?: 'published' | 'draft';
  imageUrl?: string;
  authorEmail?: string;
  isLocalOnly?: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  client: string;
  description: string;
  image: string;
  tags: string[];
  metrics: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  serviceId?: string;
  serviceLink?: string;
}

export interface IndustryDetail {
  id: string;
  name: string;
  description: string;
}

export type ActivePage = 
  | 'home'
  | 'services'
  | 'projects'
  | 'magazine'
  | 'about'
  | 'contact'
  | 'book'
  | 'industries'
  | 'admin'
  | 'service-detail'; // for major individual service pages

import { majorServicesDetails, serviceCategories } from '../data';
import { ActivePage } from '../types';

const SITE_NAME = 'Hambar';
const SITE_URL = 'https://hambar.co.uk';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

type SeoConfig = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
};

const pageSeo: Partial<Record<ActivePage, SeoConfig>> = {
  home: {
    title: 'Hambar | AI, Software Development & SEO Growth Consultancy',
    description:
      'Hambar helps businesses build custom software, automate workflows with AI, improve SEO, and scale secure digital operations.',
    path: '/',
  },
  services: {
    title: 'Services | Hambar AI, Software, SEO & Automation',
    description:
      'Explore Hambar services including AI automation, custom software, SEO, cloud infrastructure, cybersecurity, and digital transformation.',
    path: '/services',
  },
  projects: {
    title: 'Projects | Hambar Software, AI & Digital Growth Work',
    description:
      'See Hambar project examples across custom software, AI automation, ecommerce platforms, healthcare portals, and SEO-led growth systems.',
    path: '/projects',
  },
  magazine: {
    title: 'Magazine | Hambar AI, SEO & Technology Insights',
    description:
      'Read Hambar insights on AI automation, SEO, software development, cybersecurity, cloud infrastructure, and business technology strategy.',
    path: '/magazine',
  },
  about: {
    title: 'About Hambar | Hamid Saleem & Babar Naeem',
    description:
      'Learn about Hambar, founded by Hamid Saleem and Babar Naeem to help businesses build smarter software, AI, SEO, and growth systems.',
    path: '/about',
  },
  contact: {
    title: 'Contact Hambar | Discuss Your Technology Project',
    description:
      'Contact Hambar to discuss AI automation, custom software, SEO, cloud systems, cybersecurity, or digital transformation projects.',
    path: '/contact',
  },
  book: {
    title: 'Get a Quote | Hambar Project Consultation',
    description:
      'Request a Hambar project quote for custom software, AI automation, SEO, website development, cloud infrastructure, or technology consulting.',
    path: '/book',
  },
  admin: {
    title: 'Admin | Hambar',
    description: 'Private Hambar administration area.',
    path: '/admin',
    noindex: true,
  },
};

const findService = (slug: string) => {
  const detail = majorServicesDetails[slug];
  const service = serviceCategories
    .flatMap((category) => category.services)
    .find((item) => item.id === slug);

  return { detail, service };
};

const normalizeDescription = (description: string, maxLength = 155) => {
  const clean = description.replace(/\s+/g, ' ').trim();

  if (clean.length <= maxLength) {
    return clean;
  }

  const truncated = clean.slice(0, maxLength - 1).replace(/\s+\S*$/, '');
  return `${truncated}.`;
};

export const getSeoConfig = (page: ActivePage, serviceSlug = ''): SeoConfig => {
  if (page === 'service-detail' && serviceSlug) {
    const { detail, service } = findService(serviceSlug);
    const serviceName = detail?.title || service?.name || 'Business Technology Service';
    const serviceDescription =
      detail?.tagline ||
      service?.description ||
      `Explore ${serviceName} from Hambar for secure, scalable business technology delivery.`;

    return {
      title: `${serviceName} | Hambar Services`,
      description: normalizeDescription(
        `${serviceDescription} Work with Hambar for secure, scalable implementation.`,
      ),
      path: `/services/${encodeURIComponent(serviceSlug)}`,
    };
  }

  return pageSeo[page] || pageSeo.home!;
};

const upsertMeta = (attribute: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

const upsertLink = (rel: string, href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
};

const upsertJsonLd = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: DEFAULT_IMAGE,
    sameAs: ['https://www.linkedin.com/company/hambarcouk/', 'https://x.com/hambarcouk'],
    founder: [
      { '@type': 'Person', name: 'Hamid Saleem' },
      { '@type': 'Person', name: 'Babar Naeem' },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+92-335-6924128',
      contactType: 'customer support',
    },
  };

  let element = document.getElementById('hambar-organization-jsonld') as HTMLScriptElement | null;

  if (!element) {
    element = document.createElement('script');
    element.id = 'hambar-organization-jsonld';
    element.type = 'application/ld+json';
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(structuredData);
};

export const applySeo = (page: ActivePage, serviceSlug = '') => {
  const seo = getSeoConfig(page, serviceSlug);
  const url = `${SITE_URL}${seo.path === '/' ? '/' : seo.path}`;

  document.title = seo.title;

  upsertMeta('name', 'description', seo.description);
  upsertMeta('name', 'robots', seo.noindex ? 'noindex,nofollow' : 'index,follow');
  upsertLink('canonical', url);

  upsertMeta('property', 'og:site_name', SITE_NAME);
  upsertMeta('property', 'og:type', 'website');
  upsertMeta('property', 'og:title', seo.title);
  upsertMeta('property', 'og:description', seo.description);
  upsertMeta('property', 'og:url', url);
  upsertMeta('property', 'og:image', DEFAULT_IMAGE);

  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', seo.title);
  upsertMeta('name', 'twitter:description', seo.description);
  upsertMeta('name', 'twitter:image', DEFAULT_IMAGE);

  upsertJsonLd();
};

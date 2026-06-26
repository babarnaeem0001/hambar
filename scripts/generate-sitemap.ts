import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { majorServicesDetails, serviceCategories } from '../src/data';

const siteUrl = 'https://hambar.co.uk';
const lastmod = new Date().toISOString().slice(0, 10);
const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

const publicRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/services', changefreq: 'weekly', priority: '0.9' },
  { path: '/projects', changefreq: 'monthly', priority: '0.8' },
  { path: '/magazine', changefreq: 'weekly', priority: '0.8' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
  { path: '/book', changefreq: 'monthly', priority: '0.7' },
];

const serviceSlugs = Array.from(
  new Set([
    ...serviceCategories.flatMap((category) => category.services.map((service) => service.id)),
    ...Object.keys(majorServicesDetails),
  ]),
).sort();

const serviceRoutes = serviceSlugs.map((slug) => ({
  path: `/services/${slug}`,
  changefreq: 'monthly',
  priority: '0.7',
}));

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const absoluteUrl = (path: string) => `${siteUrl}${path === '/' ? '/' : path}`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...publicRoutes, ...serviceRoutes]
  .map(
    (route) => `  <url>
    <loc>${escapeXml(absoluteUrl(route.path))}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${siteUrl}/sitemap.xml
`;

mkdirSync(publicDir, { recursive: true });
writeFileSync(join(publicDir, 'sitemap.xml'), sitemap);
writeFileSync(join(publicDir, 'robots.txt'), robots);

console.log(`Generated ${publicRoutes.length + serviceRoutes.length} sitemap URLs for ${siteUrl}`);

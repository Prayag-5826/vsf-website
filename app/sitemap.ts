import { MetadataRoute } from 'next';
import districtsData from '@/data/districts.json';

// All official MP districts + industrial hubs (only keep 'pithampur' if your city page has data for it)
const allDistricts = [
  'indore', 'bhopal', 'dewas', 'ujjain', 'gwalior', 'jabalpur',
  'ratlam', 'satna', 'sagar', 'rewa', 'khandwa', 'singrauli', 'neemuch', 'katni',
  'agar-malwa', 'alirajpur', 'anuppur', 'ashoknagar', 'balaghat', 'barwani',
  'betul', 'bhind', 'burhanpur', 'chhatarpur', 'chhindwara', 'damoh', 'datia',
  'dhar', 'dindori', 'guna', 'harda', 'hoshangabad', 'jhabua', 'khargone',
  'mandla', 'mandsaur', 'morena', 'narsinghpur', 'niwari', 'panna', 'raisen',
  'rajgarh', 'sehore', 'seoni', 'shahdol', 'shajapur', 'sheopur', 'shivpuri',
  'sidhi', 'tikamgarh', 'umaria', 'vidisha', 'mauganj', 'pandhurna', 'maihar'
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://vidhyasecurityforce.in';
  const currentDate = new Date();

  // 1. Static Brand & Compliance Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cities`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compliance`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/certifications`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // 2. Active Service Pages (Matches serviceDirectory keys in [slug]/page.tsx)
  const serviceSlugs = [
    'security-guard',
    'housekeeping',
    'armed-gunman',
    'bouncers',
    'commercial-access-security',
    'industrial-gate-material-control',
    'factory-yard-perimeter-patrol',
    'corporate-office-housekeeping',
    'industrial-shopfloor-corridor-care',
  ];

  const serviceRoutes: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: ['security-guard', 'housekeeping'].includes(slug) ? 0.9 : 0.8,
  }));

  // 3. Programmatic City & District Hubs
  const jsonSlugs = (districtsData as Array<{ slug: string }>).map((d) => d.slug.toLowerCase());
  const combinedCitySlugs = Array.from(new Set([...jsonSlugs, ...allDistricts]));

  const cityRoutes: MetadataRoute.Sitemap = combinedCitySlugs.map((slug) => {
    const isMajorHub = ['indore', 'bhopal', 'dewas', 'ujjain', 'gwalior', 'jabalpur', 'dhar'].includes(slug);

    return {
      url: `${baseUrl}/cities/${slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: isMajorHub ? 0.9 : 0.7,
    };
  });

  return [...staticRoutes, ...serviceRoutes, ...cityRoutes];
}

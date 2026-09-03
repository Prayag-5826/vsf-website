import { MetadataRoute } from 'next';
import districtsData from '@/data/districts.json';

// Complete list of all 55 districts in Madhya Pradesh
const all55Districts = [
  'indore', 'pithampur', 'bhopal', 'dewas', 'ujjain', 'gwalior', 'jabalpur',
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

  // 1. Core Primary Website Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/cities`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/security-guard`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/armed-gunman`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/housekeeping`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/bouncers`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // 2. Programmatic Districts & Corridor URLs
  const jsonSlugs = districtsData.map((d: { slug: string }) => d.slug.toLowerCase());
  const combinedSlugs = Array.from(new Set([...jsonSlugs, ...all55Districts]));

  const cityRoutes: MetadataRoute.Sitemap = combinedSlugs.map((slug) => {
    const isMajorHub = ['indore', 'pithampur', 'bhopal', 'dewas', 'gwalior', 'jabalpur'].includes(slug);

    return {
      url: `${baseUrl}/cities/${slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: isMajorHub ? 0.9 : 0.8,
    };
  });

  return [...staticRoutes, ...cityRoutes];
}

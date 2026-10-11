import { MetadataRoute } from 'next';
import { districtProfiles } from '@/data/district-profiles';

// 7 cities with hand-written pages + every district profile in data/district-profiles.ts
const indexableCities = Array.from(
  new Set(['indore', 'pithampur', 'bhopal', 'dewas', 'ujjain', 'gwalior', 'jabalpur', ...Object.keys(districtProfiles)])
);

// Only the pages linked from /services. The other 4 slugs redirect (see next.config.ts).
const serviceSlugs = [
  'security-guard',
  'armed-gunman',
  'housekeeping',
  'bouncers',
  'industrial-gate-material-control',
  'factory-yard-perimeter-patrol',
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

  const serviceRoutes: MetadataRoute.Sitemap = serviceSlugs.map((slug, i) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: i < 3 ? 0.9 : 0.8,
  }));

  // 2. Programmatic Districts & Corridor URLs
  const combinedSlugs = indexableCities;

  const cityRoutes: MetadataRoute.Sitemap = combinedSlugs.map((slug) => {
    const isMajorHub = ['indore', 'pithampur', 'bhopal'].includes(slug);

    return {
      url: `${baseUrl}/cities/${slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: isMajorHub ? 0.9 : 0.8,
    };
  });

  return [...staticRoutes, ...serviceRoutes, ...cityRoutes];
}

import { MetadataRoute } from 'next';
import districts from '@/data/districts.json';

const BASE_URL = 'https://vidhyasecurityforce.in';

export default function sitemap(): MetadataRoute.Sitemap {
  // Static Core Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/cities`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];

  // Specific Service Pages
  const serviceSlugs = [
    'armed-security-guards',
    'industrial-gate-security',
    'vip-bouncers',
    'mobile-patrol-supervision',
    'corporate-housekeeping',
    'industrial-factory-housekeeping',
    'residential-township-facility',
  ];

  const serviceRoutes: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${BASE_URL}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Dynamic MP District Pages (Rank #1 for all MP cities)
  const districtRoutes: MetadataRoute.Sitemap = districts.map((district) => ({
    url: `${BASE_URL}/cities/${district.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [...staticRoutes, ...serviceRoutes, ...districtRoutes];
}

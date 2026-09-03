import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://vidhyasecurityforce.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/cities/',
          '/services/',
          '/about',
          '/contact',
          '/_next/static/',
          '/_next/image',
          '/assets/',
        ],
        disallow: [
          '/api/',
          '/_next/data/',
          '/admin/',
          '/admin',
          '/field/',
          '/field',
          '/auth/',
          '/drafts/',
          '/preview/',
          '/*?*', // Disallow crawling search/query parameter variations to prevent duplicate content
        ],
      },
      {
        // Dedicated directives for Googlebot & Googlebot-Image
        userAgent: ['Googlebot', 'Googlebot-Image'],
        allow: [
          '/',
          '/cities/',
          '/services/',
          '/assets/',
          '/_next/image',
          '/_next/static/media/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/field/',
          '/*?*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

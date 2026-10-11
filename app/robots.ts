import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://vidhyasecurityforce.in';

  return {
    rules: [
      {
        // One group for every crawler (Googlebot included), so the rules can't drift apart.
        userAgent: '*',
        allow: ['/', '/_next/static/', '/_next/image', '/assets/'],
        disallow: [
          '/api/',
          '/_next/data/',
          '/admin',
          '/login',
          '/field',
          '/auth/',
          '/drafts/',
          '/preview/',
          '/*?*', // skip query-string duplicates (the more specific /_next/image allow above still wins)
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

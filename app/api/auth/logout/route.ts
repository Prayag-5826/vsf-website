import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.headers.set('Cache-Control', 'no-store');

  const host = (req.headers.get('host') || '').split(':')[0];
  const isProdDomain = host.endsWith('vidhyasecurityforce.in');
  const secure = req.nextUrl.protocol === 'https:' || isProdDomain;

  // Only use domains the browser will actually accept for this host
  const domains: (string | undefined)[] = [undefined]; // host-only cookie
  if (isProdDomain) {
    domains.push('.vidhyasecurityforce.in', 'vidhyasecurityforce.in', host);
  }

  for (const { name } of req.cookies.getAll()) {
    for (const domain of domains) {
      const parts = [
        `${name}=`,
        'Path=/',
        'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'Max-Age=0',
        'SameSite=Lax',
        'HttpOnly',
      ];
      if (secure) parts.push('Secure');
      if (domain) parts.push(`Domain=${domain}`);

      // append() keeps every header; cookies.set() would overwrite by name
      response.headers.append('Set-Cookie', parts.join('; '));
    }
  }

  return response;
}

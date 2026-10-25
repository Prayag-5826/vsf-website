import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  const response = NextResponse.json({ success: true });

  // List of domains to purge cookies across
  const domains = [
    undefined, // Current host
    '.vidhyasecurityforce.in',
    'vidhyasecurityforce.in',
    'admin.vidhyasecurityforce.in'
  ];

  // Purge all cookies (including HttpOnly Supabase tokens)
  for (const cookie of allCookies) {
    for (const domain of domains) {
      response.cookies.set({
        name: cookie.name,
        value: '',
        expires: new Date(0),
        path: '/',
        domain: domain,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    }
  }

  return response;
}

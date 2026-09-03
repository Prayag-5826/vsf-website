import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const { pathname } = request.nextUrl;
  const isAccessingAdmin = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/login';

  // 1. Check custom SSO session cookies first
  const ssoSession = request.cookies.get('vsf_user_session');
  const universalToken = request.cookies.get('vsf_universal_token');
  let hasValidSession = Boolean(ssoSession?.value || universalToken?.value);

  // 2. Check Supabase Auth if SSO cookies are not found
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!hasValidSession && supabaseUrl && supabaseAnonKey) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: CookieToSet[]) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        hasValidSession = true;
      }
    } catch (error) {
      console.error('Middleware Auth Execution Error:', error);
    }
  }

  // 3. Unauthenticated users trying to access /admin -> Redirect to /login
  if (isAccessingAdmin && !hasValidSession) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirect', request.nextUrl.href);
    return NextResponse.redirect(redirectUrl);
  }

  // 4. Authenticated users visiting /login -> Redirect to /admin
  if (isLoginPage && hasValidSession) {
    const redirectParam = request.nextUrl.searchParams.get('redirect');
    if (
      redirectParam &&
      (redirectParam.startsWith('https://field.vidhyasecurityforce.in') ||
        redirectParam.startsWith('http://localhost'))
    ) {
      return NextResponse.redirect(new URL(redirectParam));
    }

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/admin';
    redirectUrl.search = '';
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};

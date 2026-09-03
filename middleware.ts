import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const { pathname } = request.nextUrl;
  const isAdminSubdomain = hostname.startsWith('admin.');

  // 1. Resolve Effective Admin Path (Accounts for subdomain rewrite)
  // On admin.vidhyasecurityforce.in, '/' routes to '/admin'
  let effectivePath = pathname;
  if (isAdminSubdomain && !pathname.startsWith('/admin')) {
    effectivePath = pathname === '/' ? '/admin' : `/admin${pathname}`;
  }

  const isAccessingAdmin = effectivePath.startsWith('/admin');
  const isLoginPage = pathname === '/login' || effectivePath === '/admin/login';

  // 2. Initialize Response with Subdomain Rewrite (if applicable)
  let response = NextResponse.next({ request });

  if (isAdminSubdomain) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = effectivePath;
    response = NextResponse.rewrite(rewriteUrl);
  }

  // 3. Verify SSO Session Cookies First
  const ssoSession = request.cookies.get('vsf_user_session');
  const universalToken = request.cookies.get('vsf_universal_token');
  let hasValidSession = Boolean(ssoSession?.value || universalToken?.value);

  // 4. Verify Supabase Session if SSO Cookies are Absent
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

            // Re-apply rewrite header state if on admin subdomain
            if (isAdminSubdomain) {
              const rewriteUrl = request.nextUrl.clone();
              rewriteUrl.pathname = effectivePath;
              response = NextResponse.rewrite(rewriteUrl);
            } else {
              response = NextResponse.next({ request });
            }

            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
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

  // 5. Unauthenticated User Accessing Admin Area -> Redirect to /login
  if (isAccessingAdmin && !hasValidSession) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirect', request.nextUrl.href);

    // If already on admin subdomain, send to root domain login or keep local
    if (isAdminSubdomain) {
      redirectUrl.host = hostname.replace(/^admin\./, '');
    }

    return NextResponse.redirect(redirectUrl);
  }

  // 6. Authenticated User Accessing Login Page -> Redirect to Admin
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
    if (isAdminSubdomain) {
      redirectUrl.pathname = '/';
    } else {
      redirectUrl.pathname = '/admin';
    }
    redirectUrl.search = '';
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  // Matches all routes except static assets, media, and public metadata
  matcher: [
    '/((?!api/|_next/static/|_next/image|assets/|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

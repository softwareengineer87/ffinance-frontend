import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import { deleteCookie } from "cookies-next/client";
import { jwtDecode } from 'jwt-decode';
const publicRoutes = [
  { path: '/sign-in', whenAthenticated: 'redirect' },
  { path: '/webdesign/signup', whenAthenticated: 'next' },
] as const;

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find((route) => route.path === path);
  const authToken = request.cookies.get('token-finance');

  const signInUrl = new URL('sign-in', request.url).pathname;

  // 1. Permite acesso à página de login
  if (path === signInUrl) {
    return NextResponse.next();
  }

  if (authToken?.value) {
    try {
      const decoded: { exp?: number } = jwtDecode(authToken.value);
      const currentTime = Math.floor(Date.now() / 1000);

      // 1. O token está expirado?
      if (decoded.exp && currentTime > decoded.exp) {
        deleteCookie('token-finance');
        console.log('Token expirado. Redirecionando...');
        // O return aqui está correto
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }

      // 2. Se o token for válido, continue a requisição
      return NextResponse.next();

    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      // O token é inválido ou malformado, redireciona para o login
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  if (!authToken && publicRoute) {
    return NextResponse.next();
  }


  if (!authToken && !publicRoute) {
    return NextResponse.redirect(new URL('sign-in', request.url));
  }

  if (authToken && publicRoute && publicRoute.whenAthenticated === 'redirect') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (authToken && !publicRoute) {
    return NextResponse.next();
  }

  if (authToken && publicRoute?.whenAthenticated === 'next') {
    return NextResponse.next();
  }

}

export const config: MiddlewareConfig = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}



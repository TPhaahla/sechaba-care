import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';



export default withAuth(
  async function middleware(req:NextRequest) {
    const pathname = req.nextUrl.pathname;


    // Manage route protection
    const isAuth = await getToken({ req });
    // console.log(isAuth)
    const isAuthPage = pathname.startsWith('/auth');

    const sensitiveRoutes = ['/dashboard', '/pharmacy'];
    const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      return NextResponse.next();
    }

    if (!isAuth && isAccessingSensitiveRoute) {
      return NextResponse.redirect(new URL('/auth', req.url));
    }

    // if (pathname === '/') {
    //   return NextResponse.redirect(new URL('/dashboard', req.url));
    // }
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matchter: ['/', '/auth', '/dashboard'],
};
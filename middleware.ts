import { NextRequest, NextResponse } from "next/server";


export function middleware(req: NextRequest) {
    const session = req.cookies.get('session')?.value;
    const { pathname } = req.nextUrl;

    if (!session && pathname === '/components/login') {
        return NextResponse.next()
    }

    if (!session && pathname === '/components/dashboard') {
        return NextResponse.redirect(new URL('/components/login', req.url))
    }

    if (session && pathname === '/components/login' || session && pathname === '/') {
        return NextResponse.redirect(new URL('/components/dashboard', req.url))
    }



    return NextResponse.next()
}

export const config = {
    matcher: ['/', '/components/:path*']
}
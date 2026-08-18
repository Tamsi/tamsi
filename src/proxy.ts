import { NextResponse, type NextRequest } from 'next/server'
import { locales, type Locale } from '@/i18n/dictionaries'
import { LOCALE_COOKIE, LOCALE_HEADER } from '@/i18n/locale-config'

export function proxy(request: NextRequest) {
  const param = request.nextUrl.searchParams.get('locale')
  if (!param || !locales.includes(param as Locale)) {
    return NextResponse.next()
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(LOCALE_HEADER, param)

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })
  response.cookies.set(LOCALE_COOKIE, param, {
    path: '/',
    maxAge: 31536000,
    sameSite: 'lax',
  })
  return response
}

export const proxyConfig = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}

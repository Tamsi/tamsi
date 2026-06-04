import { cookies } from 'next/headers'
import { LOCALE_COOKIE, parseLocale } from './locale-config'

export async function getServerLocale() {
  const cookieStore = await cookies()
  return parseLocale(cookieStore.get(LOCALE_COOKIE)?.value)
}

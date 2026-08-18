import { cookies, headers } from 'next/headers'
import {
  LOCALE_COOKIE,
  LOCALE_HEADER,
  resolveServerLocale,
} from './locale-config'

export async function getServerLocale() {
  const headerStore = await headers()
  const cookieStore = await cookies()
  return resolveServerLocale({
    headerLocale: headerStore.get(LOCALE_HEADER),
    cookieLocale: cookieStore.get(LOCALE_COOKIE)?.value,
  })
}

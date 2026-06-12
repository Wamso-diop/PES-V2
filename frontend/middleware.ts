import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|_vercel|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|css|js|woff2?)).*)'],
};

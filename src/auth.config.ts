import type { NextAuthConfig } from 'next-auth'

// Edge-compatible config — no DB imports, used in middleware
// signIn page lives inside adminSlug to keep admin path hidden:
// /[ADMIN_SLUG]/login — не раскрывает slug, но и не является публичным /login
export const authConfig = {
  providers: [],
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' as const },
} satisfies NextAuthConfig

// NOTE: pages.signIn = '/login' — временный путь для совместимости с NextAuth.
// В Sprint 3 заменить на динамический путь через middleware redirect:
// middleware перенаправляет неавторизованных на /[ADMIN_SLUG]/login

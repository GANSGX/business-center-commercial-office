import type { NextAuthConfig } from 'next-auth'

// Edge-compatible config — no DB imports, used in middleware
export const authConfig = {
  providers: [],
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' as const },
} satisfies NextAuthConfig

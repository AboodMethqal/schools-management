"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { prisma } from "@/lib/prisma"

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()

    // 1. Check local session cookie (high reliability for demo and unified auth)
    const sessionCookie = cookieStore.get('auth_session')?.value
    if (sessionCookie) {
      try {
        const sessionUser = JSON.parse(sessionCookie)
        // Verify with database if database is connected
        if (sessionUser?.id) {
          try {
            const dbUser = await prisma.user.findFirst({
              where: {
                OR: [
                  { id: sessionUser.id },
                  { authUserId: sessionUser.authUserId || sessionUser.id },
                  { email: sessionUser.email },
                ],
              },
            })
            if (dbUser) return dbUser
          } catch {
            // DB offline, return sessionUser safely
          }
        }
        return sessionUser
      } catch (e) {
        console.warn("Failed to parse auth_session cookie", e)
      }
    }

    // 2. Check Supabase server client if env variables exist
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) {
      try {
        const supabase = createServerClient(
          supabaseUrl,
          supabaseKey,
          {
            cookies: {
              get(name: string) {
                const cookie = cookieStore.get(name)
                return cookie?.value
              }
            }
          }
        )

        const { data: { user }, error } = await supabase.auth.getUser()

        if (user && !error) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { authUserId: user.id }
            })
            if (dbUser) return dbUser
          } catch {
            // DB offline
          }

          return {
            id: user.id,
            authUserId: user.id,
            email: user.email,
            role: user.user_metadata?.role || 'student',
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            schoolId: user.user_metadata?.schoolId || null,
          }
        }
      } catch (err: any) {
        // Supabase network unreachable, handled gracefully
      }
    }

    return null
  } catch (error: any) {
    console.error("🕵️ getCurrentUser Error:", error.message)
    return null
  }
}

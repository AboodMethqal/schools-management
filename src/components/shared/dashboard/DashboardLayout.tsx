"use client"

import React, { useState } from "react"
import { usePathname } from "next/navigation"
import { DashboardHeader } from "./DashboardHeader"
import { DashboardMenuItem, UserProfile } from "./types"
import { motion, AnimatePresence } from "framer-motion"
import { DashboardSidebar } from "./DashboardSidebar"
import { useAuth } from "@/hooks/useAuth"
import { Info, ExternalLink } from "lucide-react"
import { useLanguage } from "@/context/LanguageProvider"

interface LayoutProps {
  children: React.ReactNode
  menuItems: DashboardMenuItem[]
  title: string
  user?: UserProfile
  activeColor?: string
}

export default function DashboardLayout({ children, menuItems, title, user: propUser, activeColor }: LayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { user: authUser } = useAuth()
  const { t, language } = useLanguage()
  const pathname = usePathname()
  const isDemo = authUser?.email?.endsWith('@demo.com')

  return (
    <div className="methqal-dashboard min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-secondary)]" data-dashboard-path={pathname}>
      <aside className="hidden md:block fixed inset-y-0 start-0 z-50 w-[276px] p-3">
        <DashboardSidebar menuItems={menuItems} activeColor={activeColor} />
      </aside>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.button
              aria-label={language === 'ar' ? 'إغلاق القائمة' : 'Close menu'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: language === 'ar' ? '110%' : '-110%' }}
              animate={{ x: 0 }}
              exit={{ x: language === 'ar' ? '110%' : '-110%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed inset-y-0 z-50 w-[286px] p-3 md:hidden start-0"
            >
              <DashboardSidebar
                menuItems={menuItems}
                onLinkClick={() => setIsMobileOpen(false)}
                activeColor={activeColor}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="min-h-screen md:ps-[276px]">
        <DashboardHeader title={title} onMenuClick={() => setIsMobileOpen(true)} user={propUser} />

        {isDemo && (
          <div className="border-b border-primary/15 bg-primary/[0.06] px-4 py-2.5 md:px-8">
            <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <Info size={15} />
                <span>{language === 'ar' ? `وضع التجربة: أنت تستعرض ${t(title)} كزائر.` : `Demo mode: you are viewing ${title} as a guest.`}</span>
              </div>
              <a href="/login/apply" className="hidden items-center gap-1.5 text-[11px] font-black text-primary hover:underline sm:flex">
                {language === 'ar' ? 'الحصول على الوصول الكامل' : 'Get full access'} <ExternalLink size={11} />
              </a>
            </div>
          </div>
        )}

        <main className="mx-auto w-full max-w-[1600px] px-4 py-5 md:px-8 md:py-7 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  )
}

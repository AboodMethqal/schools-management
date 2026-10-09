"use client"

import React from "react"
import DashboardLayout from "@/components/shared/dashboard/DashboardLayout"
import { teacherMenuItems } from "@/components/shared/dashboard/menu-items"
import { useRoleGuard } from "@/hooks/useRoleGurad"
import PageLoader from "@/components/shared/PageLoader"
import { useLanguage } from "@/context/LanguageProvider"

export default function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useRoleGuard("teacher")
  const { language } = useLanguage()

  if (loading) return <PageLoader />

  return (
    <DashboardLayout
      title="Teacher Dashboard"
      menuItems={teacherMenuItems}
      activeColor="bg-indigo-600"
      user={{
        name: user?.name || (language === 'ar' ? "أ. محمد خالد الزبيري" : "Mohammed Khaled Al-Zubairi"),
        role: language === 'ar' ? "معلم أول" : "Senior Teacher",
        initials: "MK",
        subText: language === 'ar' ? "قسم الرياضيات والعلوم" : "Math & Science Department"
      }}
    >
      {children}
    </DashboardLayout>
  )
}

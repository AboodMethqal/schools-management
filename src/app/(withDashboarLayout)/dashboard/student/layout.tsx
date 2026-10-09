"use client"

import React from "react"
import DashboardLayout from "@/components/shared/dashboard/DashboardLayout"
import { studentMenuItems } from "@/components/shared/dashboard/menu-items"
import { useRoleGuard } from "@/hooks/useRoleGurad"
import PageLoader from "@/components/shared/PageLoader"
import { useLanguage } from "@/context/LanguageProvider"

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useRoleGuard("student")
  const { language } = useLanguage()

  if (loading) return <PageLoader />

  return (
    <DashboardLayout
      title="Student Dashboard"
      menuItems={studentMenuItems}
      activeColor="bg-blue-600"
      user={{
        name: user?.name || (language === 'ar' ? "عمر أحمد خالد" : "Omar Ahmed Khaled"),
        role: language === 'ar' ? "طالب" : "Student",
        initials: "OK",
        subText: language === 'ar' ? "الصف 10 - شعبة أ" : "Class 10 - A"
      }}
    >
      {children}
    </DashboardLayout>
  )
}

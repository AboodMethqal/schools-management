"use client"

import React from "react"
import DashboardLayout from "@/components/shared/dashboard/DashboardLayout"
import { parentMenuItems } from "@/components/shared/dashboard/menu-items"
import { useRoleGuard } from "@/hooks/useRoleGurad"
import PageLoader from "@/components/shared/PageLoader"
import { useLanguage } from "@/context/LanguageProvider"

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useRoleGuard("parent")
  const { language } = useLanguage()

  if (loading) return <PageLoader />

  return (
    <DashboardLayout
      title="Parent Dashboard"
      menuItems={parentMenuItems}
      activeColor="bg-blue-600"
      user={{
        name: user?.name || (language === 'ar' ? "أحمد خالد العلي" : "Ahmed Khaled Al-Ali"),
        role: language === 'ar' ? "ولي أمر" : "Parent",
        initials: "AA",
        subText: language === 'ar' ? "ولي أمر عمر وسارة" : "Parent of Omar & Sara"
      }}
    >
      {children}
    </DashboardLayout>
  )
}

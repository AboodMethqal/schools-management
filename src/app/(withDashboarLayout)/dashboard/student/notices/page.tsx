"use client"

import React, { useState, useEffect } from "react"
import { Calendar, ChevronRight, Search, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { getAnnouncements } from "@/app/actions/announcement"
import { getCurrentSchoolId } from "@/app/actions/user"
import { useLanguage } from "@/context/LanguageProvider";

const categories = [
  { label: "All", value: "All" },
  { label: "Academic", value: "academic" },
  { label: "Holiday", value: "holiday" },
  { label: "Exam", value: "exam" },
  { label: "Event", value: "event" },
  { label: "Emergency", value: "emergency" },
  { label: "Class Notice", value: "class-notice" }
]

export default function NoticesPage() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [notices, setNotices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadNotices() {
      const schoolId = await getCurrentSchoolId()
      if (!schoolId) {
        setLoading(false)
        return
      }
      const res = await getAnnouncements(schoolId)
      if (res.success) {
        const allNotices = (res.data || []).filter(
          (n: any) =>
            n.status === "published" &&
            (n.audience === "students" || n.audience === "all")
        )
        setNotices(allNotices)
      }
      setLoading(false)
    }
    loadNotices()
  }, [])

  const filteredNotices = notices.filter((n) => {
    const noticeCategory = n.category?.toLowerCase()?.replace(/\s+/g, "-")
    const matchesCategory =
      selectedCategory === "All" || noticeCategory === selectedCategory.toLowerCase()
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.content && n.content.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Notices & Announcements</h1>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 w-full md:w-auto shadow-sm">
          <Search className="h-4 w-4 text-slate-400 dark:text-slate-400" />
          <input
            type="text"
            placeholder={isAr ? "البحث في الإعلانات..." : "Search notices..."}
            className="bg-transparent border-none outline-none text-sm w-full md:w-64 placeholder:text-slate-400 text-slate-700 dark:text-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all
              ${
                selectedCategory === cat.value
                  ? "bg-slate-900 text-white dark:bg-blue-600"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300"
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Notices */}
      <div className="grid gap-4">
        {loading ? (
          <div className="py-20 text-center font-bold text-gray-500 dark:text-gray-400 animate-pulse">
            Fetching Announcements...
          </div>
        ) : filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
            >
              {/* Priority bar */}
              <div
                className={`absolute start-0 top-0 bottom-0 w-1 ${
                  notice.priority === "urgent"
                    ? "bg-red-500"
                    : notice.priority === "high"
                    ? "bg-red-500"
                    : notice.priority === "normal"
                    ? "bg-blue-500"
                    : "bg-amber-500"
                }`}
              ></div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 ps-3">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded
                        ${
                          notice.category?.toLowerCase() === "academic"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100"
                            : notice.category?.toLowerCase() === "event"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-700 dark:text-purple-100"
                            : notice.category?.toLowerCase() === "emergency"
                            ? "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100"
                            : notice.category?.toLowerCase() === "exam"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-700 dark:text-emerald-100"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100"
                        }`}
                    >
                      {notice.category || "General"}
                    </span>
                    <span className="flex items-center text-xs text-slate-400 dark:text-slate-400 font-medium">
                      <Calendar className="h-3 w-3 me-1" />
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">
                    {notice.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 md:line-clamp-1 group-hover:line-clamp-none transition-all duration-300">
                    {notice.content}
                  </p>
                </div>

                <div className="flex items-center">
                  <button
                    onClick={() => router.push(`/dashboard/student/notices/${notice.id}`)}
                    className="p-2 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40 group-hover:text-blue-600 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl border-dashed">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 mb-4">
              <FileText className="h-6 w-6 text-slate-400 dark:text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No notices found</h3>
            <p className="text-slate-500 dark:text-slate-400">There are currently no announcements for you.</p>
          </div>
        )}
      </div>
    </div>
  )
}

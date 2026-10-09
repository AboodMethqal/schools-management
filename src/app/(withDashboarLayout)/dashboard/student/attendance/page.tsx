"use client"

import React, { useEffect, useState } from "react"
import { Calendar, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react"
import { getMyAttendance } from "@/app/actions/student/attendance"
import { useLanguage } from "@/context/LanguageProvider";

export default function AttendancePage() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    async function loadAttendance() {
      const res = await getMyAttendance()
      if (res.success) {
        setData(res.data)
      }
      setLoading(false)
    }
    loadAttendance()
  }, [])

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-text-muted font-bold animate-pulse">{isAr ? 'جارٍ تحميل سجلات الحضور...' : 'Loading Attendance Records...'}</p>
      </div>
    )
  }

  const stats = [
    { title: isAr ? "إجمالي الأيام" : "Total Days", value: data?.stats?.totalDays || 0, icon: Calendar, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/30" },
    { title: isAr ? "حاضر" : "Present", value: data?.stats?.present || 0, icon: CheckCircle, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/30" },
    { title: isAr ? "غائب" : "Absent", value: data?.stats?.absent || 0, icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/30" },
    { title: isAr ? "متأخر" : "Late", value: data?.stats?.late || 0, icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/30" },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">{isAr ? "سجل الحضور والغياب" : "Attendance Record"}</h1>
          <p className="text-text-muted text-sm font-medium">{isAr ? 'نسبة حضورك الإجمالية هي' : 'Your overall attendance rate is'} <span className="text-blue-600 font-bold">{data?.stats?.percentage || "0.0"}%</span></p>
        </div>
        <div className="bg-bg-card px-4 py-2 rounded-xl border border-border-light shadow-sm">
           <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] block mb-1">{isAr ? 'آخر تحديث' : 'Last Update'}</span>
           <span className="text-xs font-bold text-text-primary">{new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((item, idx) => (
          <div key={idx} className="bg-bg-card border border-border-light rounded-xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">{item.title}</p>
              <h3 className="text-2xl font-black text-text-primary mt-1 tracking-tight">{item.value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${item.bg}`}>
              <item.icon className={`h-6 w-6 ${item.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Attendance Table */}
      <div className="bg-bg-card border border-border-light rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border-light flex justify-between items-center bg-bg-page/50 text-slate-900 dark:text-slate-100">
          <h3 className="font-bold text-text-primary tracking-tight">{isAr ? "سجل الحضور والغياب الكامل" : "Full Attendance History"}</h3>
          <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-800/50 transition-all active:scale-95">
            {isAr ? 'تحميل تقرير PDF' : 'Get PDF Report'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm text-text-secondary">
            <thead className="bg-bg-page text-[10px] uppercase font-black tracking-[0.15em] text-text-muted border-b border-border-light">
              <tr>
                <th className="px-6 py-5 font-black">{isAr ? "التاريخ" : "Date"}</th>
                <th className="px-6 py-5 font-black">{isAr ? "الحالة" : "Status"}</th>
                <th className="px-6 py-5 font-black">{isAr ? "وقت الدخول" : "Check In"}</th>
                <th className="px-6 py-5 font-black">{isAr ? "الملاحظات" : "Remarks"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {data?.history?.length > 0 ? (
                data.history.map((row: any) => (
                  <tr key={row.id} className="hover:bg-bg-page/50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-text-primary">{row.date}</td>
                    <td className="px-6 py-4">
                      <span className={`
                                                inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                                                ${row.status === "Present" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
                          row.status === "Absent" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" :
                            "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"}
                                            `}>
                        <span className={`w-1.5 h-1.5 rounded-full me-2
                                                    ${row.status === "Present" ? "bg-green-500" :
                            row.status === "Absent" ? "bg-red-500" :
                              "bg-amber-500"}
                                                `}></span>{isAr ? (row.status === "Present" ? "حاضر" : row.status === "Absent" ? "غائب" : "متأخر") : row.status}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-text-muted">{isAr ? "08:00 ص (ثابت)" : "08:00 AM (Fixed)"}</td>
                    <td className="px-6 py-4 text-text-muted italic text-xs">{isAr ? "سُجل بواسطة المعلم" : "Logged by Teacher"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <Calendar size={48} />
                      <p className="text-base font-bold">{isAr ? 'لا توجد سجلات حضور مسجلة حتى الآن.' : 'No attendance records found yet.'}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

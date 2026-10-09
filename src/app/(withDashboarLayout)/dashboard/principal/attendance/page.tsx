"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CalendarCheck, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/context/LanguageProvider";

const classAttendance = [
  { class: "VI", value: 96 },
  { class: "VII", value: 93 },
  { class: "VIII", value: 91 },
  { class: "IX", value: 95 },
  { class: "X", value: 89 },
  { class: "XI", value: 94 },
  { class: "XII", value: 97 },
];

const monthlyAttendance = [
  { month: "Aug", value: 93 },
  { month: "Sep", value: 94 },
  { month: "Oct", value: 92 },
  { month: "Nov", value: 95 },
  { month: "Dec", value: 91 },
  { month: "Jan", value: 94 },
  { month: "Feb", value: 94.2 },
];

export default function AttendancePage() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  return (
    <div
      className="
        min-h-screen p-6 transition-colors
        bg-gray-50 text-gray-900
        dark:bg-gradient-to-br dark:from-[#050B18] dark:to-[#020617] dark:text-white
      "
    >
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* {isAr ? 'نسبة الحضور العامة' : 'Overall Attendance'} */}
        <div
          className="
            rounded-2xl p-6 flex justify-between items-center
            bg-white border border-gray-200
            dark:bg-white/5 dark:border-white/10
          "
        >
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isAr ? 'نسبة الحضور العامة' : 'Overall Attendance'}
            </p>
            <h2 className="text-3xl font-bold mt-1">94.2%</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {isAr ? 'متوسط الشهر الحالي' : 'Current month average'}
            </p>
          </div>
          <CalendarCheck className="w-8 h-8 text-green-500" />
        </div>

        {/* {isAr ? 'الغياب المتكرر' : 'Chronic Absence'} */}
        <div
          className="
            rounded-2xl p-6 flex justify-between items-center
            bg-white border border-gray-200
            dark:bg-white/5 dark:border-white/10
          "
        >
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isAr ? 'الغياب المتكرر' : 'Chronic Absence'}
            </p>
            <h2 className="text-3xl font-bold mt-1">3.8%</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {isAr ? 'الطلاب الأقل من 75% حضوراً' : 'Students below 75% attendance'}
            </p>
          </div>
          <AlertTriangle className="w-8 h-8 text-yellow-500" />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* {isAr ? 'الحضور حسب الفصل' : 'Attendance by Class'} */}
        <div
          className="
            rounded-2xl p-6
            bg-white border border-gray-200
            dark:bg-white/5 dark:border-white/10
          "
        >
          <h3 className="font-semibold mb-1">{isAr ? 'الحضور حسب الفصل' : 'Attendance by Class'}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {isAr ? 'متوسط الفصل الحالي (%)' : 'Current term average (%)'}
          </p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classAttendance}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis dataKey="class" />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* {isAr ? 'مسار الحضور الشهري' : 'Monthly Attendance Trend'} */}
        <div
          className="
            rounded-2xl p-6
            bg-white border border-gray-200
            dark:bg-white/5 dark:border-white/10
          "
        >
          <h3 className="font-semibold mb-1">{isAr ? 'مسار الحضور الشهري' : 'Monthly Attendance Trend'}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {isAr ? 'متوسط المدرسة عبر الأشهر' : 'School-wide average over time'}
          </p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyAttendance}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis dataKey="month" />
                <YAxis domain={[85, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

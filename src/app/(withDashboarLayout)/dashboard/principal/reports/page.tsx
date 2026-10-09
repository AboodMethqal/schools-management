"use client";

import { FileText, Eye, CheckCircle, Download } from "lucide-react";
import { useLanguage } from "@/context/LanguageProvider";

const summary = [
  {
    title: "Total Reports",
    value: "24",
    subtitle: "{isAr ? 'خلال هذا العام الأكاديمي' : 'This academic year'}",
  },
  {
    title: "Pending Review",
    value: "6",
    subtitle: "{isAr ? 'في انتظار موافقتك' : 'Awaiting your approval'}",
  },
  {
    title: "Approved",
    value: "16",
    subtitle: "{isAr ? 'منشورة ومؤرشفة' : 'Published & archived'}",
  },
];

const reports = [
  {
    name: "Q3 Academic Performance Report",
    type: "Academic",
    date: "Feb 10, 2026",
    status: "Pending",
  },
  {
    name: "January Attendance Summary",
    type: "Attendance",
    date: "Feb 05, 2026",
    status: "Approved",
  },
  {
    name: "Q3 Fee Collection Report",
    type: "Finance",
    date: "Feb 03, 2026",
    status: "Pending",
  },
  {
    name: "Annual Teacher Evaluation",
    type: "Academic",
    date: "Jan 28, 2026",
    status: "Approved",
  },
];

export default function ReportsPage() {
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
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {summary.map((item, i) => (
          <div
            key={i}
            className="
              rounded-2xl p-6
              bg-white border border-gray-200
              dark:bg-white/5 dark:border-white/10
            "
          >
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-gray-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.title}
              </p>
            </div>
            <h2 className="text-3xl font-bold">{item.value}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {item.subtitle}
            </p>
          </div>
        ))}
      </div>

      {/* Reports Table */}
      <div
        className="
          rounded-2xl p-6
          bg-white border border-gray-200
          dark:bg-white/5 dark:border-white/10
        "
      >
        <h2 className="text-lg font-semibold mb-1">All Reports</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Review, approve, or download
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="
                  border-b
                  text-gray-500 border-gray-200
                  dark:text-gray-400 dark:border-white/10
                "
              >
                <th className="py-3 text-start">Report</th>
                <th className="py-3 text-start">{isAr ? 'النوع' : 'Type'}</th>
                <th className="py-3 text-start">{isAr ? 'التاريخ' : 'Date'}</th>
                <th className="py-3 text-start">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="py-3 text-end">{isAr ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((r, i) => (
                <tr
                  key={i}
                  className="
                    border-b transition
                    border-gray-100 hover:bg-gray-50
                    dark:border-white/5 dark:hover:bg-white/5
                  "
                >
                  <td className="py-4 font-medium">{r.name}</td>
                  <td className="py-4 text-gray-500 dark:text-gray-400">
                    {r.type}
                  </td>
                  <td className="py-4 text-gray-500 dark:text-gray-400">
                    {r.date}
                  </td>
                  <td
                    className={`py-4 font-medium ${r.status === "Approved"
                        ? "text-green-600 dark:text-green-400"
                        : "text-yellow-600 dark:text-yellow-400"
                      }`}
                  >
                    {r.status}
                  </td>
                  <td className="py-4 text-end">
                    <div className="inline-flex items-center gap-3">
                      <button
                        className="
                          inline-flex items-center gap-1 text-sm transition
                          text-gray-500 hover:text-gray-900
                          dark:text-gray-400 dark:hover:text-white
                        "
                      >
                        <Eye size={16} />
                        View
                      </button>

                      {r.status === "Pending" && (
                        <button
                          className="
                            inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition
                            bg-purple-100 text-purple-700 hover:bg-purple-200
                            dark:bg-purple-600/20 dark:text-purple-400 dark:hover:bg-purple-600/30
                          "
                        >
                          <CheckCircle size={14} />
                          Approve
                        </button>
                      )}

                      <button
                        className="
                          inline-flex items-center gap-1 text-sm transition
                          text-gray-500 hover:text-gray-900
                          dark:text-gray-400 dark:hover:text-white
                        "
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

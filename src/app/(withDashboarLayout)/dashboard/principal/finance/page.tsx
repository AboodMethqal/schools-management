"use client";

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, Clock, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/context/LanguageProvider";

const summary = [
  {
    title: "Collected",
    value: "₹18.4L",
    subtitle: "{isAr ? '74% من الهدف' : '74% of target'}",
    icon: DollarSign,
    color: "text-green-500",
  },
  {
    title: "Pending",
    value: "₹4.5L",
    subtitle: "{isAr ? '18% — مستحقة خلال 15 يوماً' : '18% — due within 15 days'}",
    icon: Clock,
    color: "text-yellow-500",
  },
  {
    title: "Overdue",
    value: "₹2.1L",
    subtitle: "{isAr ? '8% — تتطلب متابعة عاجلة' : '8% — requires follow-up'}",
    icon: AlertTriangle,
    color: "text-red-500",
  },
];

const feeDistribution = [
  { name: "Collected", value: 74, color: "#34d399" },
  { name: "Pending", value: 18, color: "#fbbf24" },
  { name: "Overdue", value: 8, color: "#ef4444" },
];

const revenueData = [
  { month: "Aug", actual: 8.5, target: 9 },
  { month: "Sep", actual: 9.0, target: 9.2 },
  { month: "Oct", actual: 9.3, target: 9.5 },
  { month: "Nov", actual: 8.9, target: 9.4 },
  { month: "Dec", actual: 7.6, target: 9.0 },
  { month: "Jan", actual: 9.4, target: 9.6 },
  { month: "Feb", actual: 9.0, target: 9.8 },
];

export default function FinancePage() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const cur = (val: string) => isAr ? val.replace("₹", "ر.ي ") : val.replace("₹", "$");
  return (
    <div
      className="
        min-h-screen p-6 transition-colors
        bg-gray-50 text-gray-900
        dark:bg-gradient-to-br dark:from-[#050B18] dark:to-[#020617] dark:text-white
      "
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {summary.map((item, i) => (
          <div
            key={i}
            className="
              rounded-2xl p-6 flex justify-between items-center
              bg-white border border-gray-200
              dark:bg-white/5 dark:border-white/10
            "
          >
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.title}
              </p>
              <h2 className="text-3xl font-bold mt-1">{cur(item.value)}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {item.subtitle}
              </p>
            </div>
            <item.icon className={`w-8 h-8 ${item.color}`} />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* {isAr ? 'توزيع تحصيل الرسوم' : 'Fee Collection Distribution'} */}
        <div
          className="
            rounded-2xl p-6
            bg-white border border-gray-200
            dark:bg-white/5 dark:border-white/10
          "
        >
          <h3 className="font-semibold mb-1">{isAr ? 'توزيع تحصيل الرسوم' : 'Fee Collection Distribution'}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {isAr ? 'تفاصيل الشهر الحالي' : 'Current month breakdown'}
          </p>

          <div className="flex items-center gap-6">
            <div className="h-52 w-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={feeDistribution}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {feeDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3 text-sm">
              {feeDistribution.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.name}
                  </span>
                  <span className="font-semibold ms-auto">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* {isAr ? 'الإيرادات مقابل المستهدف' : 'Revenue vs Target'} */}
        <div
          className="
            rounded-2xl p-6
            bg-white border border-gray-200
            dark:bg-white/5 dark:border-white/10
          "
        >
          <h3 className="font-semibold mb-1">{isAr ? 'الإيرادات مقابل المستهدف' : 'Revenue vs Target'}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {isAr ? 'مقارنة شهرية' : 'Monthly comparison ($)'}
          </p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Actual"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#94a3b8"
                  strokeDasharray="5 5"
                  name="Target"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

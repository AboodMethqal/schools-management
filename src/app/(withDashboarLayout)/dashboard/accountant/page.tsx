"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  Users,
  BookOpen,
  Calendar,
  AlertCircle,
  DollarSign,
  Download,
  Filter,
  Search,
  MoreVertical,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { getAccountantDashboardStats, getRecentAccountantTransactions } from "@/app/actions/accountant/dashboard";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageProvider";

// Simple className merger
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

// Card Component
const Card = ({
  children,
  className = "",
  style = {}
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={cn(
      "bg-bg-card rounded-2xl border border-border-light shadow-sm hover:shadow-xl hover:border-blue-200/60 transition-all duration-500",
      className
    )}
    style={style}
  >
    {children}
  </div>
);

// Stat Card Component (Card 2 Style)
const StatCard = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  iconBg,
  iconColor,
  subtitle,
  badge,
  isLoading
}: any) => (
  <Card
    className="relative p-6 rounded-2xl border border-border-light shadow-sm hover:shadow-md transition-all duration-200"
  >
    {isLoading ? (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="w-10 h-10 bg-slate-200 rounded-xl" />
        <div className="space-y-2">
          <div className="h-2 w-20 bg-slate-200 rounded" />
          <div className="h-6 w-32 bg-slate-200 rounded" />
        </div>
      </div>
    ) : (
      <div className="flex flex-col gap-4 relative z-10">
        {/* Icon */}
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
            iconBg
          )}
        >
          <Icon className={iconColor} size={20} />
        </div>

        {/* Content */}
        <div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            {title}
          </p>

          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold text-text-primary">{value}</h3>

            {change && change !== "0%" && (
              <span
                className={cn(
                  "text-[10px] font-bold flex items-center gap-0.5",
                  changeType === "up" ? "text-emerald-500" : "text-red-500"
                )}
              >
                {changeType === "up" ? (
                  <TrendingUp size={10} />
                ) : (
                  <TrendingDown size={10} />
                )}
                {change}
              </span>
            )}
          </div>

          {subtitle && (
            <p className="text-xs text-text-muted mt-1">{subtitle}</p>
          )}
        </div>

        {badge && (
          <span className="absolute top-4 end-4 text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
            {badge}
          </span>
        )}
      </div>
    )}
  </Card>
);

export default function AccountantOverview() {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';
  const formatCur = (val: number) => isAr ? `ر.ي ${(val || 0).toLocaleString()}` : `$${(val || 0).toLocaleString()}`;
  const [isLoading, setIsLoading] = useState(true);
  const [statsData, setStatsData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    const [statsRes, transRes] = await Promise.all([
      getAccountantDashboardStats(),
      getRecentAccountantTransactions()
    ]);

    if (statsRes.success) {
      setStatsData(statsRes.data);
    } else {
      toast.error(statsRes.error || "Failed to load stats");
    }

    if (transRes.success) {
      setTransactions(transRes.data || []);
    }

    setIsLoading(false);
  };

  const stats = [
    {
      title: t("Today's Total Collection"),
      value: formatCur(statsData?.today.value || 0),
      change: statsData?.today.change,
      changeType: statsData?.today.changeType,
      subtitle: t("vs yesterday"),
      icon: DollarSign,
      iconBg: "bg-blue-500/10 shadow-blue-500/30",
      iconColor: "text-blue-500",
      badge: t("Today"),
    },
    {
      title: t("Monthly Collection"),
      value: formatCur(statsData?.monthly.value || 0),
      change: statsData?.monthly.change,
      changeType: statsData?.monthly.changeType,
      subtitle: t("vs last month"),
      icon: Calendar,
      iconBg: "bg-indigo-600/10 shadow-blue-500/30",
      iconColor: "text-indigo-600",
    },
    {
      title: t("Total Salary Paid"),
      value: formatCur(statsData?.salary.value || 0),
      icon: Wallet,
      iconBg: "bg-indigo-500/10 shadow-indigo-500/30",
      iconColor: "text-indigo-500",
      subtitle: t("Current Month"),
    },
    {
      title: t("Total Expenses"),
      value: formatCur(statsData?.expenses.value || 0),
      change: statsData?.expenses.change,
      changeType: statsData?.expenses.changeType,
      subtitle: t("vs last month"),
      icon: TrendingDown,
      iconBg: "bg-orange-600/10 shadow-amber-500/30",
      iconColor: "text-amber-500",
    },
    {
      title: t("Due Fees"),
      value: formatCur(statsData?.dues.value || 0),
      icon: AlertCircle,
      iconBg: "bg-red-500/10 shadow-red-500/30",
      iconColor: "text-red-500",
      subtitle: `${statsData?.dues.count || 0} ${t('Students')}`,
      badge: t("Pending"),
    },
    {
      title: t("Net Balance"),
      value: formatCur(statsData?.netBalance || 0),
      icon: TrendingUp,
      iconBg: "bg-green-600/10 shadow-green-600/30",
      iconColor: "text-green-600",
      subtitle: t("Total Savings"),
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            {t('Financial Overview')}
          </h1>
          <p className="text-sm text-text-muted flex items-center gap-2">
            <Calendar size={14} />
            {t("Today's Date")}: {new Date().toLocaleDateString('default', { day: 'numeric', month: 'long', year: 'numeric' })} • {new Date().toLocaleDateString('default', { weekday: 'long' })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadDashboardData}
            disabled={isLoading}
            className="px-4 py-2.5 bg-bg-card border border-border-light text-text-secondary hover:bg-bg-page rounded-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Filter size={18} />}
            <span className="text-sm font-medium">{t('Refresh')}</span>
          </button>

          <Link href="/dashboard/accountant/fee-collection" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300 flex items-center gap-2">
            <Receipt size={18} />
            <span className="text-sm font-semibold">{t('Assign Fee')}</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} isLoading={isLoading} />
        ))}
      </div>

      {/* Quick Insights Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2rem] text-white shadow-lg overflow-hidden relative group">
          <div className="absolute -end-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">Total Students</p>
              <h3 className="text-4xl font-black">{statsData?.totalStudents || 0}</h3>
              <p className="text-blue-100/80 text-[10px] font-medium italic">Enrolled in school</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Users size={32} />
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2rem] text-white shadow-lg overflow-hidden relative group">
          <div className="absolute -end-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest">Total Teachers</p>
              <h3 className="text-4xl font-black">{statsData?.totalTeachers || 0}</h3>
              <p className="text-emerald-100/80 text-[10px] font-medium italic">Active staff members</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <BookOpen size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <Card>
        <div className="p-6 border-b border-border-light">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-text-primary">Recent Transactions</h3>
              <p className="text-sm text-text-muted mt-1">Latest financial activities</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search
                  className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="ps-10 pe-4 py-2 bg-bg-page border-border-light text-text-muted  border  rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                />
              </div>

              <button className="p-2 hover:bg-slate-50 hover:text-slate-500 rounded-xl transition-colors">
                <Download className="" size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-page text-text-muted">
                <th className="px-6 py-4 text-start text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-start text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-start text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-start text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-start text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-start text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border-light">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-text-muted">
                    <Loader2 className="animate-spin inline me-2" /> Loading transactions...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-text-muted">
                    No recent transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((transaction, idx) => {
                  return (
                    <tr
                      key={transaction.id}
                      className="hover:bg-bg-page transition-all duration-300 group animate-fadeInSlide cursor-pointer"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-text-primary">
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300",
                            transaction.iconType === "payment" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                          )}>
                            {transaction.iconType === "payment" ? <Receipt size={18} /> : <Wallet size={18} />}
                          </div>
                          <span className="text-sm font-medium text-text-primary ">
                            {transaction.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-text-muted">
                          {transaction.type}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "text-sm font-bold",
                            transaction.amount.includes("+")
                              ? "text-emerald-600"
                              : "text-red-600"
                          )}
                        >
                          {transaction.amount}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "px-3 py-1.5 text-xs font-bold rounded-full border",
                            transaction.statusColor === "emerald" && "bg-emerald-100 text-emerald-700 border-emerald-200",
                            transaction.statusColor === "orange" && "bg-orange-100 text-orange-700 border-orange-200",
                            transaction.statusColor === "blue" && "bg-blue-100 text-blue-700 border-blue-200",
                            transaction.statusColor === "red" && "bg-red-100 text-red-700 border-red-200"
                          )}
                        >
                          {transaction.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <button className="p-2 bg-gray-500/10 rounded-lg transition-colors ">
                          <MoreVertical className="" size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-border-light bg-bg-page text-text-secondary">
          <div className="flex items-center justify-between">
            <p className="text-sm ">
              Recent <span className="font-bold text-text-primary">{transactions.length}</span> transactions
            </p>

            <Link href="/dashboard/accountant/history" className="px-4 py-2 text-sm font-semibold text-blue-700 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-300">
              View History →
            </Link>
          </div>
        </div>
      </Card>

    </div>
  );
}

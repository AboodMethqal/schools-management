"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import {
  Download,
  Calendar,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart as PieChartIcon,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { getFinancialReportsData } from "@/app/actions/accountant/reports";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageProvider";

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-bg-card rounded-2xl border border-border-light shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
    {children}
  </div>
);

export default function ReportsPage() {
  const { t, language } = useLanguage();
  const currency = language === 'ar' ? 'ر.ي' : '$';
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setIsLoading(true);
    const res = await getFinancialReportsData();
    if (res.success) {
      setReportData(res.data);
    } else {
      toast.error(res.error || (language === 'ar' ? "فشل تحميل بيانات التقرير" : "Failed to load report data"));
    }
    setIsLoading(false);
  };

  const stats = [
    { label: t("Net Profit"), value: language === 'ar' ? `ر.ي ${(reportData?.analytics?.reduce((acc: number, curr: any) => acc + (curr.revenue - curr.expense), 0) || 0).toLocaleString()}` : `$${(reportData?.analytics?.reduce((acc: number, curr: any) => acc + (curr.revenue - curr.expense), 0) || 0).toLocaleString()}`, change: "+12.5%", trend: "up", color: "emerald" },
    { label: t("Total Revenue"), value: language === 'ar' ? `ر.ي ${(reportData?.analytics?.reduce((acc: number, curr: any) => acc + curr.revenue, 0) || 0).toLocaleString()}` : `$${(reportData?.analytics?.reduce((acc: number, curr: any) => acc + curr.revenue, 0) || 0).toLocaleString()}`, change: "+8.2%", trend: "up", color: "blue" },
    { label: t("Total Expenses"), value: language === 'ar' ? `ر.ي ${(reportData?.analytics?.reduce((acc: number, curr: any) => acc + curr.expense, 0) || 0).toLocaleString()}` : `$${(reportData?.analytics?.reduce((acc: number, curr: any) => acc + curr.expense, 0) || 0).toLocaleString()}`, change: "-2.4%", trend: "down", color: "amber" },
    { label: t("Collection Trend"), value: language === 'ar' ? `ر.ي ${(reportData?.trends?.reduce((acc: number, curr: any) => acc + curr.amount, 0) || 0).toLocaleString()}` : `$${(reportData?.trends?.reduce((acc: number, curr: any) => acc + curr.amount, 0) || 0).toLocaleString()}`, change: "+5.1%", trend: "up", color: "indigo" },
  ];

  return (
    <div className="p-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Financial Reports</h1>
          <p className="text-sm text-text-muted">Analyze your school's financial performance and trends</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={loadReports}
            className="flex items-center gap-2 px-4 py-2 bg-bg-card border border-border-light rounded-xl text-sm font-medium text-text-secondary shadow-sm hover:bg-bg-page"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Calendar size={18} />}
            <span>{isLoading ? "Refreshing..." : "Refresh Data"}</span>
            <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-md shadow-primary/20">
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="p-6">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold text-text-primary">{stat.value}</h3>
              <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${stat.trend === 'up' ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'
                }`}>
                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue vs Expense Bar Chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-text-primary">Revenue vs Expenses</h3>
              <p className="text-xs text-text-muted">Monthly comparison of inflows and outflows</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs font-medium text-text-secondary">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary/20" />
                <span className="text-xs font-medium text-text-secondary">Expense</span>
              </div>
            </div>
          </div>

          <div className="h-[300px] w-full">
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="animate-spin text-primary" size={40} />
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData?.analytics || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                    <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
                    dy={10}
                    />
                    <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
                    />
                    <Tooltip
                    cursor={{ fill: 'var(--color-bg-page)', opacity: 0.4 }}
                    contentStyle={{
                        backgroundColor: 'var(--color-bg-card)',
                        borderRadius: '12px',
                        border: '1px solid var(--color-border-light)',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        color: 'var(--color-text-primary)'
                    }}
                    itemStyle={{ color: 'var(--color-text-secondary)' }}
                    />
                    <Bar dataKey="revenue" fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={32} />
                    <Bar dataKey="expense" fill="var(--color-primary)" opacity={0.2} radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
                </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Expense Breakdown Pie Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-text-primary mb-1">Expense Breakdown</h3>
          <p className="text-xs text-text-muted mb-8">Distribution across categories</p>

          <div className="h-[240px] w-full relative">
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="animate-spin text-primary" size={40} />
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={reportData?.breakdown || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                    >
                    {(reportData?.breakdown || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    </Pie>
                    <Tooltip
                    contentStyle={{
                        backgroundColor: 'var(--color-bg-card)',
                        borderRadius: '12px',
                        border: '1px solid var(--color-border-light)',
                        color: 'var(--color-text-primary)'
                    }}
                    />
                </PieChart>
                </ResponsiveContainer>
            )}
            {!isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-bold text-text-primary">
                  {language === 'ar' ? `ر.ي ${(reportData?.totalMonthlyExpense || 0).toLocaleString()}` : `$${(reportData?.totalMonthlyExpense || 0).toLocaleString()}`}
                </span>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Current Month</span>
                </div>
            )}
          </div>

          <div className="mt-8 space-y-3 max-h-[150px] overflow-y-auto pe-2 custom-scrollbar">
            {(reportData?.breakdown || []).map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-medium text-text-secondary">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-text-primary">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Collection Trend and Reports Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-text-primary">Daily Collection Trend</h3>
              <p className="text-xs text-text-muted">Fee received over the current week</p>
            </div>
            <button className="p-2 hover:bg-bg-page rounded-lg text-text-muted transition-all">
              <TrendingUp size={20} />
            </button>
          </div>
          <div className="h-[200px] w-full">
            {isLoading ? (
                 <div className="flex items-center justify-center h-full">
                    <Loader2 className="animate-spin text-primary" size={40} />
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reportData?.trends || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                    <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
                    />
                    <Tooltip
                    contentStyle={{
                        backgroundColor: 'var(--color-bg-card)',
                        borderRadius: '12px',
                        border: '1px solid var(--color-border-light)',
                        color: 'var(--color-text-primary)'
                    }}
                    />
                    <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="var(--color-primary)"
                    strokeWidth={3}
                    dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                </LineChart>
                </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Quick Report Access */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-text-primary mb-6">Available Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Revenue Summary", desc: "Detailed income breakdown", icon: BarChart3 },
              { title: "Monthly Audit", desc: "Complete financial audit log", icon: Filter },
              { title: "Student Dues", desc: "List of pending fees", icon: TrendingDown },
              { title: "Salary Report", desc: "Payroll disbursement details", icon: DollarSign },
            ].map((report, idx) => (
              <div key={idx} className="p-4 border border-border-light rounded-2xl hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-bg-page flex items-center justify-center text-text-muted group-hover:bg-bg-card group-hover:text-primary shadow-sm mb-3 transition-all">
                  <report.icon size={20} />
                </div>
                <h4 className="text-sm font-bold text-text-primary">{report.title}</h4>
                <p className="text-[10px] text-text-muted font-bold uppercase mt-0.5 tracking-tight">{report.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

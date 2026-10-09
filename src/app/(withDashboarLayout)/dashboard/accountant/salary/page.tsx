"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { Search, Wallet, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { getTeacherSalariesData, payTeacherSalaryAction } from "@/app/actions/accountant/salary";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useLanguage } from "@/context/LanguageProvider";

export default function SalaryManagementPage() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [search, setSearch] = useState("");
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    setIsLoading(true);
    const res = await getTeacherSalariesData();
    if (res.success) {
      setTeachers(res.data || []);
    } else {
      toast.error(res.error || "Failed to load teachers");
    }
    setIsLoading(false);
  };

  const handlePaySalary = async (teacher: any) => {
    const result = await Swal.fire({
      title: 'Salary Payment',
      text: `Confirm payment amount for ${teacher.name}`,
      input: 'number',
      inputValue: teacher.monthlySalary,
      inputAttributes: {
        min: '1',
        step: '1'
      },
      showCancelButton: true,
      confirmButtonText: 'Pay Now',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#4f46e5',
      inputValidator: (value) => {
        if (!value || parseFloat(value) <= 0) {
          return 'Please enter a valid amount'
        }
      }
    });

    if (result.isConfirmed) {
      const paidAmount = parseFloat(result.value);
      setIsProcessing(teacher.id);
      const res = await payTeacherSalaryAction(teacher.id, paidAmount, teacher.name);
      if (res.success) {
        toast.success(res.message || "Salary paid successfully");
        loadTeachers(); // Refresh list
      } else {
        toast.error(res.error || "Failed to process payment");
      }
      setIsProcessing(null);
    }
  };

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(search.toLowerCase()) || 
    teacher.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Salary Management
          </h1>
          <p className="text-sm text-text-muted">
            Manage teacher salaries and payment history ({filteredTeachers.length})
          </p>
        </div>
        <button 
          onClick={loadTeachers}
          disabled={isLoading}
          className="p-2 hover:bg-bg-page rounded-xl transition-all"
        >
          {isLoading ? <Loader2 size={20} className="animate-spin text-text-muted" /> : <Wallet size={20} className="text-text-secondary" />}
        </button>
      </div>

      {/* Search */}
      <div className="bg-bg-card border border-border-light rounded-2xl p-4 shadow-sm">
        <div className="relative">
          <Search
            className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted"
            size={18}
          />
          <input
            type="text"
            placeholder="Search teacher by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full ps-10 pe-4 py-2 bg-bg-page border border-border-light rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Salary Table */}
      <div className="bg-bg-card border border-border-light rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">

            {/* Table Header */}
            <thead>
              <tr className="bg-bg-page border-b border-border-light">
                <th className="px-6 py-4 text-start text-xs font-bold text-text-secondary uppercase">
                  Teacher
                </th>
                <th className="px-6 py-4 text-start text-xs font-bold text-text-secondary uppercase">
                  Subject / Dept
                </th>
                <th className="px-6 py-4 text-start text-xs font-bold text-text-secondary uppercase">
                  Monthly Salary
                </th>
                <th className="px-6 py-4 text-start text-xs font-bold text-text-secondary uppercase">
                  Last Payment
                </th>
                <th className="px-6 py-4 text-start text-xs font-bold text-text-secondary uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-start text-xs font-bold text-text-secondary uppercase">
                  Action
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-border-light">
              {isLoading ? (
                  <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                        <Loader2 className="animate-spin inline me-2" /> Loading teacher records...
                      </td>
                  </tr>
              ) : filteredTeachers.length === 0 ? (
                <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                        No teachers found.
                    </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className="hover:bg-bg-page/50 transition-all duration-300"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-text-primary">
                        {teacher.name}
                      </p>
                      <p className="text-xs text-text-muted">
                        ID: {teacher.id}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {teacher.subject}
                    </td>

                    <td className="px-6 py-4 text-sm font-bold text-text-primary">
                      {isAr ? `ر.ي ${teacher.monthlySalary.toLocaleString()}` : `$${teacher.monthlySalary.toLocaleString()}`}
                    </td>

                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {teacher.paymentDate}
                    </td>

                    <td className="px-6 py-4">
                      {teacher.status === "Paid" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20">
                          <CheckCircle2 size={12} />
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full border border-orange-500/20">
                          <Clock size={12} />
                          Unpaid
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {teacher.status === "Unpaid" ? (
                        <button 
                          onClick={() => handlePaySalary(teacher)}
                          disabled={isProcessing === teacher.id}
                          className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold rounded-lg hover:shadow-md transition disabled:opacity-50"
                        >
                          {isProcessing === teacher.id ? <Loader2 size={14} className="animate-spin" /> : <Wallet size={14} className="inline me-1" />}
                          Pay Salary
                        </button>
                      ) : (
                        <button className="px-3 py-1.5 border border-border-light text-xs font-semibold rounded-lg text-text-muted cursor-not-allowed">
                          Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

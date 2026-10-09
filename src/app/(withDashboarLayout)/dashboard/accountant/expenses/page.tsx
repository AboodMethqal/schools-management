'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  MoreVertical,
  Calendar,
  Tag,
  DollarSign,
  FileText,
  Trash2,
  Edit2,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createExpense, getExpenses, updateExpense, deleteExpense } from '@/app/actions/expense';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import Papa from 'papaparse';
import { useLanguage } from '@/context/LanguageProvider';

// Reusing the Card component pattern with theme variables
const Card = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-bg-card rounded-2xl border border-border-light shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
  >
    {children}
  </div>
);

const MOCK_EXPENSES = [
  {
    id: 'EXP-001',
    title: 'Electricity Bill - Jan',
    category: 'Utility',
    amount: 12500,
    date: '15 Feb, 2026',
    status: 'Paid',
    addedBy: 'Admin',
  },
  {
    id: 'EXP-002',
    title: 'Internet Subscription',
    category: 'Utility',
    amount: 3000,
    date: '10 Feb, 2026',
    status: 'Paid',
    addedBy: 'Fin-Controller',
  },
  {
    id: 'EXP-003',
    title: 'School Building Maintenance',
    category: 'Maintenance',
    amount: 45000,
    date: '05 Feb, 2026',
    status: 'Pending',
    addedBy: 'Super Admin',
  },
  {
    id: 'EXP-004',
    title: 'Sports Day Equipment',
    category: 'Event',
    amount: 25000,
    date: '01 Feb, 2026',
    status: 'Paid',
    addedBy: 'Admin',
  },
  {
    id: 'EXP-005',
    title: 'Office Stationery',
    category: 'Others',
    amount: 5500,
    date: '28 Jan, 2026',
    status: 'Paid',
    addedBy: 'Accountant',
  },
];

const CATEGORIES = ['Utility', 'Maintenance', 'Event', 'Rent', 'Others'];

export default function ExpensesPage() {
  const { t, language } = useLanguage();
  const currency = language === 'ar' ? 'ر.ي' : '$';
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Real Expense Data State
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: CATEGORIES[0],
    amount: '',
    transactionAt: new Date().toISOString().split('T')[0],
    note: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any | null>(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setIsLoading(true);
    const res = await getExpenses();
    if (res.success && res.data) {
      setExpenses(res.data);
    }
    setIsLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSaveExpense = async () => {
    if (!formData.title || !formData.amount || !formData.transactionAt) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      
      let base64Image = null;
      if (selectedFile) {
        base64Image = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(selectedFile);
        });
      }

      const expenseData = {
        title: formData.title,
        category: formData.category,
        amount: Number(formData.amount),
        transactionAt: formData.transactionAt,
        note: formData.note,
        status: 'Paid' as const,
        image: base64Image,
      };

      const res = editingExpense 
        ? await updateExpense(editingExpense.id, expenseData)
        : await createExpense(expenseData);

      if (res.success) {
        Swal.fire({
          title: editingExpense ? 'Updated!' : 'Created!',
          text: `Expense ${editingExpense ? 'updated' : 'created'} successfully.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
          color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a'
        });
        
        setIsModalOpen(false);
        setEditingExpense(null);
        setFormData({
          title: '',
          category: CATEGORIES[0],
          amount: '',
          transactionAt: new Date().toISOString().split('T')[0],
          note: '',
        });
        setSelectedFile(null);
        fetchExpenses(); // Refresh the list
      } else {
        toast.error(res.error || `Failed to ${editingExpense ? 'update' : 'create'} expense`);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (expense: any) => {
    setEditingExpense(expense);
    setFormData({
      title: expense.title,
      category: expense.category,
      amount: expense.amount.toString(),
      transactionAt: new Date(expense.transactionAt).toISOString().split('T')[0],
      note: expense.note || '',
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!',
      background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
      color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a'
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteExpense(id);
        if (res.success) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Expense has been deleted.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
            color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a'
          });
          fetchExpenses();
        } else {
          toast.error(res.error || 'Failed to delete expense');
        }
      } catch (error) {
        console.error(error);
        toast.error('An error occurred');
      }
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'All' || expense.category === filterCategory;
    
    // Normalize dates for comparison (ignoring time)
    const expenseDate = new Date(expense.transactionAt);
    expenseDate.setHours(0, 0, 0, 0);
    const expTime = expenseDate.getTime();
    
    let matchesDate = true;
    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      startDate.setHours(0, 0, 0, 0);
      matchesDate = matchesDate && expTime >= startDate.getTime();
    }
    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(0, 0, 0, 0);
      matchesDate = matchesDate && expTime <= endDate.getTime();
    }
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const handleExportCSV = () => {
    if (expenses.length === 0) {
      toast.error('No data to export');
      return;
    }

    const csvData = expenses.map(expense => ({
      ID: expense.id,
      Title: expense.title,
      Category: expense.category,
      Amount: expense.amount,
      Date: new Date(expense.transactionAt).toLocaleDateString(),
      Status: expense.status,
      Note: expense.note || ''
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV exported successfully');
  };

  const totalMonthlyExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const highestCategory = expenses.length > 0 
    ? [...new Set(expenses.map(e => e.category))].reduce((a, b) => 
        expenses.filter(e => e.category === a).length >= expenses.filter(e => e.category === b).length ? a : b
      )
    : 'None';

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Expense Management
          </h1>
          <p className="text-sm text-text-muted">
            Track and manage all school expenditures
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-bg-card border border-border-light rounded-xl text-sm font-medium text-text-secondary hover:bg-bg-page transition-all shadow-sm"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button
            onClick={() => {
              setEditingExpense(null);
              setFormData({
                title: '',
                category: CATEGORIES[0],
                amount: '',
                transactionAt: new Date().toISOString().split('T')[0],
                note: '',
              });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-md shadow-primary/20"
          >
            <Plus size={18} />
            Add Expense
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Total Monthly Expense
            </p>
            <h3 className="text-xl font-bold text-text-primary">{language === 'ar' ? `ر.ي ${totalMonthlyExpense.toLocaleString()}` : `$${totalMonthlyExpense.toLocaleString()}`}</h3>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Tag size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Highest Category
            </p>
            <h3 className="text-xl font-bold text-text-primary">{highestCategory}</h3>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Invoices Processed
            </p>
            <h3 className="text-xl font-bold text-text-primary">{expenses.length} Items</h3>
          </div>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border-light flex flex-col md:flex-row md:items-center justify-between gap-4 bg-bg-page/50">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted"
              size={18}
            />
            <input
              type="text"
              placeholder={language === "ar" ? "البحث في المصروفات..." : "Search expenses..."}
              className="w-full ps-10 pe-4 py-2 rounded-xl bg-bg-card border border-border-light text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter */}
            <div className="relative min-w-[140px]">
              <Filter className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={14} />
              <select
                className="w-full ps-9 pe-8 py-2 bg-bg-card border border-border-light rounded-xl text-sm text-text-secondary hover:bg-bg-page transition-all appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="All">{language === "ar" ? "جميع الفئات" : "All Categories"}</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown className="absolute end-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={14} />
            </div>

            {/* Date Filters */}
            <div className="flex items-center gap-2 bg-bg-card border border-border-light rounded-xl px-2 py-1">
              <div className="flex items-center gap-1.5 px-1">
                <Calendar size={14} className="text-text-muted" />
                <input
                  type="date"
                  className="bg-transparent text-xs text-text-secondary focus:outline-none cursor-pointer w-[110px]"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  placeholder={language === "ar" ? "البداية" : "Start"}
                />
              </div>
              <div className="h-4 w-px bg-border-light" />
              <div className="flex items-center gap-1.5 px-1">
                <input
                  type="date"
                  className="bg-transparent text-xs text-text-secondary focus:outline-none cursor-pointer w-[110px]"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  placeholder={language === "ar" ? "النهاية" : "End"}
                />
              </div>
              {(dateRange.start || dateRange.end) && (
                <button 
                  onClick={() => setDateRange({ start: '', end: '' })}
                  className="p-1 hover:bg-bg-page rounded-lg transition-all text-text-muted"
                >
                  <Plus className="rotate-45" size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start">
            <thead>
              <tr className="bg-bg-page/80 text-text-secondary border-b border-border-light">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider">
                  Expense ID
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider">
                  Title & Date
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-end">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-sm text-text-muted"
                  >
                    Loading expenses...
                  </td>
                </tr>
              ) : filteredExpenses.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-sm text-text-muted"
                  >
                    No expenses found.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="hover:bg-bg-page/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                        {expense.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-text-primary">
                          {expense.title}
                        </span>
                        <span className="text-xs text-text-muted flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(expense.transactionAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                          expense.category === 'Utility'
                            ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                            : expense.category === 'Maintenance'
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                              : expense.category === 'Event'
                                ? 'bg-purple-500/10 text-purple-500 border-purple-500/20'
                                : 'bg-slate-500/10 text-text-muted border-border-light'
                        }`}
                      >
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-text-primary">
                        {language === 'ar'
                          ? `ر.ي ${typeof expense.amount === 'number' ? expense.amount.toLocaleString() : expense.amount}`
                          : `$${typeof expense.amount === 'number' ? expense.amount.toLocaleString() : String(expense.amount).replace('ر.ي ', '')}`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          expense.status === 'Paid'
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            expense.status === 'Paid'
                              ? 'bg-emerald-500'
                              : 'bg-rose-500'
                          }`}
                        />
                        {expense.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-end">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditClick(expense)}
                          className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 rounded-xl transition-all shadow-sm hover:shadow-md"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(expense.id)}
                          className="p-2 text-text-muted hover:text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-xl transition-all shadow-sm hover:shadow-md"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-card border border-transparent hover:border-border-light rounded-xl transition-all shadow-sm hover:shadow-md">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-bg-page/50 border-t border-border-light flex items-center justify-between">
          <p className="text-xs text-text-muted font-bold uppercase tracking-wider">
            Showing {filteredExpenses.length} of {expenses.length} items
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs font-bold text-text-muted hover:text-text-primary transition-all">
              Previous
            </button>
            <button className="px-3 py-1.5 bg-bg-card border border-border-light rounded-lg text-xs font-bold text-primary shadow-sm">
              1
            </button>
            <button className="px-3 py-1.5 text-xs font-bold text-text-muted hover:text-text-primary transition-all">
              2
            </button>
            <button className="px-3 py-1.5 text-xs font-bold text-text-muted hover:text-text-primary transition-all">
              Next
            </button>
          </div>
        </div>
      </Card>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isSubmitting) {
                  setIsModalOpen(false);
                  setEditingExpense(null);
                }
              }}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-bg-card rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-xl overflow-hidden border border-border-light flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-8 border-b border-border-light flex items-center justify-between bg-bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                    {editingExpense ? 'Edit Expense' : 'Add New Expense'}
                  </h2>
                  <p className="text-[10px] text-text-muted mt-1 font-bold uppercase tracking-widest">
                    {editingExpense ? 'Update Entry' : 'Transaction Entry'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingExpense(null);
                  }}
                  className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-page rounded-full transition-all border border-border-light shadow-sm"
                >
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ms-1">
                    Expense Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder={language === "ar" ? "مثال: فاتورة الكهرباء الشهرية" : "e.g. Monthly Electricity Bill"}
                    className="w-full px-5 py-3.5 rounded-2xl bg-bg-page border border-border-light text-text-primary focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-text-muted/40 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ms-1">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-5 py-3.5 rounded-2xl bg-bg-page border border-border-light text-text-primary focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer font-medium"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat}>{cat}</option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute end-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                        size={18}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ms-1">
                      {language === 'ar' ? 'المبلغ (ر.ي)' : 'Amount ($)'}
                    </label>
                    <div className="relative">
                      <DollarSign
                        className="absolute start-4 top-1/2 -translate-y-1/2 text-text-muted"
                        size={18}
                      />
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData({ ...formData, amount: e.target.value })
                        }
                        placeholder="0.00"
                        className="w-full ps-12 pe-5 py-3.5 rounded-2xl bg-bg-page border border-border-light text-text-primary focus:outline-none focus:border-primary transition-all font-bold placeholder:text-text-muted/40"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ms-1">
                    Transaction Date
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute start-4 top-1/2 -translate-y-1/2 text-text-muted"
                      size={18}
                    />
                    <input
                      type="date"
                      value={formData.transactionAt}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          transactionAt: e.target.value,
                        })
                      }
                      className="w-full ps-12 pe-5 py-3.5 rounded-2xl bg-bg-page border border-border-light text-text-primary focus:outline-none focus:border-primary transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ms-1">
                    Note (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.note}
                    onChange={(e) =>
                      setFormData({ ...formData, note: e.target.value })
                    }
                    placeholder={language === "ar" ? "أضف أي تفاصيل إضافية..." : "Add any additional details..."}
                    className="w-full px-5 py-4 rounded-2xl bg-bg-page border border-border-light text-text-primary focus:outline-none focus:border-primary transition-all resize-none placeholder:text-text-muted/40 font-medium"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ms-1">
                    Attachment
                  </label>
                  <label className="p-8 bg-bg-page/50 border-2 border-border-light border-dashed rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-primary/5 hover:border-primary/40 transition-all group relative overflow-hidden min-h-[160px]">
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    {selectedFile ? (
                      <div className="flex flex-col items-center gap-2 animate-in zoom-in-95 duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-sm text-primary">
                          <FileText size={24} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-text-primary px-4 truncate max-w-[200px]">
                            {selectedFile.name}
                          </p>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedFile(null);
                            }}
                            className="text-[10px] text-rose-500 font-bold uppercase tracking-tight mt-1 hover:underline"
                          >
                            Remove File
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-2xl bg-bg-card border border-border-light flex items-center justify-center shadow-sm text-text-muted group-hover:text-primary transition-all">
                          <Download className="rotate-180" size={20} />
                        </div>
                        <p className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                          Click to upload receipt
                        </p>
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-tight">
                          PDF, JPG or PNG
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-8 bg-bg-page/50 border-t border-border-light flex items-center gap-4">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingExpense(null);
                  }}
                  disabled={isSubmitting}
                  className="flex-1 py-4 px-6 border border-border-light text-sm font-bold text-text-secondary rounded-2xl hover:bg-bg-card hover:shadow-sm transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveExpense}
                  disabled={isSubmitting}
                  className="flex-[2] py-4 px-6 bg-primary text-white text-sm font-bold rounded-2xl hover:opacity-95 transition-all shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingExpense ? 'Update Expense' : 'Save Expense'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

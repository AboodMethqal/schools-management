import {
  LayoutDashboard,
  CalendarCheck,
  GraduationCap,
  Bell,
  CreditCard,
  User,
  BookOpen,
  UserCheck,
  Upload,
  Megaphone,
  Users,
  Building2,
  ListOrdered,
  Receipt,
  LifeBuoy,
  Settings2,
  Wallet,
  TrendingDown,
  FileText,
  History,
  Settings,
  LineChart,
  ClipboardList,
  BarChart3,
  LayoutDashboard as LayoutDashboardIcon,
  Users2,
  UserRoundCheck,
  MessageCircle,
  FileBarChart,
  CalendarDays,
} from 'lucide-react';
import { DashboardMenuItem } from './types';

export const studentMenuItems: DashboardMenuItem[] = [
  { title: 'Dashboard', url: '/dashboard/student', icon: LayoutDashboard },
  {
    title: 'Attendance',
    url: '/dashboard/student/attendance',
    icon: CalendarCheck,
  },
  { title: 'Results', url: '/dashboard/student/results', icon: GraduationCap },
  {
    title: 'Notices',
    url: '/dashboard/student/notices',
    icon: Bell,
    badge: '3',
  },
  {
    title: 'Take Exam',
    url: '/dashboard/student/take-exam',
    icon: ClipboardList,
  },
  {
    title: 'My Exams',
    url: '/dashboard/student/my-exams',
    icon: FileText,
  },
  {
    title: 'Progress',
    url: '/dashboard/student/progress',
    icon: LineChart,
  },
  { title: 'Payments', url: '/dashboard/student/payments', icon: CreditCard },
  { title: 'Profile', url: '/dashboard/student/profile', icon: User },
];

export const teacherMenuItems: DashboardMenuItem[] = [
  { title: 'Dashboard', url: '/dashboard/teacher', icon: LayoutDashboard },
  {
    title: 'My Classes',
    url: '/dashboard/teacher/my-classes',
    icon: BookOpen,
    badge: '4',
  },
  {
    title: 'Take Attendance',
    url: '/dashboard/teacher/attendance',
    icon: UserCheck,
    badge: '2',
  },
  {
    title: 'Enter Results',
    url: '/dashboard/teacher/results',
    icon: GraduationCap,
  },
  {
    title: 'Create Exam',
    url: '/dashboard/teacher/create-exam',
    icon: ClipboardList,
  },
  {
    title: 'My Exams',
    url: '/dashboard/teacher/my-exams',
    icon: FileText,
  },
  {
    title: 'MCQ Results',
    url: '/dashboard/teacher/mcq-results',
    icon: BarChart3,
  },
  {
    title: 'Study Materials',
    url: '/dashboard/teacher/study-materials',
    icon: Upload,
  },
  {
    title: 'Notices',
    url: '/dashboard/teacher/notices',
    icon: Megaphone,
    badge: 'new',
  },
  { title: 'Feedback', url: '/dashboard/teacher/feedback', icon: Users },
  {
    title: 'Class Schedule',
    url: '/dashboard/teacher/schedule',
    icon: CalendarCheck,
  },
  { title: 'Profile', url: '/dashboard/teacher/profile', icon: Users },
];

export const superAdminMenuItems: DashboardMenuItem[] = [
  { title: 'Overview', url: '/dashboard/super-admin', icon: LayoutDashboard },
  {
    title: 'School Applications',
    url: '/dashboard/super-admin/applications',
    icon: FileText,
  },
  {
    title: 'Schools Management',
    url: '/dashboard/super-admin/schools',
    icon: Building2,
  },
  {
    title: 'Subscription Plans',
    url: '/dashboard/super-admin/plans',
    icon: ListOrdered,
  },
  {
    title: 'All Users',
    url: '/dashboard/super-admin/all-users',
    icon: CreditCard,
  },
  {
    title: 'Transactions',
    url: '/dashboard/super-admin/transactions',
    icon: Receipt,
  },
  {
    title: 'Support Tickets',
    url: '/dashboard/super-admin/support',
    icon: LifeBuoy,
  },
  {
    title: 'System Settings',
    url: '/dashboard/super-admin/add-users',
    icon: Settings,
  },
];

export const accountantMenuItems: DashboardMenuItem[] = [
  { title: 'Dashboard', url: '/dashboard/accountant', icon: LayoutDashboard },
  {
    title: 'Assign Fee',
    url: '/dashboard/accountant/fee-collection',
    icon: CreditCard,
  },
  {
    title: 'Student Due List',
    url: '/dashboard/accountant/due-list',
    icon: Receipt,
    badge: '48',
  },
  {
    title: 'Salary Management',
    url: '/dashboard/accountant/salary',
    icon: Wallet,
  },
  {
    title: 'Expense Management',
    url: '/dashboard/accountant/expenses',
    icon: TrendingDown,
  },
  {
    title: 'Financial Reports',
    url: '/dashboard/accountant/reports',
    icon: FileText,
  },
  {
    title: 'Payment History',
    url: '/dashboard/accountant/history',
    icon: History,
  },
  { title: 'Settings', url: '/dashboard/accountant/settings', icon: Settings },
];

export const parentMenuItems: DashboardMenuItem[] = [
  { title: 'Dashboard', url: '/dashboard/parent', icon: LayoutDashboardIcon },
  { title: 'My Children', url: '/dashboard/parent/children', icon: Users2 },
  { title: 'Attendance', url: '/dashboard/parent/attendance', icon: CalendarCheck },
  { title: 'Results', url: '/dashboard/parent/results', icon: GraduationCap, badge: 'New' },
  { title: 'Reports', url: '/dashboard/parent/reports', icon: FileBarChart },
  { title: 'Communication', url: '/dashboard/parent/communication', icon: MessageCircle },
  { title: 'Fees', url: '/dashboard/parent/fees', icon: CreditCard },
  { title: 'Notices', url: '/dashboard/parent/notices', icon: Bell },
  { title: 'Profile', url: '/dashboard/parent/profile', icon: User },
  { title: 'Settings', url: '/dashboard/parent/settings', icon: Settings },
];

export const principalMenuItems: DashboardMenuItem[] = [
  { title: 'Dashboard', url: '/dashboard/principal', icon: LayoutDashboard },
  {
    title: 'Announcements',
    url: '/dashboard/principal/announcements',
    icon: Megaphone,
  },
  { title: 'Students', url: '/dashboard/principal/students', icon: Users2 },
  { title: 'Teachers', url: '/dashboard/principal/teachers', icon: Users },
  {
    title: 'Attendance',
    url: '/dashboard/principal/attendance',
    icon: UserCheck,
  },
  {
    title: 'Performance',
    url: '/dashboard/principal/performance',
    icon: LineChart,
  },
  { title: 'Finance', url: '/dashboard/principal/finance', icon: Wallet },
  { title: 'Reports', url: '/dashboard/principal/reports', icon: FileText },
  {
    title: 'Support Tickets',
    url: '/dashboard/principal/addsupport',
    icon: LifeBuoy,
  },
  {
    title: 'Subscription',
    url: '/dashboard/principal/subscription',
    icon: CreditCard,
    badge: 'Pro',
  },
  {
    title: 'Settings',
    url: '/dashboard/principal/settings',
    icon: Settings,
  },
];

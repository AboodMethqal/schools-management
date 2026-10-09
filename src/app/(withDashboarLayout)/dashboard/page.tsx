import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/getCurrentUser';

export const dynamic = "force-dynamic";

export default async function DashboardRootPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect('/login');
  }

  switch (currentUser.role) {
    case 'super_admin':
      redirect('/dashboard/super-admin');
      case 'admin':
          
      redirect('/dashboard/principal');
      case 'teacher':
          
      redirect('/dashboard/teacher');
    case 'parent':
      redirect('/dashboard/parent');
    case 'accountant':
      redirect('/dashboard/accountant');
    case 'student':
    default:
      redirect('/dashboard/student');
  }
}

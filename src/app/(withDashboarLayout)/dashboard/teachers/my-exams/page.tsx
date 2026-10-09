import { redirect } from 'next/navigation';

export default function TeachersMyExamsRedirect() {
  redirect('/dashboard/teacher/my-exams');
}

import { redirect } from 'next/navigation';

export default function TeachersCreateExamRedirect() {
  redirect('/dashboard/teacher/create-exam');
}

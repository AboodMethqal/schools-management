import { redirect } from 'next/navigation';

export default function TeachersMyExamRedirect() {
  redirect('/dashboard/teacher/my-exams');
}

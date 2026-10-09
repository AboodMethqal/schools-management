import { getSchoolById } from "@/app/actions/school";
import EditSchoolForm from "@/app/(withDashboarLayout)/dashboard/super-admin/schools/editschool/page"; // পাশের ফাইলটি
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // আপনার লজিক অনুযায়ী আইডি দিয়ে ডাটা আনা হচ্ছে
  const result = await getSchoolById(id);

  if (!result.success || !result.data) {
    return notFound();
  }

  // এবার এই ডাটাটি আপনার ফরমে পাঠিয়ে দিচ্ছি
  return <EditSchoolForm initialData={result.data} />;
}

import { getSchoolById } from "@/app/actions/school";
import EditSchoolForm from "@/app/(withDashboarLayout)/dashboard/super-admin/schools/editschool/page";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch school details by ID
  const result = await getSchoolById(id);

  if (!result.success || !result.data) {
    return notFound();
  }

  // Pass data to edit form
  return <EditSchoolForm initialData={result.data} />;
}

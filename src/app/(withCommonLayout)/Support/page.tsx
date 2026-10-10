import SupportClient from "@/components/support/supportClient";
import { getSupportOptions } from "@/app/actions/support";

export default async function SupportPage() {
  // Fetch support data on server
  const supportData = await getSupportOptions();

  return (
    <main className="min-h-screen">
      <SupportClient initialOptions={supportData} />
    </main>
  );
}

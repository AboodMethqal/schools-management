import SupportClient from "@/components/support/supportClient"; // আপনার কম্পোনেন্ট পাথ
import { getSupportOptions } from "@/app/actions/support";

export default async function SupportPage() {
  // ১. সরাসরি ডাটাবেস থেকে ডাটা ফেচ করা হচ্ছে সার্ভারে
  const supportData = await getSupportOptions();

  return (
    <main className="min-h-screen">
      {/* ২. ডাটা প্রপ হিসেবে ক্লায়েন্ট কম্পোনেন্টে পাস করা হচ্ছে */}
      <SupportClient initialOptions={supportData} />
    </main>
  );
}

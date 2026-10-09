"use server";
import { prisma } from "@/lib/prisma"; // আপনার প্রিজমা পাথ চেক করে নিন

export async function getSupportOptions() {
  try {
    const data = await prisma.supportOption.findMany({
      orderBy: { order: "asc" }, // সিরিয়াল অনুযায়ী ডাটা আসবে
    });
    return data; // এটি একটি অ্যারে রিটার্ন করবে
  } catch (error) {
    console.error("Database Error:", error);
    return []; // এরর হলে খালি অ্যারে পাঠাবে যাতে .map ক্র্যাশ না করে
  }
}

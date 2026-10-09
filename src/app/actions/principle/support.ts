'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * নতুন সাপোর্ট টিকেট তৈরি করা (ImgBB ইমেজ আপলোড সহ)
 */
export async function createSupportTicket(data: {
  subject: string;
  description: string;
  priority: string;
  userEmail: string;
  image?: string | null; // Base64 string from frontend
}) {
  try {
    let imageUrl = '';

    // ১. যদি ইমেজ থাকে তবে ImgBB-তে আপলোড করা
    if (data.image) {
      // Base64 ডাটা থেকে 'data:image/png;base64,' এই অংশটুকু বাদ দিয়ে শুধু মেইন কোডটি নিতে হয়
      const base64Data = data.image.split(',')[1];

      const formData = new FormData();
      formData.append('image', base64Data);

      // ImgBB API Call
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
        {
          method: 'POST',
          body: formData,
        },
      );

      const uploadResult = await response.json();

      if (uploadResult.success) {
        imageUrl = uploadResult.data.url; // ImgBB থেকে প্রাপ্ত সরাসরি লিঙ্ক
      } else {
        console.error('ImgBB Upload Failed:', uploadResult);
        throw new Error('Image upload failed to ImgBB');
      }
    }

    // ২. Prisma দিয়ে ডাটাবেজে সেভ করা
    const ticket = await prisma.supportTicket.create({
      data: {
        subject: data.subject,
        description: data.description,
        priority: data.priority,
        userEmail: data.userEmail,
        attachmentUrl: imageUrl, // ডাটাবেজে লিংক্টা সেভ হচ্ছে
      },
    });

    // ডাটা ক্যাশ ক্লিয়ার করা যাতে সাথে সাথে নতুন ডাটা দেখায়
    revalidatePath('/dashboard/support');

    return { success: true, data: ticket };
  } catch (error: any) {
    console.error('Create Ticket Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create ticket',
    };
  }
}

/**
 * ডাটাবেজ থেকে সব টিকেট লোড করা
 */
export async function getAllSupportTickets() {
  try {
    const tickets = await prisma.supportTicket.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return { success: true, data: tickets };
  } catch (error) {
    console.error('Fetch Error:', error);
    return { success: false, error: 'Failed to load tickets' };
  }
}

/**
 * টিকেটের স্ট্যাটাস (Open/Completed) আপডেট করা
 */
export async function updateTicketStatus(ticketId: string, newStatus: string) {
  try {
    const updated = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status: newStatus },
    });
    revalidatePath('/dashboard/support');
    return { success: true, data: updated };
  } catch (error) {
    console.error('Update Status Error:', error);
    return { success: false, error: 'Failed to update status' };
  }
}

/**
 * টিকেট ডিলিট করা
 */
export async function deleteTicket(ticketId: string) {
  try {
    await prisma.supportTicket.delete({
      where: { id: ticketId },
    });
    revalidatePath('/dashboard/support');
    return { success: true };
  } catch (error) {
    console.error('Delete Error:', error);
    return { success: false, error: 'Failed to delete ticket' };
  }
}

'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { revalidatePath } from 'next/cache';

type ExpenseInput = {
  title: string;
  category: string;
  amount: number;
  transactionAt: string; // YYYY-MM-DD
  note?: string;
  status?: 'Paid' | 'Pending';
  attachmentUrl?: string;
  image?: string | null; // Base64 string from frontend
};

// Only authorized roles can manage expenses
function canManageExpense(role: string) {
  return ['accountant', 'admin', 'super_admin'].includes(role);
}

// Function to upload to ImgBB
async function uploadToImgBB(base64Image: string) {
  try {
    const base64Data = base64Image.split(',')[1] || base64Image;
    const formData = new FormData();
    formData.append('image', base64Data);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      {
        method: 'POST',
        body: formData,
      },
    );

    const result = await response.json();
    if (result.success) {
      return result.data.url;
    }
    console.error('ImgBB Upload Failed:', result);
    return null;
  } catch (error) {
    console.error('ImgBB Upload Error:', error);
    return null;
  }
}

export async function createExpense(data: ExpenseInput) {
  try {
    let currentUser = await getCurrentUser();

    // Development fallback
    if (!currentUser && process.env.NODE_ENV === 'development') {
      if (!prisma.user) {
        console.error('❌ prisma.user is undefined in development fallback');
        return { success: false, error: 'Database model "user" is missing. Please run "npx prisma generate" and restart the server.' };
      }
      currentUser = await prisma.user.findFirst({
        where: { role: { in: ['admin', 'super_admin', 'accountant'] } },
      });
    }

    if (!currentUser)
      return { success: false, error: 'Authentication required' };
    if (!canManageExpense(currentUser.role as string))
      return { success: false, error: 'Unauthorized' };
    if (!currentUser.schoolId)
      return { success: false, error: 'Your account is not linked to a school.' };

    const schoolId = currentUser.schoolId as string;
    let attachmentUrl = data.attachmentUrl || null;
    if (data.image) {
      const uploadedUrl = await uploadToImgBB(data.image);
      if (uploadedUrl) attachmentUrl = uploadedUrl;
    }

    const expense = await prisma.expense.create({
      data: {
        title: data.title,
        category: data.category,
        amount: Number(data.amount),
        transactionAt: new Date(data.transactionAt),
        note: data.note || null,
        status: data.status || 'Paid',
        attachmentUrl: attachmentUrl,
        schoolId: schoolId, // auto assign schoolId
        createdById: currentUser.id,
      },
    });

    revalidatePath('/dashboard/accountant/expenses');
    return { success: true, data: expense };
  } catch (error: any) {
    console.error('Failed to create expense:', error);
    return { success: false, error: error.message };
  }
}

export async function getExpenses() {
  try {
    let currentUser = await getCurrentUser();

    // Development fallback
    if (!currentUser && process.env.NODE_ENV === 'development') {
      if (!prisma.user) {
        console.error('❌ prisma.user is undefined in development fallback (getExpenses)');
        return { success: false, error: 'Database model "user" is missing.', data: [] };
      }
      currentUser = await prisma.user.findFirst({
        where: { role: { in: ['admin', 'super_admin', 'accountant'] } },
      });
    }

    if (!currentUser)
      return { success: false, error: 'Authentication required', data: [] };

    const data = await prisma.expense.findMany({
      where: currentUser.schoolId
        ? { schoolId: currentUser.schoolId }
        : undefined, // fallback if no schoolId in dev
      orderBy: { transactionAt: 'desc' },
    });

    return { success: true, data };
  } catch (error: any) {
    console.error('Failed to get expenses:', error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function updateExpense(id: string, data: Partial<ExpenseInput>) {
  try {
    let currentUser = await getCurrentUser();

    // Development fallback
    if (!currentUser && process.env.NODE_ENV === 'development') {
      if (!prisma.user) {
        console.error('❌ prisma.user is undefined in development fallback (updateExpense)');
        return { success: false, error: 'Database model "user" is missing.' };
      }
      currentUser = await prisma.user.findFirst({
        where: { role: { in: ['admin', 'super_admin', 'accountant'] } },
      });
    }

    if (!currentUser)
      return { success: false, error: 'Authentication required' };
    if (!canManageExpense(currentUser.role))
      return { success: false, error: 'Unauthorized' };
    if (!currentUser.schoolId)
      return { success: false, error: 'Your account is not linked to a school.' };

    const schoolId = currentUser.schoolId as string;

    // verify ownership and existence
    if (!prisma.expense) {
      console.error('❌ prisma.expense is undefined in updateExpense');
      return { success: false, error: 'Database model "expense" is missing. Please run "npx prisma generate" and restart the server.' };
    }
    const existing = await prisma.expense.findFirst({
      where: { id, schoolId },
    });
    if (!existing) return { success: false, error: 'Expense not found' };

    let attachmentUrl = data.attachmentUrl !== undefined ? (data.attachmentUrl || null) : existing.attachmentUrl;
    if (data.image) {
      const uploadedUrl = await uploadToImgBB(data.image);
      if (uploadedUrl) attachmentUrl = uploadedUrl;
    }

    const updated = await prisma.expense.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.category !== undefined ? { category: data.category } : {}),
        ...(data.amount !== undefined ? { amount: Number(data.amount) } : {}),
        ...(data.transactionAt !== undefined
          ? { transactionAt: new Date(data.transactionAt) }
          : {}),
        ...(data.note !== undefined ? { note: data.note || null } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        attachmentUrl: attachmentUrl,
      },
    });

    revalidatePath('/dashboard/accountant/expenses');
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Failed to update expense:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteExpense(id: string) {
  try {
    let currentUser = await getCurrentUser();

    // Development fallback
    if (!currentUser && process.env.NODE_ENV === 'development') {
      if (!prisma.user) {
        console.error('❌ prisma.user is undefined in development fallback (deleteExpense)');
        return { success: false, error: 'Database model "user" is missing.' };
      }
      currentUser = await prisma.user.findFirst({
        where: { role: { in: ['admin', 'super_admin', 'accountant'] } },
      });
    }

    if (!currentUser)
      return { success: false, error: 'Authentication required' };
    if (!canManageExpense(currentUser.role))
      return { success: false, error: 'Unauthorized' };
    if (!currentUser.schoolId)
      return { success: false, error: 'Your account is not linked to a school.' };

    const schoolId = currentUser.schoolId as string;

    const existing = await prisma.expense.findFirst({
      where: { id, schoolId },
    });
    if (!existing) return { success: false, error: 'Expense not found' };

    await prisma.expense.delete({ where: { id } });

    revalidatePath('/dashboard/accountant/expenses');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete expense:', error);
    return { success: false, error: error.message };
  }
}

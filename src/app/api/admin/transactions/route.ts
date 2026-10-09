import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const transactions = await prisma.subscription.findMany({
            include: {
                school: {
                    select: {
                        schoolName: true,
                        schoolEmail: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(transactions);
    } catch (error: any) {
        console.error('Fetch Transactions Error:', error);
        return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }
}

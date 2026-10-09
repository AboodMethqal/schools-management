import { NextResponse } from 'next/server';
import { getParentResultsData } from '@/app/actions/parent/results';
import { getCurrentUser } from '@/lib/getCurrentUser';

export async function POST() {
  try {
    const user = await getCurrentUser();
    const actionResult = await getParentResultsData();
    
    return NextResponse.json({
        currentUser: user,
        actionResult
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getSchoolApplications, approveSchoolApplication, rejectSchoolApplication } from '@/app/actions/application';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'ALL';
        const search = searchParams.get('search') || '';

        const result = await getSchoolApplications({ status, search });
        return NextResponse.json(result, { status: result.success ? 200 : 403 });
    } catch (err: unknown) {
        return NextResponse.json(
            { success: false, error: (err as Error).message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, id, notes } = body;

        if (!id) {
            return NextResponse.json({ success: false, error: 'Application ID is required' }, { status: 400 });
        }

        if (action === 'APPROVE') {
            const result = await approveSchoolApplication(id, notes);
            return NextResponse.json(result, { status: result.success ? 200 : 400 });
        } else if (action === 'REJECT') {
            const result = await rejectSchoolApplication(id, notes);
            return NextResponse.json(result, { status: result.success ? 200 : 400 });
        } else {
            return NextResponse.json({ success: false, error: 'Invalid action. Expected APPROVE or REJECT' }, { status: 400 });
        }
    } catch (err: unknown) {
        return NextResponse.json(
            { success: false, error: (err as Error).message },
            { status: 500 }
        );
    }
}

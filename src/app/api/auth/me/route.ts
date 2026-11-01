import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';

interface DigestError {
  digest?: string;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession(request);

    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        email: session.email,
        role: session.role,
      },
    });
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'digest' in err &&
      typeof (err as DigestError).digest === 'string' &&
      Boolean((err as DigestError).digest?.startsWith('NEXT_'))
    ) {
      throw err;
    }
    console.error('Session check error:', err);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

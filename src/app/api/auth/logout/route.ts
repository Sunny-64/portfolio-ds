import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, logAdminAction } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    logAdminAction('admin_logout', request).catch(() => {});

    const response = NextResponse.json({ ok: true, message: 'Logged out successfully' });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    });

    return response;
  } catch (err) {
    console.error('Logout error:', err);
    return NextResponse.json({ error: 'Failed to log out' }, { status: 500 });
  }
}

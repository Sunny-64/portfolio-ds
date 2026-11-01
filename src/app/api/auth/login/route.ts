import { NextRequest, NextResponse } from 'next/server';
import {
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginRateLimit,
  verifyAdminCredentials,
  createSessionToken,
  SESSION_COOKIE_NAME,
  logAdminAction,
} from '@/lib/auth';
import { LoginSchema } from '@/lib/validations/cms';

export async function POST(request: NextRequest) {
  try {
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'localhost';
    const ipKey = `login_${clientIp}`;

    // 1. Rate limiting check
    const rateLimit = await checkLoginRateLimit(ipKey);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many failed login attempts. Please try again in 15 minutes.' },
        { status: 429 }
      );
    }

    // 2. Validate input
    const body = await request.json().catch(() => null);
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid login details' },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // 3. Verify credentials
    const verification = await verifyAdminCredentials(email, password);
    if (!verification.success) {
      await recordFailedLogin(ipKey);
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // 4. Reset rate limit and generate token
    await resetLoginRateLimit(ipKey);
    const token = await createSessionToken();

    // 5. Create secure response with HTTP-only cookie
    const response = NextResponse.json({
      ok: true,
      user: { email: email.trim().toLowerCase() },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // 6. Log admin login
    logAdminAction('admin_login_success', request, { email }).catch(() => {});

    return response;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}

import { verify } from '@node-rs/argon2';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getAdminLogsCollection, getLoginAttemptsCollection } from './mongodb';
import { UAParser } from 'ua-parser-js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const SESSION_SECRET = process.env.SESSION_SECRET || 'fallback-secret-at-least-32-chars-long-security-key';

export const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds

const secretKey = new TextEncoder().encode(SESSION_SECRET);

export interface AdminSessionPayload {
  email: string;
  role: 'admin';
  iat?: number;
  exp?: number;
}

/**
 * Checks login rate limit based on client IP or identifier.
 * Max 5 failed attempts per 15 minutes.
 */
export async function checkLoginRateLimit(ipKey: string): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const attemptsCollection = await getLoginAttemptsCollection();
    if (!attemptsCollection) return { allowed: true, remaining: 5 };

    const record = await attemptsCollection.findOne({ ipKey });
    if (!record) {
      return { allowed: true, remaining: 5 };
    }

    if (record.count >= 5) {
      return { allowed: false, remaining: 0 };
    }

    return { allowed: true, remaining: Math.max(0, 5 - record.count) };
  } catch {
    return { allowed: true, remaining: 5 };
  }
}

export async function recordFailedLogin(ipKey: string): Promise<void> {
  try {
    const attemptsCollection = await getLoginAttemptsCollection();
    if (!attemptsCollection) return;

    await attemptsCollection.updateOne(
      { ipKey },
      {
        $inc: { count: 1 },
        $set: { lastAttempt: new Date() },
      },
      { upsert: true }
    );
  } catch {
    // Non-fatal
  }
}

export async function resetLoginRateLimit(ipKey: string): Promise<void> {
  try {
    const attemptsCollection = await getLoginAttemptsCollection();
    if (!attemptsCollection) return;
    await attemptsCollection.deleteOne({ ipKey });
  } catch {
    // Non-fatal
  }
}

/**
 * Verifies email and Argon2id password hash.
 */
export async function verifyAdminCredentials(
  identifier: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  let adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || '';
  if (adminPasswordHash.includes('\\$')) {
    adminPasswordHash = adminPasswordHash.replace(/\\/g, '');
  }

  if (!adminEmail || !adminPasswordHash) {
    return { success: false, error: 'Authentication is not configured on the server.' };
  }

  const input = identifier.trim().toLowerCase();
  const adminUsername = adminEmail.split('@')[0];

  // Case-insensitive comparison matching full email OR username
  const isIdentifierValid =
    input === adminEmail ||
    input === adminUsername ||
    input === 'sunny' ||
    input === 'admin';

  if (!isIdentifierValid) {
    return { success: false, error: 'Invalid email or password.' };
  }

  try {
    const isValid = await verify(adminPasswordHash, password);
    if (!isValid) {
      return { success: false, error: 'Invalid email or password.' };
    }
    return { success: true };
  } catch (err) {
    console.error('Password verification error:', err);
    return { success: false, error: 'Invalid email or password.' };
  }
}

/**
 * Creates a signed JWT session token for the admin.
 */
export async function createSessionToken(): Promise<string> {
  const email = process.env.ADMIN_EMAIL || ADMIN_EMAIL || 'admin';
  return new SignJWT({ email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(secretKey);
}

/**
 * Verifies a session token string.
 */
export async function verifySessionToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    if (payload.role === 'admin') {
      return payload as unknown as AdminSessionPayload;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Extracts session from Next.js server context (cookies() or NextRequest).
 */
export async function getAdminSession(request?: NextRequest | Request): Promise<AdminSessionPayload | null> {
  let token: string | undefined;

  if (request) {
    try {
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const match = cookieHeader.match(new RegExp(`(?:^|; )${SESSION_COOKIE_NAME}=([^;]*)`));
        if (match) token = decodeURIComponent(match[1]);
      }
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'digest' in err &&
        typeof (err as { digest?: unknown }).digest === 'string' &&
        Boolean(((err as { digest: string }).digest).startsWith('NEXT_'))
      ) {
        throw err;
      }
    }
  }

  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'digest' in err &&
        typeof (err as { digest?: unknown }).digest === 'string' &&
        Boolean(((err as { digest: string }).digest).startsWith('NEXT_'))
      ) {
        throw err;
      }
    }
  }

  if (!token) return null;

  return verifySessionToken(token);
}

/**
 * Guard for API routes or Server Actions.
 * Returns null if authorized, or a 401 NextResponse if unauthorized.
 */
export async function requireAdminAuth(
  request?: NextRequest | Request
): Promise<{ authorized: true; session: AdminSessionPayload } | { authorized: false; response: NextResponse }> {
  const session = await getAdminSession(request);
  if (!session) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 }),
    };
  }

  return { authorized: true, session };
}

/**
 * Logs an authenticated admin action for security and auditing.
 */
export async function logAdminAction(
  action: string,
  request?: NextRequest | Request,
  details?: Record<string, unknown>
): Promise<void> {
  try {
    const collection = await getAdminLogsCollection();
    if (!collection) return;

    let deviceType = 'desktop';
    let os = 'Unknown';
    let browser = 'Unknown';

    if (request) {
      const userAgent = request.headers.get('user-agent') || '';
      const parser = new UAParser(userAgent);
      const parsedDevice = parser.getDevice();
      const parsedOS = parser.getOS();
      const parsedBrowser = parser.getBrowser();

      deviceType = parsedDevice.type === 'mobile' ? 'mobile' : parsedDevice.type === 'tablet' ? 'tablet' : 'desktop';
      os = parsedOS.name || 'Unknown';
      browser = parsedBrowser.name || 'Unknown';
    }

    const endpoint = request instanceof NextRequest ? request.nextUrl.pathname : undefined;

    await collection.insertOne({
      actorType: 'admin',
      action,
      endpoint,
      details,
      deviceType,
      os,
      browser,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error('Failed to log admin action:', err);
  }
}

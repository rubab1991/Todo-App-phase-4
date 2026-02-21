import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Generate a deterministic user ID from email so the same user always gets the same ID
    const hash = crypto.createHash('sha256').update(email.toLowerCase().trim()).digest('hex').substring(0, 16);
    const userId = `user_${hash}`;

    // Get the secret from environment variables
    const secret = process.env.BETTER_AUTH_SECRET || process.env.NEXT_PUBLIC_API_SECRET || 'BG08QhrY6XrSET9ZDVXdYyYyDwYPgas1';
    const secretUint8 = new TextEncoder().encode(secret);

    // Create and sign a JWT
    const token = await new SignJWT({ userId, email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secretUint8);

    return NextResponse.json({
      userId,
      email,
      token,
      name: email.split('@')[0]
    });
  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json({ error: 'Sign up failed' }, { status: 500 });
  }
}
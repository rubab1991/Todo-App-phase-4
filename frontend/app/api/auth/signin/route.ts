import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // In a real implementation, you'd verify credentials against a database
    // For this demo, we'll just generate a token for any email/password combination
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

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
    console.error('Sign in error:', error);
    return NextResponse.json({ error: 'Sign in failed' }, { status: 500 });
  }
}
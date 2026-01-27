import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function GET(request: Request) {
  try {
    // Get the token from the Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Get the secret from environment variables
    const secret = process.env.BETTER_AUTH_SECRET || process.env.NEXT_PUBLIC_API_SECRET || 'BG08QhrY6XrSET9ZDVXdYyYyDwYPgas1';
    const secretUint8 = new TextEncoder().encode(secret);

    // Verify the JWT
    const verified = await jwtVerify(token, secretUint8);

    return NextResponse.json({
      user: {
        id: verified.payload.userId || verified.payload.sub,
        email: verified.payload.email,
      },
      token: token
    });
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
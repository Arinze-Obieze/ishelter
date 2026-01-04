import { NextResponse } from 'next/server';

export async function GET(req) {
  return NextResponse.json({
    INTERNAL_API_KEY: process.env.INTERNAL_API_KEY ? 'SET (value: ' + process.env.INTERNAL_API_KEY.substring(0, 20) + '...)' : 'NOT SET',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NODE_ENV: process.env.NODE_ENV,
  });
}

import { LoginSchema } from '@/app/lib/validations/loginSchema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = LoginSchema.parse(await req.json());
    console.log("Login attempt with email:", email, "and password:", password);

    return new NextResponse('Login successful', { status: 200 });
  } catch (error: any) {
    console.error('Error during login:', error);
    return new NextResponse(error.message, { status: 400 });
  }
}

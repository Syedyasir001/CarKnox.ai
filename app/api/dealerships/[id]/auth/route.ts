import { NextResponse } from 'next/server';
import { verifyOwnerPassword } from '@/lib/dealershipStore';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { password } = await request.json();
    if (!password) {
      return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
    }

    const valid = verifyOwnerPassword(params.id, password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
    }

    const token = Buffer.from(
      `${params.id}:${password}:${Date.now()}`
    ).toString('base64');

    return NextResponse.json({ token, dealershipId: params.id });
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}

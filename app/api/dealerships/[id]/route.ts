import { NextResponse } from 'next/server';
import { getDealershipById, getDealershipListings } from '@/lib/dealershipStore';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const dealership = getDealershipById(params.id);
  if (!dealership) {
    return NextResponse.json({ error: 'Dealership not found.' }, { status: 404 });
  }
  const listings = getDealershipListings(params.id);
  return NextResponse.json({ ...dealership, listings });
}

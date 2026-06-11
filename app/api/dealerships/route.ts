import { NextResponse } from 'next/server';
import { getAllDealerships, addDealership } from '@/lib/dealershipStore';

export async function GET() {
  const dealerships = getAllDealerships();
  return NextResponse.json(dealerships);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, address, city, contactPhone, contactEmail, brands, description, ownerPassword } = body;

    if (!name || !address || !city || !contactPhone || !ownerPassword) {
      return NextResponse.json(
        { error: 'Name, address, city, phone, and password are required.' },
        { status: 400 }
      );
    }

    const dealership = addDealership({
      name,
      address,
      city,
      contactPhone,
      contactEmail: contactEmail || '',
      brands: brands || [],
      description: description || '',
      ownerPassword,
    });

    return NextResponse.json(dealership, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}

import { NextResponse } from 'next/server';
import {
  getDealershipListings,
  addListing,
  verifyOwnerPassword,
} from '@/lib/dealershipStore';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const listings = getDealershipListings(params.id);
  return NextResponse.json(listings);
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { token, ...listingData } = body;

    if (!token) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [id, password] = decoded.split(':');

    if (id !== params.id || !verifyOwnerPassword(params.id, password)) {
      return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 401 });
    }

    const { make, model, year, price, mileage, condition, fuelType, transmission } =
      listingData;

    if (!make || !model || !year || !price || !mileage || !condition || !fuelType || !transmission) {
      return NextResponse.json(
        { error: 'Make, model, year, price, mileage, condition, fuel type, and transmission are required.' },
        { status: 400 }
      );
    }

    const listing = addListing(params.id, {
      make,
      model,
      year,
      price,
      mileage,
      condition,
      fuelType,
      transmission,
      images: listingData.images || [],
      description: listingData.description || '',
    });

    if (!listing) {
      return NextResponse.json({ error: 'Dealership not found.' }, { status: 404 });
    }

    return NextResponse.json(listing, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}

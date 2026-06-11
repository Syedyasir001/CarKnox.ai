import { NextResponse } from 'next/server';
import {
  updateListing,
  deleteListing,
  verifyOwnerPassword,
} from '@/lib/dealershipStore';

export async function PUT(
  request: Request,
  { params }: { params: { id: string; listingId: string } }
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

    const updated = updateListing(params.id, params.listingId, listingData);
    if (!updated) {
      return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; listingId: string } }
) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [id, password] = decoded.split(':');

    if (id !== params.id || !verifyOwnerPassword(params.id, password)) {
      return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 401 });
    }

    const deleted = deleteListing(params.id, params.listingId);
    if (!deleted) {
      return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}

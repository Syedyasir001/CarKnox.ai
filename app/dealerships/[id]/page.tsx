'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CarCard from '@/components/CarCard';
import { Dealership, CarListing } from '@/lib/dealershipTypes';

export default function DealershipDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [dealership, setDealership] = useState<(Omit<Dealership, 'ownerPassword'> & { listingCount: number }) | null>(null);
  const [listings, setListings] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/dealerships/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Dealership not found');
        return res.json();
      })
      .then((data) => {
        setDealership(data);
        setListings(data.listings || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <section className="pt-28 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="shimmer h-8 w-64 rounded mb-6" />
          <div className="shimmer h-4 w-96 rounded mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#131d35] border border-[#0f1629] rounded-2xl p-6">
                <div className="shimmer h-32 rounded-xl mb-4" />
                <div className="shimmer h-5 w-3/4 rounded mb-2" />
                <div className="shimmer h-4 w-1/2 rounded mb-3" />
                <div className="shimmer h-3 w-full rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !dealership) {
    return (
      <section className="pt-28 pb-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-rose-400 text-lg mb-4">{error || 'Dealership not found.'}</p>
          <Link
            href="/dealerships"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-[#0a0f1e] bg-white hover:bg-slate-100 rounded-full transition-all hover:scale-105 active:scale-95 touch-target"
          >
            &larr; Back to Directory
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="relative pt-28 pb-12 dot-grid">
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              href="/dealerships"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Directory
            </Link>

            <div className="bg-[#131d35] border border-[#0f1629] rounded-2xl p-6 md:p-8 mb-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="font-bebas text-3xl md:text-4xl text-white">
                      {dealership.name}
                    </h1>
                    {dealership.verified && (
                      <span className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 max-w-2xl">{dealership.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="p-3 bg-[#0f1629] rounded-xl border border-[#1e2d4f]">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Location</p>
                  <p className="text-sm text-white">{dealership.address}, {dealership.city}</p>
                </div>
                <div className="p-3 bg-[#0f1629] rounded-xl border border-[#1e2d4f]">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Phone</p>
                  <p className="text-sm text-white">{dealership.contactPhone}</p>
                </div>
                <div className="p-3 bg-[#0f1629] rounded-xl border border-[#1e2d4f]">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Email</p>
                  <p className="text-sm text-white break-all">{dealership.contactEmail}</p>
                </div>
                <div className="p-3 bg-[#0f1629] rounded-xl border border-[#1e2d4f]">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Listings</p>
                  <p className="text-sm text-white">{dealership.listingCount} cars available</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Brands Handled</p>
                <div className="flex flex-wrap gap-2">
                  {dealership.brands.map((brand) => (
                    <span
                      key={brand}
                      className="px-3 py-1.5 text-xs font-medium bg-blue-400/10 text-blue-400 border border-blue-400/20 rounded-full"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bebas text-2xl text-white">
                AVAILABLE CARS
              </h2>
              <span className="text-sm text-slate-400">
                {listings.length} {listings.length === 1 ? 'listing' : 'listings'}
              </span>
            </div>

            {listings.length === 0 ? (
              <div className="text-center py-16 bg-[#131d35] border border-[#0f1629] rounded-2xl">
                <p className="text-slate-500">No cars currently listed.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <CarCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}



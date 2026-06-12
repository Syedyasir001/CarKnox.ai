'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import DealershipCard from '@/components/DealershipCard';
import TopDealershipsBanner from '@/components/TopDealershipsBanner';
import { DealershipPublic } from '@/lib/dealershipTypes';

export default function DealershipsPage() {
  const [dealerships, setDealerships] = useState<DealershipPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  useEffect(() => {
    fetch('/api/dealerships')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load dealerships');
        return res.json();
      })
      .then((data) => {
        setDealerships(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const cities = useMemo(
    () => Array.from(new Set(dealerships.map((d) => d.city))).sort(),
    [dealerships]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return dealerships.filter((d) => {
      if (q && !d.name.toLowerCase().includes(q) && !d.city.toLowerCase().includes(q) && !d.brands.some((b) => b.toLowerCase().includes(q))) {
        return false;
      }
      if (cityFilter && d.city !== cityFilter) return false;
      return true;
    });
  }, [dealerships, search, cityFilter]);

  return (
    <>
      <section className="relative pt-28 pb-12 dot-grid">
        <div className="absolute inset-0 bg-blue-400/5 blur-[100px] rounded-full w-96 h-96 top-20 left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <span className="uppercase tracking-[0.2em] text-blue-400 text-sm font-semibold">
              Find Your Trusted Dealer
            </span>
            <h1 className="font-bebas text-4xl md:text-5xl text-white mt-2 mb-3">
              DEALERSHIP DIRECTORY
            </h1>
            <p className="text-slate-400 max-w-xl mx-auto">
              Browse registered dealerships, compare listings, and find your next car from trusted sellers across India.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, city, or brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0f1629] border border-[#1e2d4f] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400 transition-colors pl-10 pr-4 py-3 text-sm min-h-[44px]"
              />
            </div>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="bg-[#0f1629] border border-[#1e2d4f] rounded-xl text-white focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400 transition-colors px-4 py-3 text-sm min-h-[44px]"
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <Link
              href="/dealerships/register"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-[#0a0f1e] bg-white hover:bg-slate-100 rounded-full transition-all hover:scale-105 active:scale-95 touch-target whitespace-nowrap"
            >
              Register Your Dealership
            </Link>
          </div>
        </div>

        <TopDealershipsBanner />

        <div className="relative max-w-7xl mx-auto px-4">
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#131d35] border border-[#0f1629] rounded-2xl p-6">
                  <div className="shimmer h-5 w-3/4 rounded mb-4" />
                  <div className="shimmer h-3 w-full rounded mb-2" />
                  <div className="shimmer h-3 w-2/3 rounded mb-4" />
                  <div className="shimmer h-4 w-1/2 rounded mb-3" />
                  <div className="shimmer h-3 w-full rounded mb-1" />
                  <div className="shimmer h-3 w-4/5 rounded" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-400/10 border border-rose-400/30 rounded-xl flex items-center gap-3 max-w-2xl mx-auto">
              <span className="text-rose-400 font-bold">⚠</span>
              <p className="text-rose-400 text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg mb-2">No dealerships found</p>
              <p className="text-slate-600 text-sm">
                Try adjusting your search or filters
              </p>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((d, i) => (
                <DealershipCard key={d.id} dealership={d} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

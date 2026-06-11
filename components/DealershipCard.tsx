'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { DealershipPublic } from '@/lib/dealershipTypes';

export default function DealershipCard({
  dealership,
  index,
}: {
  dealership: DealershipPublic;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        href={`/dealerships/${dealership.id}`}
        className="block bg-[#131d35] border border-[#0f1629] rounded-2xl p-6 hover:border-blue-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-400/5 group h-full"
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
            {dealership.name}
          </h3>
          {dealership.verified && (
            <span className="flex-shrink-0 ml-2 px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
              Verified
            </span>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-slate-400 text-sm flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {dealership.address}, {dealership.city}
          </p>
          <p className="text-slate-400 text-sm flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {dealership.contactPhone}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {dealership.brands.slice(0, 4).map((brand) => (
            <span
              key={brand}
              className="px-2.5 py-1 text-xs bg-blue-400/10 text-blue-400 rounded-full"
            >
              {brand}
            </span>
          ))}
          {dealership.brands.length > 4 && (
            <span className="px-2.5 py-1 text-xs bg-[#0f1629] text-slate-400 rounded-full">
              +{dealership.brands.length - 4}
            </span>
          )}
        </div>

        <p className="text-slate-400 text-sm line-clamp-2 mb-4">
          {dealership.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-[#0f1629]">
          <span className="text-xs text-slate-500">
            {dealership.listingCount} {dealership.listingCount === 1 ? 'car' : 'cars'} listed
          </span>
          <span className="text-sm font-medium text-blue-400 group-hover:translate-x-1 transition-transform">
            View Details &rarr;
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

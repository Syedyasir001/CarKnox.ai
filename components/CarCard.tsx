'use client';

import { motion } from 'framer-motion';
import { CarListing } from '@/lib/dealershipTypes';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

function formatMileage(km: number): string {
  return new Intl.NumberFormat('en-IN').format(km);
}

function getConditionColor(condition: string): string {
  switch (condition) {
    case 'Excellent':
      return 'text-emerald-400';
    case 'Good':
      return 'text-blue-400';
    case 'Fair':
      return 'text-amber-400';
    case 'Poor':
      return 'text-rose-400';
    default:
      return 'text-slate-400';
  }
}

export default function CarCard({
  listing,
  onEdit,
  onDelete,
  isOwner,
}: {
  listing: CarListing;
  onEdit?: (listing: CarListing) => void;
  onDelete?: (id: string) => void;
  isOwner?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#131d35] border border-[#0f1629] rounded-2xl overflow-hidden group hover:border-blue-400/30 transition-colors"
    >
      <div className="h-40 bg-gradient-to-br from-[#1a2540] to-[#0f1629] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-1">🚗</div>
          <p className="text-slate-500 text-xs">
            {listing.make} {listing.model}
          </p>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-white">
            {listing.make} {listing.model}
          </h3>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getConditionColor(listing.condition)} bg-current/10 border border-current/20`}>
            {listing.condition}
          </span>
        </div>

        <p className="text-xl font-bold text-blue-400 mb-3">
          {formatPrice(listing.price)}
        </p>

        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-slate-400 mb-4">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Year:</span>
            <span className="text-slate-300 font-medium">{listing.year}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Fuel:</span>
            <span className="text-slate-300 font-medium">{listing.fuelType}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">KM:</span>
            <span className="text-slate-300 font-medium">{formatMileage(listing.mileage)} km</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Trans.:</span>
            <span className="text-slate-300 font-medium">{listing.transmission}</span>
          </div>
        </div>

        {listing.description && (
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-3">
            {listing.description}
          </p>
        )}

        {isOwner && onEdit && onDelete && (
          <div className="flex items-center gap-2 pt-3 border-t border-[#0f1629]">
            <button
              onClick={() => onEdit(listing)}
              className="flex-1 px-3 py-2 text-xs font-medium bg-blue-400/10 text-blue-400 hover:bg-blue-400/20 border border-blue-400/20 rounded-xl transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(listing.id)}
              className="flex-1 px-3 py-2 text-xs font-medium bg-rose-400/10 text-rose-400 hover:bg-rose-400/20 border border-rose-400/20 rounded-xl transition-colors"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

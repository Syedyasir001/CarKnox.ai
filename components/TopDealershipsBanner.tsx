'use client';

import { useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

interface DealerData {
  name: string;
  city: string;
  initials: string;
  avatarColor: string;
  tier: 'verified' | 'featured';
  rank?: number;
  rating: number;
  reviews: number;
  carsListed: number;
  brands: string[];
}

const dealers: DealerData[] = [
  { name: 'Mumbai Auto Hub', city: 'Mumbai', initials: 'MA', avatarColor: '#4FC3A1', tier: 'verified', rank: 1, rating: 4.8, reviews: 128, carsListed: 342, brands: ['Maruti', 'Hyundai', 'Honda', 'Toyota'] },
  { name: 'Delhi Prime Motors', city: 'Delhi', initials: 'DP', avatarColor: '#a882ff', tier: 'featured', rank: 2, rating: 4.6, reviews: 94, carsListed: 267, brands: ['BMW', 'Mercedes', 'Audi', 'VW'] },
  { name: 'Bangalore Luxury Cars', city: 'Bangalore', initials: 'BL', avatarColor: '#4FC3A1', tier: 'verified', rank: 3, rating: 4.9, reviews: 203, carsListed: 189, brands: ['Jaguar', 'Land Rover', 'BMW', 'Porsche'] },
  { name: 'Pune Auto Point', city: 'Pune', initials: 'PA', avatarColor: '#FFB74D', tier: 'featured', rating: 4.5, reviews: 67, carsListed: 156, brands: ['Tata', 'Mahindra', 'Honda', 'Ford'] },
  { name: 'Chennai Classic Motors', city: 'Chennai', initials: 'CC', avatarColor: '#4FC3A1', tier: 'verified', rating: 4.7, reviews: 156, carsListed: 412, brands: ['Toyota', 'Hyundai', 'Nissan', 'Renault'] },
  { name: 'Hyderabad Car World', city: 'Hyderabad', initials: 'HC', avatarColor: '#a882ff', tier: 'featured', rating: 4.4, reviews: 82, carsListed: 298, brands: ['Kia', 'MG', 'Skoda', 'VW'] },
  { name: 'Ahmedabad Auto Mart', city: 'Ahmedabad', initials: 'AA', avatarColor: '#FF8A65', tier: 'verified', rating: 4.3, reviews: 45, carsListed: 175, brands: ['Maruti', 'Hyundai', 'Tata', 'Mahindra'] },
  { name: 'Kolkata Premium Wheels', city: 'Kolkata', initials: 'KP', avatarColor: '#4FC3A1', tier: 'verified', rating: 4.6, reviews: 103, carsListed: 221, brands: ['Mercedes', 'BMW', 'Audi', 'Jaguar'] },
];

function StarRating({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-sm ${star <= rounded ? 'text-yellow-400' : 'text-[#21262d]'}`}
        >
          ★
        </span>
      ))}
    </span>
  );
}

const tierConfig = {
  verified: {
    label: 'Verified',
    badgeClasses: 'bg-[#4FC3A1]/10 border-[#4FC3A1]/30 text-[#4FC3A1]',
    borderTop: 'border-t-[#4FC3A1]',
  },
  featured: {
    label: 'Featured',
    badgeClasses: 'bg-[#a882ff]/10 border-[#a882ff]/30 text-[#a882ff]',
    borderTop: 'border-t-[#a882ff]',
  },
} as const;

const scrollTransition = {
  duration: 18,
  ease: 'linear' as const,
  repeat: Infinity,
  repeatType: 'loop' as const,
};

export default function TopDealershipsBanner() {
  const controls = useAnimationControls();

  useEffect(() => {
    controls.start({ x: '-50%', transition: scrollTransition });
  }, [controls]);

  const handleMouseEnter = () => {
    controls.stop();
  };

  const handleMouseLeave = () => {
    controls.start({ x: '-50%', transition: scrollTransition });
  };

  const doubled = [...dealers, ...dealers];

  return (
    <section className="bg-[#0d1117] py-[60px] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="text-center">
          <span className="uppercase tracking-[0.2em] text-[#4FC3A1] text-sm font-semibold">
            Top Dealerships
          </span>
          <h2 className="font-bebas text-3xl md:text-4xl text-white mt-2">
            PREMIUM <span className="text-[#4FC3A1]">PARTNERS</span>
          </h2>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0d1117] to-transparent z-[2] pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0d1117] to-transparent z-[2] pointer-events-none" />

        <motion.div
          className="flex gap-5 py-[4px] pb-3"
          style={{ width: 'max-content' }}
          animate={controls}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {doubled.map((d, i) => {
            const tier = tierConfig[d.tier];
            return (
              <div
                key={`${d.name}-${i}`}
                className={`relative flex-shrink-0 w-[320px] bg-[#161b22] border border-[#21262d] rounded-[14px] ${tier.borderTop} border-t-2 hover:bg-[#1c2128] hover:border-[#30363d] transition-all duration-200 px-6 py-[22px]`}
              >
                {d.rank && d.rank <= 3 && (
                  <div
                    className="absolute -top-2 -left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-md z-10"
                    style={{
                      backgroundColor:
                        d.rank === 1 ? '#4FC3A1' : d.rank === 2 ? '#a882ff' : '#FFB74D',
                      color: '#0d1117',
                    }}
                  >
                    #{d.rank}
                  </div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-12 h-12 rounded-[10px] flex items-center justify-center text-white text-base font-bold flex-shrink-0"
                    style={{ backgroundColor: d.avatarColor }}
                  >
                    {d.initials}
                  </div>
                  <span
                    className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full border ${tier.badgeClasses}`}
                  >
                    {tier.label}
                  </span>
                </div>

                <h3 className="text-white font-bold text-[17px] mb-0.5 truncate">{d.name}</h3>
                <p className="text-slate-400 text-xs mb-2.5">{'\uD83D\uDCCD'} {d.city}</p>

                <div className="flex items-center gap-1.5 mb-2.5">
                  <StarRating rating={d.rating} />
                  <span className="text-[#4FC3A1] text-sm font-semibold">{d.rating}</span>
                  <span className="text-slate-500 text-sm">({d.reviews})</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {d.brands.map((b) => (
                    <span
                      key={b}
                      className="px-3 py-1 text-xs bg-[#21262d] text-slate-300 rounded-full"
                    >
                      {b}
                    </span>
                  ))}
                </div>

                <div className="pt-2.5 border-t border-[#21262d] flex items-center justify-between">
                  <span className="text-sm text-slate-500">{d.carsListed} cars listed</span>
                  <span className="text-sm font-medium text-[#4FC3A1] hover:underline cursor-default">
                    View details &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

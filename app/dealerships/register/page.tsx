'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

const inputClass =
  'w-full bg-[#0f1629] border border-[#1e2d4f] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400 transition-colors px-4 py-3 min-h-[44px] text-sm';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    contactPhone: '',
    contactEmail: '',
    brands: '',
    description: '',
    ownerPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/dealerships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          brands: formData.brands
            .split(',')
            .map((b) => b.trim())
            .filter(Boolean),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      const token = btoa(`${data.id}:${formData.ownerPassword}:${Date.now()}`);
      sessionStorage.setItem('dealerToken', token);
      sessionStorage.setItem('dealerId', data.id);

      router.push(`/dealerships/dashboard`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setLoading(false);
    }
  };

  return (
    <section className="relative pt-28 pb-12 dot-grid min-h-screen">
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative max-w-2xl mx-auto px-4">
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

          <div className="text-center mb-8">
            <span className="uppercase tracking-[0.2em] text-blue-400 text-sm font-semibold">
              Get Listed
            </span>
            <h1 className="font-bebas text-4xl md:text-5xl text-white mt-2">
              REGISTER YOUR DEALERSHIP
            </h1>
            <p className="text-slate-400 mt-2">
              List your inventory and reach thousands of car buyers across India.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-rose-400/10 border border-rose-400/30 rounded-xl flex items-center gap-3 mb-6">
              <span className="text-rose-400 font-bold">⚠</span>
              <p className="text-rose-400 text-sm">{error}</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-[#131d35] border border-[#0f1629] rounded-2xl p-6 md:p-8 space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-2">
                  Dealership Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Pioneer Auto Sales"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-slate-400 mb-2">
                  City *
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Mumbai"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-slate-400 mb-2">
                Address *
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                value={formData.address}
                onChange={handleChange}
                className={inputClass}
                placeholder="Full street address"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-slate-400 mb-2">
                  Phone Number *
                </label>
                <input
                  id="contactPhone"
                  name="contactPhone"
                  type="tel"
                  required
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-400 mb-2">
                  Email
                </label>
                <input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="info@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="brands" className="block text-sm font-medium text-slate-400 mb-2">
                Brands Handled
              </label>
              <input
                id="brands"
                name="brands"
                type="text"
                value={formData.brands}
                onChange={handleChange}
                className={inputClass}
                placeholder="Maruti, Hyundai, Honda (comma separated)"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-400 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className={`${inputClass} resize-none`}
                placeholder="Tell buyers about your dealership..."
              />
            </div>

            <div>
              <label htmlFor="ownerPassword" className="block text-sm font-medium text-slate-400 mb-2">
                Dashboard Password *
              </label>
              <input
                id="ownerPassword"
                name="ownerPassword"
                type="password"
                required
                minLength={4}
                value={formData.ownerPassword}
                onChange={handleChange}
                className={inputClass}
                placeholder="Used to access your owner dashboard"
              />
              <p className="text-xs text-slate-500 mt-1">
                You will need this password to manage your listings.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-white text-[#0a0f1e] font-semibold hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-target"
              >
                {loading ? 'Registering...' : 'Register Dealership'}
              </button>
              <Link
                href="/dealerships"
                className="px-6 py-3 rounded-xl text-slate-400 font-medium hover:text-white hover:bg-[#0f1629] transition-colors touch-target"
              >
                Cancel
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

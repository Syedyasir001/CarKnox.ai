'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CarCard from '@/components/CarCard';
import { CarListing } from '@/lib/dealershipTypes';

const inputClass =
  'w-full bg-[#0f1629] border border-[#1e2d4f] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400 transition-colors px-4 py-3 min-h-[44px] text-sm';

export default function DashboardPage() {
  const [dealershipId, setDealershipId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [dealership, setDealership] = useState<{ name: string; city: string } | null>(null);
  const [listings, setListings] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editListing, setEditListing] = useState<CarListing | null>(null);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    condition: 'Good' as CarListing['condition'],
    fuelType: 'Petrol' as CarListing['fuelType'],
    transmission: 'Manual' as CarListing['transmission'],
    description: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const storedToken = sessionStorage.getItem('dealerToken');
    const storedId = sessionStorage.getItem('dealerId');
    if (storedToken && storedId) {
      setToken(storedToken);
      setDealershipId(storedId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchListings = useCallback(async () => {
    if (!dealershipId) return;
    try {
      const res = await fetch(`/api/dealerships/${dealershipId}`);
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setDealership({ name: data.name, city: data.city });
      setListings(data.listings || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [dealershipId]);

  useEffect(() => {
    if (dealershipId) {
      fetchListings();
    }
  }, [dealershipId, fetchListings]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const res = await fetch(`/api/dealerships/${dealershipId}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }

      sessionStorage.setItem('dealerToken', data.token);
      setToken(data.token);
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('dealerToken');
    sessionStorage.removeItem('dealerId');
    setToken(null);
    setDealershipId(null);
    setListings([]);
    setDealership(null);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openAddForm = () => {
    setEditListing(null);
    setFormData({
      make: '',
      model: '',
      year: '',
      price: '',
      mileage: '',
      condition: 'Good',
      fuelType: 'Petrol',
      transmission: 'Manual',
      description: '',
    });
    setFormError(null);
    setShowForm(true);
  };

  const openEditForm = (listing: CarListing) => {
    setEditListing(listing);
    setFormData({
      make: listing.make,
      model: listing.model,
      year: listing.year.toString(),
      price: listing.price.toString(),
      mileage: listing.mileage.toString(),
      condition: listing.condition,
      fuelType: listing.fuelType,
      transmission: listing.transmission,
      description: listing.description,
    });
    setFormError(null);
    setShowForm(true);
  };

  const handleDelete = async (listingId: string) => {
    if (!confirm('Remove this listing?')) return;

    try {
      const res = await fetch(`/api/dealerships/${dealershipId}/listings/${listingId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Delete failed.');
      }

      setListings((prev) => prev.filter((l) => l.id !== listingId));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete listing.');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);

    const body = {
      token,
      make: formData.make,
      model: formData.model,
      year: parseInt(formData.year),
      price: parseInt(formData.price),
      mileage: parseInt(formData.mileage),
      condition: formData.condition,
      fuelType: formData.fuelType,
      transmission: formData.transmission,
      description: formData.description,
    };

    try {
      if (editListing) {
        const res = await fetch(
          `/api/dealerships/${dealershipId}/listings/${editListing.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          }
        );

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Update failed.');
        }

        const updated = await res.json();
        setListings((prev) =>
          prev.map((l) => (l.id === editListing.id ? updated : l))
        );
      } else {
        const res = await fetch(`/api/dealerships/${dealershipId}/listings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Add failed.');
        }

        const created = await res.json();
        setListings((prev) => [created, ...prev]);
      }

      setShowForm(false);
      setEditListing(null);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setFormLoading(false);
    }
  };

  if (!dealershipId) {
    return (
      <section className="relative pt-28 pb-12 dot-grid min-h-screen">
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-md mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-bebas text-4xl text-white mb-2">OWNER DASHBOARD</h1>
            <p className="text-slate-400 text-sm">
              First, register your dealership or enter your dealership ID to get started.
            </p>
          </motion.div>

          <div className="bg-[#131d35] border border-[#0f1629] rounded-2xl p-6">
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label htmlFor="dashboard-dealer-id" className="block text-sm font-medium text-slate-400 mb-2">
                  Dealership ID
                </label>
                <input
                  id="dashboard-dealer-id"
                  type="text"
                  value={dealershipId || ''}
                  onChange={(e) => setDealershipId(e.target.value)}
                  className={inputClass}
                  placeholder="Your dealership ID"
                  required
                />
              </div>
              <div>
                <label htmlFor="dashboard-password" className="block text-sm font-medium text-slate-400 mb-2">
                  Password
                </label>
                <input
                  id="dashboard-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Your dashboard password"
                  required
                />
              </div>

              {authError && (
                <p className="text-rose-400 text-sm">{authError}</p>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full px-6 py-3 rounded-xl bg-white text-[#0a0f1e] font-semibold hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-target"
              >
                {authLoading ? 'Verifying...' : 'Access Dashboard'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-[#0f1629] text-center">
              <p className="text-slate-500 text-sm mb-3">Don&apos;t have a dealership yet?</p>
              <Link
                href="/dealerships/register"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-blue-400 hover:text-blue-300 bg-blue-400/10 hover:bg-blue-400/20 border border-blue-400/20 rounded-xl transition-colors touch-target"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="pt-28 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="shimmer h-8 w-48 rounded mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#131d35] border border-[#0f1629] rounded-2xl p-6">
                <div className="shimmer h-32 rounded-xl mb-4" />
                <div className="shimmer h-5 w-3/4 rounded mb-2" />
                <div className="shimmer h-4 w-1/2 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative pt-28 pb-12 dot-grid min-h-screen">
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-bebas text-3xl md:text-4xl text-white">
                YOUR DASHBOARD
              </h1>
              {dealership && (
                <p className="text-slate-400 text-sm mt-1">
                  {dealership.name} &middot; {dealership.city}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={openAddForm}
                className="px-6 py-2.5 rounded-xl bg-white text-[#0a0f1e] font-semibold hover:bg-slate-100 transition-colors text-sm touch-target"
              >
                + Add Car
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl text-slate-400 font-medium hover:text-white hover:bg-[#0f1629] transition-colors text-sm touch-target"
              >
                Logout
              </button>
            </div>
          </div>

          {showForm && (
            <div className="bg-[#131d35] border border-[#0f1629] rounded-2xl p-6 md:p-8 mb-8">
              <h2 className="font-bebas text-2xl text-white mb-5">
                {editListing ? 'EDIT LISTING' : 'ADD NEW LISTING'}
              </h2>

              {formError && (
                <div className="p-3 bg-rose-400/10 border border-rose-400/30 rounded-xl mb-4">
                  <p className="text-rose-400 text-sm">{formError}</p>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Make *</label>
                    <input name="make" value={formData.make} onChange={handleFormChange} className={inputClass} placeholder="e.g. Maruti Suzuki" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Model *</label>
                    <input name="model" value={formData.model} onChange={handleFormChange} className={inputClass} placeholder="e.g. Swift" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Year *</label>
                    <input name="year" type="number" value={formData.year} onChange={handleFormChange} className={inputClass} placeholder="2020" required min={1990} max={2030} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Price (₹) *</label>
                    <input name="price" type="number" value={formData.price} onChange={handleFormChange} className={inputClass} placeholder="500000" required min={0} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Mileage (km) *</label>
                    <input name="mileage" type="number" value={formData.mileage} onChange={handleFormChange} className={inputClass} placeholder="30000" required min={0} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Condition *</label>
                    <select name="condition" value={formData.condition} onChange={handleFormChange} className={inputClass}>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Fuel Type *</label>
                    <select name="fuelType" value={formData.fuelType} onChange={handleFormChange} className={inputClass}>
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="CNG">CNG</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Transmission *</label>
                    <select name="transmission" value={formData.transmission} onChange={handleFormChange} className={inputClass}>
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
                  <textarea name="description" rows={2} value={formData.description} onChange={handleFormChange} className={`${inputClass} resize-none`} placeholder="Brief description of the vehicle..." />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-6 py-2.5 rounded-xl bg-white text-[#0a0f1e] font-semibold hover:bg-slate-100 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed touch-target"
                  >
                    {formLoading ? 'Saving...' : editListing ? 'Update Listing' : 'Add Listing'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setEditListing(null); }}
                    className="px-4 py-2.5 rounded-xl text-slate-400 font-medium hover:text-white hover:bg-[#0f1629] transition-colors text-sm touch-target"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {listings.length === 0 ? (
            <div className="text-center py-20 bg-[#131d35] border border-[#0f1629] rounded-2xl">
              <p className="text-slate-500 text-lg mb-2">No cars listed yet</p>
              <p className="text-slate-600 text-sm mb-6">Add your first car listing to get started.</p>
              <button
                onClick={openAddForm}
                className="px-6 py-3 rounded-xl bg-white text-[#0a0f1e] font-semibold hover:bg-slate-100 transition-colors touch-target"
              >
                + Add Your First Car
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-400">
                  {listings.length} {listings.length === 1 ? 'listing' : 'listings'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <CarCard
                    key={listing.id}
                    listing={listing}
                    onEdit={openEditForm}
                    onDelete={handleDelete}
                    isOwner
                  />
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}

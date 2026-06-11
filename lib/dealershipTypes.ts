export interface CarListing {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic';
  images: string[];
  description: string;
  createdAt: string;
}

export interface Dealership {
  id: string;
  name: string;
  address: string;
  city: string;
  contactPhone: string;
  contactEmail: string;
  brands: string[];
  description: string;
  verified: boolean;
  ownerPassword: string;
  createdAt: string;
  listings: CarListing[];
}

export interface DealershipPublic
  extends Omit<Dealership, 'ownerPassword' | 'listings'> {
  listingCount: number;
}

export type CreateDealershipData = Omit<
  Dealership,
  'id' | 'verified' | 'createdAt' | 'listings'
>;

export type CreateListingData = Omit<CarListing, 'id' | 'createdAt'>;

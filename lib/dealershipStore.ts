import {
  Dealership,
  DealershipPublic,
  CarListing,
  CreateDealershipData,
  CreateListingData,
} from './dealershipTypes';

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

const globalForStore = globalThis as typeof globalThis & {
  _dealershipStore?: Dealership[];
};

const seedDealerships: Dealership[] = [
  {
    id: 'pioneer-auto-sales',
    name: 'Pioneer Auto Sales',
    address: '42 Linking Road, Bandra West',
    city: 'Mumbai',
    contactPhone: '1234567890',
    contactEmail: 'info@pioneerauto.in',
    brands: ['Maruti Suzuki', 'Hyundai', 'Honda'],
    description:
      'One of Mumbai\'s most trusted pre-owned car dealers since 2012. We offer certified pre-owned vehicles with comprehensive warranty packages and RTO assistance.',
    verified: true,
    ownerPassword: 'pioneer123',
    createdAt: '2024-01-15T10:00:00Z',
    listings: [
      {
        id: 'pio-swift-01',
        make: 'Maruti Suzuki',
        model: 'Swift VXi',
        year: 2020,
        price: 520000,
        mileage: 45000,
        condition: 'Good',
        fuelType: 'Petrol',
        transmission: 'Manual',
        images: [],
        description:
          'Well-maintained Maruti Suzuki Swift VXi. Single owner, regular service history. Fuel efficient and perfect for city commutes.',
        createdAt: '2024-06-10T09:00:00Z',
      },
      {
        id: 'pio-i20-01',
        make: 'Hyundai',
        model: 'i20 Sportz',
        year: 2021,
        price: 780000,
        mileage: 28000,
        condition: 'Excellent',
        fuelType: 'Petrol',
        transmission: 'Manual',
        images: [],
        description:
          'Like-new Hyundai i20 Sportz with premium trim. Alloy wheels, touchscreen infotainment, and reverse camera. Driven carefully by a single lady owner.',
        createdAt: '2024-07-05T11:00:00Z',
      },
      {
        id: 'pio-city-01',
        make: 'Honda',
        model: 'City ZX',
        year: 2019,
        price: 850000,
        mileage: 52000,
        condition: 'Good',
        fuelType: 'Petrol',
        transmission: 'Manual',
        images: [],
        description:
          'Honda City ZX in prime condition. Spacious interior, legendary i-VTEC engine, and low maintenance costs. Perfect family sedan.',
        createdAt: '2024-05-20T14:00:00Z',
      },
    ],
  },
  {
    id: 'royal-motors',
    name: 'Royal Motors',
    address: '15 Connaught Place',
    city: 'Delhi',
    contactPhone: '1234567890',
    contactEmail: 'sales@royalmotors.in',
    brands: ['BMW', 'Mercedes-Benz', 'Audi'],
    description:
      'Premium luxury pre-owned car dealership in the heart of Delhi. Every vehicle undergoes a rigorous 120-point inspection. We provide extended warranty on all our premium vehicles.',
    verified: true,
    ownerPassword: 'royal456',
    createdAt: '2023-11-01T08:00:00Z',
    listings: [
      {
        id: 'royal-bmw-01',
        make: 'BMW',
        model: '3 Series 320d',
        year: 2022,
        price: 3800000,
        mileage: 18000,
        condition: 'Excellent',
        fuelType: 'Diesel',
        transmission: 'Automatic',
        images: [],
        description:
          'BMW 320d Luxury Line with M Sport package. Driven sparingly, full service history from authorized BMW dealership. Still under manufacturer warranty.',
        createdAt: '2024-08-01T10:00:00Z',
      },
      {
        id: 'royal-benz-01',
        make: 'Mercedes-Benz',
        model: 'C-Class 200',
        year: 2021,
        price: 3550000,
        mileage: 24000,
        condition: 'Good',
        fuelType: 'Petrol',
        transmission: 'Automatic',
        images: [],
        description:
          'Mercedes-Benz C 200 Avantgarde with AMG Line package. Premium sound system, sunroof, and memory seats. Excellent condition throughout.',
        createdAt: '2024-07-15T12:00:00Z',
      },
      {
        id: 'royal-audi-01',
        make: 'Audi',
        model: 'Q3 35 TDI',
        year: 2023,
        price: 3200000,
        mileage: 12000,
        condition: 'Excellent',
        fuelType: 'Diesel',
        transmission: 'Automatic',
        images: [],
        description:
          'Audi Q3 35 TDI Technology variant. Virtual cockpit, panoramic sunroof, and Matrix LED headlamps. Low mileage example with comprehensive service records.',
        createdAt: '2024-09-10T09:00:00Z',
      },
    ],
  },
  {
    id: 'city-wheels',
    name: 'City Wheels',
    address: '88 MG Road, Indiranagar',
    city: 'Bangalore',
    contactPhone: '1234567890',
    contactEmail: 'hello@citywheels.in',
    brands: ['Hyundai', 'Kia', 'Tata'],
    description:
      'Bangalore-based car dealership offering quality used cars at competitive prices. We assist with loan processing, insurance, and Bangalore RTO registration.',
    verified: false,
    ownerPassword: 'city789',
    createdAt: '2024-03-20T10:00:00Z',
    listings: [
      {
        id: 'city-seltos-01',
        make: 'Kia',
        model: 'Seltos HTX',
        year: 2022,
        price: 1450000,
        mileage: 22000,
        condition: 'Good',
        fuelType: 'Diesel',
        transmission: 'Manual',
        images: [],
        description:
          'Kia Seltos HTX 1.5 CRDi. Feature-rich SUV with ventilated seats, sunroof, and Bose sound system. Well maintained with service history.',
        createdAt: '2024-08-20T11:00:00Z',
      },
      {
        id: 'city-creta-01',
        make: 'Hyundai',
        model: 'Creta SX',
        year: 2021,
        price: 1380000,
        mileage: 35000,
        condition: 'Good',
        fuelType: 'Diesel',
        transmission: 'Automatic',
        images: [],
        description:
          'Hyundai Creta SX 1.5 Diesel Automatic. Easy to drive in Bangalore traffic. Touchscreen, sunroof, and keyless entry. Second owner vehicle.',
        createdAt: '2024-06-15T14:00:00Z',
      },
    ],
  },
  {
    id: 'highway-carriage',
    name: 'Highway Carriage',
    address: '55 FC Road, Shivajinagar',
    city: 'Pune',
    contactPhone: '1234567890',
    contactEmail: 'info@highwaycarriage.com',
    brands: ['Mahindra', 'Toyota', 'Honda'],
    description:
      'Pune\'s premier dealership for SUVs and family cars. Specializing in Mahindra, Toyota, and Honda vehicles. We offer test drives and buyback guarantees.',
    verified: true,
    ownerPassword: 'highway000',
    createdAt: '2023-09-10T09:00:00Z',
    listings: [
      {
        id: 'highway-xuv-01',
        make: 'Mahindra',
        model: 'XUV700 AX7',
        year: 2021,
        price: 1850000,
        mileage: 20000,
        condition: 'Excellent',
        fuelType: 'Diesel',
        transmission: 'Automatic',
        images: [],
        description:
          'Mahindra XUV700 AX7 Diesel Automatic with 7 seats. Top variant with ADAS, panoramic sunroof, and dual screens. Single owner car.',
        createdAt: '2024-09-01T10:00:00Z',
      },
      {
        id: 'highway-fortuner-01',
        make: 'Toyota',
        model: 'Fortuner 4x4',
        year: 2020,
        price: 3200000,
        mileage: 40000,
        condition: 'Good',
        fuelType: 'Diesel',
        transmission: 'Automatic',
        images: [],
        description:
          'Toyota Fortuner 4x4 AT Diesel. Legendary reliability and off-road capability. Well maintained with authorized Toyota service records.',
        createdAt: '2024-04-20T11:00:00Z',
      },
      {
        id: 'highway-crv-01',
        make: 'Honda',
        model: 'CR-V V',
        year: 2022,
        price: 2800000,
        mileage: 15000,
        condition: 'Excellent',
        fuelType: 'Petrol',
        transmission: 'Automatic',
        images: [],
        description:
          'Honda CR-V V CVT petrol. Spacious, refined, and loaded with safety features. Low running example in pristine condition.',
        createdAt: '2024-07-10T13:00:00Z',
      },
    ],
  },
];

function getStore(): Dealership[] {
  if (!globalForStore._dealershipStore) {
    globalForStore._dealershipStore = seedDealerships.map((d) => ({
      ...d,
      listings: d.listings.map((l) => ({ ...l })),
    }));
  }
  return globalForStore._dealershipStore;
}

export function getAllDealerships(): DealershipPublic[] {
  return getStore().map((d) => ({
    id: d.id,
    name: d.name,
    address: d.address,
    city: d.city,
    contactPhone: d.contactPhone,
    contactEmail: d.contactEmail,
    brands: d.brands,
    description: d.description,
    verified: d.verified,
    createdAt: d.createdAt,
    listingCount: d.listings.length,
  }));
}

export function getDealershipById(
  id: string
): (Omit<Dealership, 'ownerPassword'> & { listingCount: number }) | undefined {
  const d = getStore().find((d) => d.id === id);
  if (!d) return undefined;
  return {
    id: d.id,
    name: d.name,
    address: d.address,
    city: d.city,
    contactPhone: d.contactPhone,
    contactEmail: d.contactEmail,
    brands: d.brands,
    description: d.description,
    verified: d.verified,
    createdAt: d.createdAt,
    listings: d.listings,
    listingCount: d.listings.length,
  };
}

export function getDealershipListings(id: string): CarListing[] {
  const d = getStore().find((d) => d.id === id);
  return d ? [...d.listings] : [];
}

export function verifyOwnerPassword(
  id: string,
  password: string
): boolean {
  const d = getStore().find((d) => d.id === id);
  return d ? d.ownerPassword === password : false;
}

export function addDealership(
  data: CreateDealershipData
): Dealership {
  const dealership: Dealership = {
    ...data,
    id: generateId(),
    verified: false,
    createdAt: new Date().toISOString(),
    listings: [],
  };
  getStore().push(dealership);
  return dealership;
}

export function addListing(
  dealershipId: string,
  data: CreateListingData
): CarListing | null {
  const d = getStore().find((d) => d.id === dealershipId);
  if (!d) return null;
  const listing: CarListing = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  d.listings.push(listing);
  return listing;
}

export function updateListing(
  dealershipId: string,
  listingId: string,
  data: Partial<CreateListingData>
): CarListing | null {
  const d = getStore().find((d) => d.id === dealershipId);
  if (!d) return null;
  const idx = d.listings.findIndex((l) => l.id === listingId);
  if (idx === -1) return null;
  d.listings[idx] = { ...d.listings[idx], ...data };
  return d.listings[idx];
}

export function deleteListing(
  dealershipId: string,
  listingId: string
): boolean {
  const d = getStore().find((d) => d.id === dealershipId);
  if (!d) return false;
  const idx = d.listings.findIndex((l) => l.id === listingId);
  if (idx === -1) return false;
  d.listings.splice(idx, 1);
  return true;
}

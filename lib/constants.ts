export const SUPPORTED_SITES = [
  // Major classifieds & dealers
  'olx.in', 'olx.com',
  'cars24.com',
  'spinny.com',
  'carwale.com',
  'cardekho.com',
  'gaadi.com',
  // Dealership & manufacturer platforms
  'marutisuzuki.com',
  'hyundai.com',
  'toyotabharat.com',
  'hondacarindia.com',
  'tatamotors.com',
  'mahindra.com',
  'kia.com',
  'mgmotor.co.in',
  'renault.co.in',
  'nissan.in',
  'volkswagen.co.in',
  'skoda.co.in',
  'ford.co.in',
  'bmw.in',
  'mercedes-benz.co.in',
  'audi.co.in',
  'jeep-india.com',
  'volvo.co.in',
  'lexus.co.in',
  'isuzu.co.in',
  'forcemotors.co.in',
  'datsun.co.in',
  // Regional & niche platforms
  'carinfo.app',
  'carandbike.com',
  'bikesdaten.in',
  'droom.in',
  'zigwheels.com',
  'autocarindia.co.in',
  'overdrive.co.in',
  'gaadiwaadi.com',
  'dermahyundai.co.in',
  'drivezy.com',
  'mycars.in',
  'carplus.in',
  'carvest.in',
  'carget.in',
  'carsearch.co.in',
  'usedcars.com',
  'autoportal.com',
  'carzbike.com',
  'bikewale.com',
  // Quick-sell & auction platforms
  'cars4sale.in',
  'sellmycar.co.in',
  'carauction.co.in',
  'marutiassurance.com',
  'truevalue.carwale.com',
  // City-specific & regional
  'chennaicars.com',
  'bangaloreusedcars.com',
  'mumbaicars.co.in',
  'delhicars.co.in',
  'hyderabadcars.co.in',
  'punecars.co.in',
  'kolkatacars.co.in',
  // International platforms with India listings
  'facebook.com/marketplace',
  'marketplace.facebook.com',
  'instagram.com',
  'quikr.com',
];

export const SUPPORTED_SITES_DISPLAY = Array.from(
  new Set(
    SUPPORTED_SITES.map(site => 
      site
        .replace(/^www\./, '')
        .replace(/\.(com|in|co\.in|app)$/, '')
        .split('.')[0]
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    )
  )
).sort();

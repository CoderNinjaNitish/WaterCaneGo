export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const generateMockLocation = (): { lat: number; lng: number; address: string } => {
  // Generate random location within a city area
  const baseLat = 12.9716;
  const baseLng = 77.5946;
  const randomLat = baseLat + (Math.random() - 0.5) * 0.1;
  const randomLng = baseLng + (Math.random() - 0.5) * 0.1;
  
  const addresses = [
    'Koramangala, Bangalore',
    'Indiranagar, Bangalore',
    'Whitefield, Bangalore',
    'HSR Layout, Bangalore',
    'Marathahalli, Bangalore',
    'Electronic City, Bangalore',
    'JP Nagar, Bangalore',
    'BTM Layout, Bangalore'
  ];
  
  return {
    lat: randomLat,
    lng: randomLng,
    address: addresses[Math.floor(Math.random() * addresses.length)]
  };
};
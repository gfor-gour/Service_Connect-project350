import Geocoder from 'nominatim-geocoder';

const geocoder = new Geocoder();

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Get geographic coordinates (latitude, longitude) from an address.
 * @param address - The address to geocode.
 * @returns {Promise<Coordinates | null>} - The coordinates or null if not found.
 */
export async function getCoordinates(address: string): Promise<Coordinates | null> {
  try {
    const results = await geocoder.search({ q: address });
    if (results && results.length > 0) {
      return {
        latitude: parseFloat(results[0].lat),
        longitude: parseFloat(results[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

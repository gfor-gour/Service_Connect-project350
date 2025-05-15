declare module 'nominatim-geocoder' {
    interface GeocoderResult {
      lat: string;
      lon: string;
      display_name?: string;
      boundingbox?: [string, string, string, string];
      [key: string]: unknown;
    }
  
    interface SearchOptions {
      q: string;
      format?: 'json';
      limit?: number;
      addressdetails?: boolean;
      countrycodes?: string;
      [key: string]: unknown;
    }
  
    class Geocoder {
      constructor();
      search(options: SearchOptions): Promise<GeocoderResult[]>;
    }
  
    export default Geocoder;
  }
  
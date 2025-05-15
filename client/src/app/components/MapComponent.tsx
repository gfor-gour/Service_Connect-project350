'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getCoordinates } from '../utils/geolocation';

// Dynamically import react-leaflet components with SSR disabled
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon URLs
const markerIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface MapProps {
  address: string;
}

const MapComponent = ({ address }: MapProps) => {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      setLoading(true);
      setError(null);
      try {
        const coords = await getCoordinates(address);
        if (coords) {
          setCoordinates({ lat: coords.latitude, lng: coords.longitude });
        } else {
          setError('Could not find coordinates for this address.');
        }
      } catch (err) {
        setError('Error fetching coordinates.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      fetchCoordinates();
    }
  }, [address]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading map...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!coordinates) {
    return <p className="text-center text-gray-500">No coordinates to display.</p>;
  }

  return (
    <div className="w-full h-64">
      <MapContainer center={coordinates} zoom={15} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={coordinates} icon={markerIcon}>
          <Popup>{address}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;

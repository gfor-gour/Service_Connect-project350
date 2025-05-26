"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { getCoordinates } from "../utils/geolocation"

// Dynamically import react-leaflet components with SSR disabled
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix default marker icon URLs
const markerIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

interface MapProps {
  address: string
}

const MapComponent = ({ address }: MapProps) => {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!address || address.trim() === "") {
        setError("No address provided")
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        console.log("Fetching coordinates for:", address)
        const coords = await getCoordinates(address)

        if (coords) {
          console.log("Coordinates received:", coords)
          setCoordinates({ lat: coords.latitude, lng: coords.longitude })
        } else {
          setError(`Could not find location for "${address}". Please check the address and try again.`)
        }
      } catch (err) {
        console.error("Error in fetchCoordinates:", err)
        setError(`Failed to load map for "${address}". Please try again later.`)
      } finally {
        setLoading(false)
      }
    }

    fetchCoordinates()
  }, [address])

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-500"></div>
          <p className="text-gray-500">Loading map for {address}...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center bg-red-50 rounded-lg border border-red-200 p-4">
        <div className="text-red-500 text-center">
          <p className="font-medium mb-2">Unable toload map</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!coordinates) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">No location data available</p>
      </div>
    )
  }

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-200">
      <MapContainer center={coordinates} zoom={15} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={coordinates} icon={markerIcon}>
          <Popup>{address}</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default MapComponent

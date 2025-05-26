interface Coordinates {
  latitude: number
  longitude: number
}

export async function getCoordinates(address: string): Promise<Coordinates | null> {
  if (!address || address.trim() === "") {
    console.warn("Empty address provided to getCoordinates")
    return null
  }

  try {
    console.log("Requesting coordinates for:", address)

    const response = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("Geocode API response status:", response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
      console.error("Geocode API error:", response.status, errorData)
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }

    const data = await response.json()
    console.log("Geocode API response data:", data)

    if (data.error) {
      throw new Error(data.error)
    }

    if (typeof data.latitude !== "number" || typeof data.longitude !== "number") {
      throw new Error("Invalid coordinates received from API")
    }

    return {
      latitude: data.latitude,
      longitude: data.longitude,
    }
  } catch (error) {
    console.error("Error getting coordinates:", error)
    return null
  }
}

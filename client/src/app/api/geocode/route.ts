import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get("address")

  if (!address) {
    return NextResponse.json({ error: "Address parameter is required" }, { status: 400 })
  }

  try {
    console.log("Geocoding request for address:", address)

    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`
    console.log("Nominatim URL:", nominatimUrl)

    const response = await fetch(nominatimUrl, {
      headers: {
        "User-Agent": "LocalServiceApp/1.0 (contact@example.com)",
        Accept: "application/json",
        "Accept-Language": "en-US,en;q=0.9",
      },
      // Add timeout
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    console.log("Nominatim response status:", response.status)

    if (!response.ok) {
      console.error("Nominatim API error:", response.status, response.statusText)
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`Nominatim API returned ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Nominatim response data:", data)

    if (!Array.isArray(data) || data.length === 0) {
      console.log("No results found for address:", address)
      return NextResponse.json({ error: "No results found for this address" }, { status: 404 })
    }

    const result = data[0]

    if (!result.lat || !result.lon) {
      console.error("Invalid result format:", result)
      return NextResponse.json({ error: "Invalid geocoding result" }, { status: 500 })
    }

    const coordinates = {
      latitude: Number.parseFloat(result.lat),
      longitude: Number.parseFloat(result.lon),
      display_name: result.display_name,
    }

    console.log("Returning coordinates:", coordinates)
    return NextResponse.json(coordinates)
  } catch (error) {
    console.error("Geocoding error:", error)

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return NextResponse.json({ error: "Request timeout - geocoding service is slow" }, { status: 408 })
      }
      if (error.message.includes("fetch")) {
        return NextResponse.json({ error: "Network error - unable to reach geocoding service" }, { status: 503 })
      }
    }

    return NextResponse.json(
      {
        error: "Failed to geocode address",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

"use client"

import { useEffect, useRef, useState } from "react"
import { Wrapper, Status } from "@googlemaps/react-wrapper"
import { FiMapPin, FiLayers, FiMap } from "react-icons/fi"
import { MdSatellite, MdTerrain } from "react-icons/md"

// Map Component
function MapComponent({ center, zoom, marker, mapType }) {
  const ref = useRef(null)
  const [map, setMap] = useState(null)
  const [advancedMarker, setAdvancedMarker] = useState(null)
  const [markerLibrary, setMarkerLibrary] = useState(null)

  // Load marker library
  useEffect(() => {
    const loadMarkerLibrary = async () => {
      try {
        const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker")
        setMarkerLibrary({ AdvancedMarkerElement })
      } catch (err) {
        console.error("Error loading marker library:", err)
      }
    }
    
    if (window.google?.maps) {
      loadMarkerLibrary()
    }
  }, [])

  // Initialize map
  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        mapTypeId: mapType,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        gestureHandling: "greedy",
        mapId: "CLIENT_VIEW_MAP",
      })
      setMap(newMap)
    }
  }, [ref, map, center, zoom, mapType])

  // Update map type
  useEffect(() => {
    if (map) {
      map.setMapTypeId(mapType)
    }
  }, [map, mapType])

  // Update Advanced Marker
  useEffect(() => {
    if (map && marker && markerLibrary) {
      const { AdvancedMarkerElement } = markerLibrary

      if (advancedMarker) {
        advancedMarker.position = marker
      } else {
        const newMarker = new AdvancedMarkerElement({
          map,
          position: marker,
          gmpDraggable: false,
          title: "Project Location",
        })
        setAdvancedMarker(newMarker)
      }
    }
  }, [map, marker, markerLibrary, advancedMarker])

  // Center map when marker changes
  useEffect(() => {
    if (map && marker) {
      map.panTo(marker)
    }
  }, [map, marker])

  return <div ref={ref} className="w-full h-full" />
}

// Loading Component
function MapLoadingStatus({ status }) {
  if (status === Status.LOADING) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }

  if (status === Status.FAILURE) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg border-2 border-red-200">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-600 font-semibold mb-2">Failed to load Google Maps</p>
          <p className="text-sm text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  return null
}

// Main Component
export default function ClientLocationView({ projectId, projectData }) {
  const [mapType, setMapType] = useState("hybrid")
  const [marker, setMarker] = useState(null)
  const [address, setAddress] = useState("")

  const defaultCenter = { lat: 6.5244, lng: 3.3792 }

  // Load project location
  useEffect(() => {
    if (projectData?.projectLocation) {
      const location = projectData.projectLocation
      setMarker({
        lat: location.lat,
        lng: location.lng,
      })
      setAddress(location.address || "")
      setMapType(location.mapType || "hybrid")
    }
  }, [projectData])

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-600 font-semibold">Map service unavailable</p>
          <p className="text-sm text-gray-600 mt-2">Please contact support</p>
        </div>
      </div>
    )
  }

  if (!marker) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <FiMapPin className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-900">Project Location</h2>
        </div>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FiMapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Location not set yet</p>
          <p className="text-sm text-gray-400 mt-1">
            The project manager will set the location soon
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <FiMapPin className="w-5 h-5 text-orange-500" />
        <h2 className="text-lg font-semibold text-gray-900">Project Location</h2>
      </div>

      {/* Map Container */}
      <div className="relative mb-4">
        <Wrapper apiKey={apiKey} libraries={["places", "marker"]} render={MapLoadingStatus}>
          <div className="h-96 rounded-lg overflow-hidden border-2 border-gray-200">
            <MapComponent
              center={marker || defaultCenter}
              zoom={15}
              marker={marker}
              mapType={mapType}
            />
          </div>
        </Wrapper>

        {/* Map Type Controls */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => setMapType("roadmap")}
            className={`px-3 py-2 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors border-b border-gray-200 ${
              mapType === "roadmap" ? "bg-primary text-white hover:bg-orange-600" : "text-gray-700"
            }`}
          >
            <FiMap className="w-4 h-4" />
            Map
          </button>
          <button
            onClick={() => setMapType("satellite")}
            className={`px-3 py-2 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors border-b border-gray-200 ${
              mapType === "satellite" ? "bg-primary text-white hover:bg-orange-600" : "text-gray-700"
            }`}
          >
            <MdSatellite className="w-4 h-4" />
            Satellite
          </button>
          <button
            onClick={() => setMapType("hybrid")}
            className={`px-3 py-2 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors border-b border-gray-200 ${
              mapType === "hybrid" ? "bg-primary text-white hover:bg-orange-600" : "text-gray-700"
            }`}
          >
            <FiLayers className="w-4 h-4" />
            Hybrid
          </button>
          <button
            onClick={() => setMapType("terrain")}
            className={`px-3 py-2 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors ${
              mapType === "terrain" ? "bg-primary text-white hover:bg-orange-600" : "text-gray-700"
            }`}
          >
            <MdTerrain className="w-4 h-4" />
            Terrain
          </button>
        </div>
      </div>

      {/* Location Info */}
      <div className="bg-blue-50 rounded-lg p-4 mb-4 space-y-2">
        <div className="text-sm">
          <span className="font-medium text-gray-700">Address:</span>
          <span className="ml-2 text-gray-600">{address || "Address not available"}</span>
        </div>
        <div className="text-sm">
          <span className="font-medium text-gray-700">Coordinates:</span>
          <span className="ml-2 text-gray-600 font-mono">
            {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
          </span>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="text-sm text-gray-600">
          <strong className="text-gray-900">ℹ️ View Only:</strong> This is the project site location set by your project manager.
        </p>
      </div>
    </div>
  )
}
"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Wrapper, Status } from "@googlemaps/react-wrapper"
import { FiMapPin, FiSearch, FiSave, FiX, FiMap, FiMaximize, FiMinimize } from "react-icons/fi"
import { FiLayers } from "react-icons/fi"
import { doc, updateDoc, onSnapshot, serverTimestamp } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { toast } from "react-hot-toast"
import { MdSatellite, MdTerrain } from "react-icons/md"
import { FaStreetView } from "react-icons/fa"

// Map Component with Advanced Markers and Street View
function MapComponent({ center, zoom, onMapClick, marker, onMarkerDragEnd, mapType, onMapLoad, showStreetView, onStreetViewAvailabilityChange }) {
  const ref = useRef(null)
  const streetViewRef = useRef(null)
  const [map, setMap] = useState(null)
  const [streetView, setStreetView] = useState(null)
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
        fullscreenControl: false,
        zoomControl: true,
        gestureHandling: "greedy",
        mapId: "PROJECT_LOCATION_MAP",
      })
      setMap(newMap)
      onMapLoad?.(newMap)
    }
  }, [ref, map, center, zoom, mapType, onMapLoad])

  // Initialize Street View
  useEffect(() => {
    if (streetViewRef.current && !streetView) {
      const panorama = new window.google.maps.StreetViewPanorama(streetViewRef.current, {
        position: center,
        pov: { heading: 34, pitch: 10 },
        zoom: 1,
        addressControl: true,
        linksControl: true,
        panControl: true,
        enableCloseButton: false,
      })
      setStreetView(panorama)
    }
  }, [streetViewRef, streetView, center])

  // Check Street View availability when marker changes
  useEffect(() => {
    if (marker && map && onStreetViewAvailabilityChange) {
      const streetViewService = new window.google.maps.StreetViewService()
      streetViewService.getPanorama(
        { location: marker, radius: 50 },
        (data, status) => {
          if (status === "OK") {
            onStreetViewAvailabilityChange(true)
          } else {
            onStreetViewAvailabilityChange(false)
          }
        }
      )
    }
  }, [marker, map, onStreetViewAvailabilityChange])

  // Update Street View position when marker changes
  useEffect(() => {
    if (streetView && marker && showStreetView) {
      streetView.setPosition(marker)
    }
  }, [streetView, marker, showStreetView])

  // Update map type
  useEffect(() => {
    if (map) {
      map.setMapTypeId(mapType)
    }
  }, [map, mapType])

  // Handle map clicks
  useEffect(() => {
    if (map) {
      const clickListener = map.addListener("click", (e) => {
        onMapClick?.({
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        })
      })
      return () => window.google.maps.event.removeListener(clickListener)
    }
  }, [map, onMapClick])

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
          gmpDraggable: true,
          title: "Project Location",
        })

        newMarker.addListener("dragend", (e) => {
          onMarkerDragEnd?.({
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          })
        })

        setAdvancedMarker(newMarker)
      }
    } else if (advancedMarker && !marker) {
      advancedMarker.map = null
      setAdvancedMarker(null)
    }
  }, [map, marker, markerLibrary, advancedMarker, onMarkerDragEnd])

  // Center map when marker changes
  useEffect(() => {
    if (map && marker) {
      map.panTo(marker)
    }
  }, [map, marker])

  return (
    <>
      <div ref={ref} className="w-full h-full" style={{ display: showStreetView ? 'none' : 'block' }} />
      <div ref={streetViewRef} className="w-full h-full" style={{ display: showStreetView ? 'block' : 'none' }} />
    </>
  )
}

// Search Box Component
function SearchBox({ onPlaceSelect }) {
  const inputRef = useRef(null)
  const autocompleteRef = useRef(null)

  useEffect(() => {
    const initAutocomplete = () => {
      if (inputRef.current && window.google?.maps?.places && !autocompleteRef.current) {
        try {
          const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
            fields: ["geometry", "formatted_address", "name"],
          })
          
          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace()
            
            if (place.geometry && place.geometry.location) {
              const locationData = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                address: place.formatted_address || place.name,
              }
              onPlaceSelect?.(locationData)
            }
          })
          
          autocompleteRef.current = autocomplete
        } catch (err) {
          console.error("Error initializing Autocomplete:", err)
        }
      }
    }

    if (window.google?.maps?.places) {
      initAutocomplete()
    } else {
      const timer = setTimeout(initAutocomplete, 500)
      return () => clearTimeout(timer)
    }
  }, [onPlaceSelect])

  return (
    <div className="relative">
      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10 pointer-events-none" />
      <input 
        ref={inputRef}
        type="text"
        placeholder="Search for a location..."
        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
      />
    </div>
  )
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
          <p className="text-sm text-gray-600 mb-4">Please check your API key and internet connection</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return null
}

// Main Component
export default function ProjectLocationMap({ projectId }) {
  const [marker, setMarker] = useState(null)
  const [address, setAddress] = useState("")
  const [mapType, setMapType] = useState("hybrid")
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showStreetView, setShowStreetView] = useState(false)
  const [streetViewAvailable, setStreetViewAvailable] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const mapRef = useRef(null)
  const mapContainerRef = useRef(null)
  const [currentUser, setCurrentUser] = useState(null)

  const defaultCenter = { lat: 6.5244, lng: 3.3792 }

  // Get current user
  useEffect(() => {
    const user = auth.currentUser
    if (user) {
      setCurrentUser(user)
    }
  }, [])

  // Subscribe to project location
  useEffect(() => {
    if (!projectId) return

    const unsubscribe = onSnapshot(doc(db, "projects", projectId), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data()
        if (data.projectLocation) {
          setMarker({
            lat: data.projectLocation.lat,
            lng: data.projectLocation.lng,
          })
          setAddress(data.projectLocation.address || "")
          setMapType(data.projectLocation.mapType || "hybrid")
        }
      }
    })

    return () => unsubscribe()
  }, [projectId])

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const handleMapLoad = useCallback((map) => {
    mapRef.current = map
  }, [])

  const handleMapClick = useCallback((location) => {
    setMarker(location)
    setHasChanges(true)
    reverseGeocode(location)
  }, [])

  const handleMarkerDragEnd = useCallback((location) => {
    setMarker(location)
    setHasChanges(true)
    reverseGeocode(location)
  }, [])

  const handlePlaceSelect = useCallback((place) => {
    const newMarker = { lat: place.lat, lng: place.lng }
    
    setMarker(newMarker)
    setAddress(place.address || "")
    setHasChanges(true)
    
    if (mapRef.current) {
      mapRef.current.panTo(newMarker)
      mapRef.current.setZoom(15)
    }
  }, [])

  const reverseGeocode = async (location) => {
    try {
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ location }, (results, status) => {
        if (status === "OK" && results[0]) {
          setAddress(results[0].formatted_address)
        }
      })
    } catch (err) {
      console.error("Geocoding error:", err)
    }
  }

  const handleSave = async () => {
    if (!marker || !currentUser) return

    setSaving(true)
    const toastId = toast.loading("Saving project location...")

    try {
      await updateDoc(doc(db, "projects", projectId), {
        projectLocation: {
          lat: marker.lat,
          lng: marker.lng,
          address: address || "",
          zoom: mapRef.current?.getZoom() || 15,
          mapType: mapType,
          setBy: currentUser.uid,
          setAt: serverTimestamp(),
          lastUpdated: serverTimestamp(),
        },
      })

      setHasChanges(false)
      toast.success("Project location saved successfully!", { id: toastId })
    } catch (err) {
      console.error("Error saving location:", err)
      toast.error("Failed to save location. Please try again.", { id: toastId })
    } finally {
      setSaving(false)
    }
  }

  const handleClear = () => {
    if (window.confirm("Are you sure you want to remove the project location?")) {
      setMarker(null)
      setAddress("")
      setHasChanges(true)
      setShowStreetView(false)
    }
  }

  const handleCenterOnMarker = () => {
    if (mapRef.current && marker) {
      mapRef.current.panTo(marker)
      mapRef.current.setZoom(15)
    }
  }

  const toggleStreetView = () => {
    if (!marker) {
      toast.error("Please set a location marker first")
      return
    }
    if (!streetViewAvailable && !showStreetView) {
      toast.error("Street View is not available for this location")
      return
    }
    setShowStreetView(!showStreetView)
  }

  const toggleFullscreen = async () => {
    if (!mapContainerRef.current) return

    try {
      if (!isFullscreen) {
        await mapContainerRef.current.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (err) {
      console.error("Fullscreen error:", err)
      toast.error("Failed to toggle fullscreen")
    }
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return (
      <div className="bg-white border-2 border-primary rounded-lg p-4 md:p-6 mb-6">
        <div className="text-center py-12">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-600 font-semibold">Google Maps API key not found</p>
          <p className="text-sm text-gray-600 mt-2">Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border-2 border-primary rounded-lg p-4 md:p-6 mb-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <FiMapPin className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-gray-900">Project Location</h2>
        {hasChanges && (
          <span className="ml-auto text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">
            Unsaved changes
          </span>
        )}
      </div>

      {/* Search Box */}
      <div className="mb-4">
        <Wrapper apiKey={apiKey} libraries={["places", "marker"]} render={MapLoadingStatus}>
          <SearchBox onPlaceSelect={handlePlaceSelect} />
        </Wrapper>
      </div>

      {/* Map Container */}
      <div className="relative mb-4">
        <Wrapper apiKey={apiKey} libraries={["places", "marker"]} render={MapLoadingStatus}>
          <div 
            ref={mapContainerRef}
            className="h-96 rounded-lg overflow-hidden border-2 border-gray-200 relative"
          >
            <MapComponent
              center={marker || defaultCenter}
              zoom={15}
              onMapClick={handleMapClick}
              marker={marker}
              onMarkerDragEnd={handleMarkerDragEnd}
              mapType={mapType}
              onMapLoad={handleMapLoad}
              showStreetView={showStreetView}
              onStreetViewAvailabilityChange={setStreetViewAvailable}
            />

            {/* Map Type & View Controls - Overlay */}
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => {
                  setMapType("roadmap")
                  setHasChanges(true)
                  setShowStreetView(false)
                }}
                className={`px-3 py-2 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors border-b border-gray-200 ${
                  mapType === "roadmap" && !showStreetView ? "bg-primary text-white hover:bg-orange-600" : "text-gray-700"
                }`}
              >
                <FiMap className="w-4 h-4" />
                Map
              </button>
              <button
                onClick={() => {
                  setMapType("satellite")
                  setHasChanges(true)
                  setShowStreetView(false)
                }}
                className={`px-3 py-2 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors border-b border-gray-200 ${
                  mapType === "satellite" && !showStreetView ? "bg-primary text-white hover:bg-orange-600" : "text-gray-700"
                }`}
              >
                <MdSatellite className="w-4 h-4" />
                Satellite
              </button>
              <button
                onClick={() => {
                  setMapType("hybrid")
                  setHasChanges(true)
                  setShowStreetView(false)
                }}
                className={`px-3 py-2 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors border-b border-gray-200 ${
                  mapType === "hybrid" && !showStreetView ? "bg-primary text-white hover:bg-orange-600" : "text-gray-700"
                }`}
              >
                <FiLayers className="w-4 h-4" />
                Hybrid
              </button>
              <button
                onClick={() => {
                  setMapType("terrain")
                  setHasChanges(true)
                  setShowStreetView(false)
                }}
                className={`px-3 py-2 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors border-b border-gray-200 ${
                  mapType === "terrain" && !showStreetView ? "bg-primary text-white hover:bg-orange-600" : "text-gray-700"
                }`}
              >
                <MdTerrain className="w-4 h-4" />
                Terrain
              </button>
              <button
                onClick={toggleStreetView}
                disabled={!marker}
                className={`px-3 py-2 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors border-b border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  showStreetView ? "bg-primary text-white hover:bg-orange-600" : "text-gray-700"
                }`}
                title={!marker ? "Set a location first" : !streetViewAvailable && !showStreetView ? "Street View not available" : "Street View"}
              >
                <FaStreetView className="w-4 h-4" />
                Street View
              </button>
              <button
                onClick={toggleFullscreen}
                className="px-3 py-2 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors text-gray-700"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <FiMinimize className="w-4 h-4" /> : <FiMaximize className="w-4 h-4" />}
                {isFullscreen ? "Exit" : "Fullscreen"}
              </button>
            </div>
          </div>
        </Wrapper>
      </div>

      {/* Location Info */}
      {marker && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2">
          <div className="text-sm">
            <span className="font-medium text-gray-700">Address:</span>
            <span className="ml-2 text-gray-600">{address || "Getting address..."}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-700">Coordinates:</span>
            <span className="ml-2 text-gray-600 font-mono">
              {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
            </span>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!marker && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Click anywhere on the map or search for a location to set the project site marker.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-2">
        {marker && (
          <button
            onClick={handleCenterOnMarker}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <FiMapPin className="w-4 h-4" />
            Center on Marker
          </button>
        )}
        {marker && (
          <button
            onClick={handleClear}
            disabled={saving}
            className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiX className="w-4 h-4" />
            Clear Location
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving || !marker}
          className="flex-1 px-4 py-2 bg-primary hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSave className="w-4 h-4" />
          {saving ? "Saving..." : "Save Location"}
        </button>
      </div>
    </div>
  )
}
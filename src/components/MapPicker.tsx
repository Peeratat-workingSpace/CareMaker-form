import { useEffect, useRef } from 'react'

interface Props {
  lat: number | null
  lng: number | null
  onChange: (lat: number, lng: number) => void
}

export default function MapPicker({ lat, lng, onChange }: Props) {
  const mapRef    = useRef<HTMLDivElement>(null)
  const leafRef   = useRef<any>(null)
  const markerRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || leafRef.current) return

    // Dynamically import Leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      const map = L.default.map(mapRef.current!, {
        center: [18.7883, 98.9853],
        zoom: 13,
      })

      L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      map.on('click', (e: any) => {
        placeMarker(L.default, map, e.latlng.lat, e.latlng.lng)
      })

      leafRef.current = { map, L: L.default }

      // If initial coords
      if (lat && lng) {
        placeMarker(L.default, map, lat, lng)
        map.setView([lat, lng], 15)
      }
    })

    return () => {
      if (leafRef.current) {
        leafRef.current.map.remove()
        leafRef.current = null
      }
    }
  }, [])

  function placeMarker(L: any, map: any, la: number, ln: number) {
    if (markerRef.current) {
      markerRef.current.setLatLng([la, ln])
    } else {
      markerRef.current = L.marker([la, ln], { draggable: true }).addTo(map)
      markerRef.current.on('dragend', () => {
        const pos = markerRef.current.getLatLng()
        onChange(pos.lat, pos.lng)
      })
    }
    onChange(la, ln)
    map.setView([la, ln], 15)
  }

  return (
    <div
      ref={mapRef}
      id="map-container"
      className="w-full h-64 md:h-80 rounded-xl border-2 border-gray-200 overflow-hidden"
    />
  )
}

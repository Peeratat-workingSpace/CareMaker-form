import { useEffect, useRef, useState, useCallback } from 'react'
import { MapPinIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'

const GMAP_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY

interface Props {
  lat: number | null
  lng: number | null
  onChange: (lat: number, lng: number, locality: LocalityInfo) => void
}

export interface LocalityInfo {
  subdistrict: string
  district: string
  province: string
  raw: string
}

let gmapsPromise: Promise<void> | null = null

function loadGoogleMaps(): Promise<void> {
  if (gmapsPromise) return gmapsPromise
  gmapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GMAP_KEY}&libraries=places,marker&loading=async&language=th&region=TH&callback=__gmapsReady`
    script.async = true
    script.onerror = () => reject(new Error('Google Maps failed to load'))
    ;(window as unknown as Record<string, unknown>)['__gmapsReady'] = () => {
      delete (window as unknown as Record<string, unknown>)['__gmapsReady']
      resolve()
    }
    document.head.appendChild(script)
  })
  return gmapsPromise
}

async function reverseGeocode(lat: number, lng: number): Promise<LocalityInfo> {
  return new Promise((resolve) => {
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status !== 'OK' || !results?.length) {
        resolve({ subdistrict: '', district: '', province: '', raw: '' })
        return
      }
      const components: Record<string, string> = {}
      for (const comp of results[0].address_components) {
        for (const type of comp.types) {
          components[type] = comp.long_name
        }
      }
      resolve({
        subdistrict: components['sublocality_level_1'] || components['sublocality'] || components['neighborhood'] || '',
        district   : components['administrative_area_level_2'] || '',
        province   : components['administrative_area_level_1'] || '',
        raw        : results[0].formatted_address || '',
      })
    })
  })
}

export default function MapPicker({ lat, lng, onChange }: Props) {
  const containerRef    = useRef<HTMLDivElement>(null)
  const mapRef          = useRef<google.maps.Map | null>(null)
  const markerRef       = useRef<google.maps.marker.AdvancedMarkerElement | null>(null)
  const AdvancedMarkerRef = useRef<typeof google.maps.marker.AdvancedMarkerElement | null>(null)
  const geocodeReqId    = useRef(0)
  const onChangeRef     = useRef(onChange)
  useEffect(() => { onChangeRef.current = onChange }, [onChange])

  const [loadState,    setLoadState]    = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [geocoding,    setGeocoding]    = useState(false)
  const [locality,     setLocality]     = useState<LocalityInfo | null>(null)
  const [geocodeError, setGeocodeError] = useState(false)

  const placeMarker = useCallback(async (la: number, ln: number) => {
    if (!mapRef.current || !AdvancedMarkerRef.current) return
    const reqId = ++geocodeReqId.current

    if (!markerRef.current) {
      markerRef.current = new AdvancedMarkerRef.current({
        position: { lat: la, lng: ln },
        map: mapRef.current,
        title: 'ลากเพื่อปรับตำแหน่ง',
        gmpDraggable: true,
      })
      markerRef.current.addListener('dragend', () => {
        const p = markerRef.current!.position as google.maps.LatLngLiteral
        placeMarker(p.lat, p.lng)
      })
    } else {
      markerRef.current.position = { lat: la, lng: ln }
    }

    mapRef.current.panTo({ lat: la, lng: ln })
    mapRef.current.setZoom(16)

    setGeocoding(true)
    setGeocodeError(false)
    try {
      const info = await reverseGeocode(la, ln)
      if (reqId !== geocodeReqId.current) return  // ทิ้ง response เก่า
      setLocality(info)
      setGeocodeError(!info.province)
      onChangeRef.current(la, ln, info)
    } catch {
      if (reqId !== geocodeReqId.current) return
      setGeocodeError(true)
      onChangeRef.current(la, ln, { subdistrict: '', district: '', province: '', raw: '' })
    } finally {
      setGeocoding(false)
    }
  }, [])

  const placeMarkerRef = useRef(placeMarker)
  useEffect(() => { placeMarkerRef.current = placeMarker }, [placeMarker])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    setLoadState('loading')

    loadGoogleMaps()
      .then(async () => {
        if (!containerRef.current) return

        const { Map } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary
        const { AdvancedMarkerElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary

        // เก็บ constructor ไว้ใน ref ให้ placeMarker ใช้ได้
        AdvancedMarkerRef.current = AdvancedMarkerElement

        const map = new Map(containerRef.current, {
          center: lat && lng ? { lat, lng } : { lat: 18.7883, lng: 98.9853 },
          zoom: lat && lng ? 15 : 13,
          mapId: 'DEMO_MAP_ID',
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          gestureHandling: 'greedy',
          styles: [
            { featureType: 'poi', stylers: [{ visibility: 'simplified' }] },
            { featureType: 'transit', stylers: [{ visibility: 'off' }] },
          ],
        })

        map.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (e.latLng) placeMarkerRef.current(e.latLng.lat(), e.latLng.lng())
        })

        mapRef.current = map
        setLoadState('ready')

        if (lat && lng) placeMarkerRef.current(lat, lng)
      })
      .catch((err) => {
        console.error('Maps load error:', err)
        setLoadState('error')
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (loadState === 'ready' && lat && lng) {
      placeMarkerRef.current(lat, lng)
    }
  }, [lat, lng, loadState])

  return (
    <div className="flex flex-col gap-2">
      <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden border-2 border-gray-200">
        <div ref={containerRef} className="w-full h-full" />

        {loadState === 'loading' && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center gap-2 text-sm text-gray-500 font-sarabun">
            <span className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
            กำลังโหลดแผนที่...
          </div>
        )}

        {loadState === 'error' && (
          <div className="absolute inset-0 bg-red-50 flex flex-col items-center justify-center gap-2 text-sm text-red-500 font-sarabun p-4 text-center">
            <ExclamationCircleIcon className="w-8 h-8" />
            ไม่สามารถโหลด Google Maps ได้<br />
            <span className="text-xs text-gray-400">กรุณาตรวจสอบ VITE_GOOGLE_MAPS_KEY ใน .env</span>
          </div>
        )}

        {loadState === 'ready' && !lat && !lng && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm text-xs text-gray-600 font-sarabun px-3 py-1.5 rounded-full shadow border border-gray-200 pointer-events-none whitespace-nowrap">
            👆 แตะแผนที่เพื่อปักหมุด
          </div>
        )}
      </div>

      {(lat && lng) && (
        <div className={[
          'flex items-start gap-2.5 px-3.5 py-3 rounded-xl border text-sm font-sarabun transition-all',
          geocoding
            ? 'bg-gray-50 border-gray-200 text-gray-400'
            : geocodeError
              ? 'bg-red-50 border-red-200 text-red-600'
              : 'bg-brand-50 border-brand-200 text-brand-900',
        ].join(' ')}>
          {geocoding ? (
            <>
              <span className="w-4 h-4 mt-0.5 border-2 border-brand-300 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <span>กำลังตรวจสอบตำแหน่ง...</span>
            </>
          ) : geocodeError ? (
            <>
              <ExclamationCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>ไม่พบข้อมูลพื้นที่ — ลองปักหมุดใหม่อีกครั้ง</span>
            </>
          ) : locality?.province ? (
            <div className="flex flex-col gap-1 w-full">
              <div className="flex items-center gap-1.5">
                <CheckCircleIcon className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="font-semibold text-brand-900">ตรวจสอบตำแหน่ง</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {[
                  { label: 'ตำบล / แขวง', value: locality.subdistrict || '—' },
                  { label: 'อำเภอ / เขต',  value: locality.district    || '—' },
                  { label: 'จังหวัด',       value: locality.province   || '—' },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-lg px-2.5 py-2 border border-brand-100 text-center">
                    <div className="text-[10px] text-brand-400 font-semibold mb-0.5">{item.label}</div>
                    <div className="text-xs font-semibold text-brand-900 leading-tight">{item.value}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <MapPinIcon className="w-3 h-3 text-brand-300 flex-shrink-0" />
                <span className="text-[11px] text-gray-400 truncate">{locality.raw}</span>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
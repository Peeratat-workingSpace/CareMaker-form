// Page2.tsx
import { useState } from 'react'
import {
  MagnifyingGlassIcon,
  CursorArrowRaysIcon,
} from '@heroicons/react/24/outline'
import Card from './Card'
import MapPicker, { type LocalityInfo } from './MapPicker'
import type { FormData } from '../types'

interface Props {
  formData: FormData
  onChange: (data: Partial<FormData>) => void
  onNext: () => void
  onBack: () => void
}

export default function Page2({ formData, onChange, onNext, onBack }: Props) {
  const [searching, setSearching] = useState(false)

  /* ใช้ตำแหน่งปัจจุบัน (GPS) — แค่ส่ง lat/lng, MapPicker จะ reverse geocode เอง */
  function useMyLocation() {
    if (!navigator.geolocation) { alert('เบราว์เซอร์นี้ไม่รองรับ GPS'); return }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({ lat: String(pos.coords.latitude), lng: String(pos.coords.longitude) })
      },
      () => alert('ไม่สามารถเข้าถึงตำแหน่งได้ กรุณาอนุญาต GPS')
    )
  }

  /* ค้นหาจากที่อยู่ข้อความ — ใช้ Google Geocoder */
  function searchAddress() {
    const addr = formData.address.trim()
    if (!addr) { alert('กรุณากรอกที่อยู่ก่อน'); return }
    if (!window.google?.maps) { alert('กรุณารอแผนที่โหลดก่อน'); return }
    setSearching(true)
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode(
      { address: addr + ' ประเทศไทย', region: 'TH'},
      (results, status) => {
        setSearching(false)
        if (status === 'OK' && results?.length) {
          const loc = results[0].geometry.location
          onChange({ lat: String(loc.lat()), lng: String(loc.lng()) })
        } else {
          alert('ไม่พบที่อยู่นี้ ลองพิมพ์ชื่อย่อหรือชื่อภาษาไทย')
        }
      }
    )
  }

  /* MapPicker ส่ง locality กลับมาพร้อม lat/lng */
  function handleMapChange(lat: number, lng: number, locality: LocalityInfo) {
    onChange({
      lat: String(lat),
      lng: String(lng),
      subdistrict: locality.subdistrict,
      district   : locality.district,
      province   : locality.province,
      address_full : locality.raw,
    })
  }

  const field = (label: string, req: boolean, children: React.ReactNode) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 font-sarabun">
        {label} {req && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )

  const inputCls = 'px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-sarabun text-sm text-gray-800 bg-white focus:outline-none focus:border-brand-400 focus:shadow-[0_0_0_3px_rgba(41,121,212,0.12)] transition-all w-full'

  return (
    <>
      {/* Contact */}
      <Card icon="fa-solid fa-user" title="ข้อมูลผู้ติดต่อ / ผู้ดูแล">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('ชื่อผู้ติดต่อ', true,
            <input className={inputCls} placeholder="ชื่อ - นามสกุล"
              value={formData.contactName}
              onChange={(e) => onChange({ contactName: e.target.value })} />
          )}
          {field('เบอร์โทรศัพท์', true,
            <input className={inputCls} type="tel" placeholder="0XX-XXXXXXX"
              value={formData.contactPhone}
              onChange={(e) => onChange({ contactPhone: e.target.value })} />
          )}
        </div>
      </Card>

      {/* Patient */}
      <Card icon="fa-solid fa-hospital-user" title="ข้อมูลผู้ป่วย / ผู้สูงอายุ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('เพศ', true,
            <select className={inputCls} value={formData.gender} onChange={(e) => onChange({ gender: e.target.value })}>
              <option value="">-- เลือกเพศ --</option>
              <option>ชาย</option>
              <option>หญิง</option>
              <option>อื่นๆ</option>
            </select>
          )}
          {field('อายุ (ปี)', true,
            <input className={inputCls} type="number" placeholder="อายุ" min={0} max={150}
              value={formData.age} onChange={(e) => onChange({ age: e.target.value })} />
          )}
          {field('น้ำหนัก (กก.)', false,
            <input className={inputCls} type="number" placeholder="กก." min={0}
              value={formData.weight} onChange={(e) => onChange({ weight: e.target.value })} />
          )}
          {field('ส่วนสูง (ซม.)', false,
            <input className={inputCls} type="number" placeholder="ซม." min={0}
              value={formData.height} onChange={(e) => onChange({ height: e.target.value })} />
          )}
          {field('สัญชาติ', false,
            <input className={inputCls} placeholder="ไทย"
              value={formData.nationality} onChange={(e) => onChange({ nationality: e.target.value })} />
          )}
          <div className="md:col-span-2">
            {field('อาการปัจจุบัน', true,
              <textarea className={`${inputCls} min-h-[80px] resize-y`}
                placeholder="กรุณาระบุอาการให้ครบถ้วนเพื่อความสะดวกในการประเมินการดูแล..."
                value={formData.symptoms} onChange={(e) => onChange({ symptoms: e.target.value })} />
            )}
          </div>
          <div className="md:col-span-2">
            {field('โรคประจำตัว', false,
              <textarea className={`${inputCls} min-h-[70px] resize-y`}
                placeholder="กรุณาระบุโรคประจำตัวให้ครบถ้วน..."
                value={formData.diseases} onChange={(e) => onChange({ diseases: e.target.value })} />
            )}
          </div>
        </div>
      </Card>

      {/* Map */}
      <Card icon="fa-solid fa-location-dot" title="พิกัดสถานที่ดูแล">
        <div className="flex flex-col gap-3">
          {field('ที่อยู่ (ใช้ค้นหาหรืออ้างอิง)', true,
            <input className={inputCls} placeholder="บ้านเลขที่ ถนน ตำบล อำเภอ จังหวัด"
              value={formData.address} onChange={(e) => onChange({ address: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && searchAddress()} />
          )}

          <div className="flex gap-2 flex-wrap">
            <button onClick={useMyLocation}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border-2 border-brand-400 text-brand-500 text-xs font-semibold font-sarabun hover:bg-brand-50 transition-colors">
              <CursorArrowRaysIcon className="w-4 h-4" />
              ใช้ตำแหน่งปัจจุบัน
            </button>
            <button onClick={searchAddress} disabled={searching}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border-2 border-brand-400 text-brand-500 text-xs font-semibold font-sarabun hover:bg-brand-50 transition-colors disabled:opacity-50">
              {searching
                ? <span className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                : <MagnifyingGlassIcon className="w-4 h-4" />
              }
              {searching ? 'กำลังค้นหา...' : 'ค้นหาจากที่อยู่'}
            </button>
          </div>

          <MapPicker
            lat={formData.lat ? parseFloat(formData.lat) : null}
            lng={formData.lng ? parseFloat(formData.lng) : null}
            onChange={handleMapChange}
          />
        </div>
      </Card>

      {/* Notes */}
      <Card icon="fa-solid fa-note-sticky" title="หมายเหตุเพิ่มเติม">
        <input className={inputCls} placeholder="ข้อมูลอื่นๆ ที่ต้องการแจ้ง"
          value={formData.notes} onChange={(e) => onChange({ notes: e.target.value })} />
      </Card>

      {/* Navigation */}
      <div className="flex gap-3 mb-8">
        <button onClick={onBack}
          className="flex-1 py-3.5 rounded-full border-2 border-brand-400 text-brand-500 font-semibold font-sarabun text-sm hover:bg-brand-50 transition-colors">
          ← ย้อนกลับ
        </button>
        <button onClick={onNext}
          className="flex-1 py-3.5 rounded-full bg-brand-500 hover:bg-brand-700 text-white font-semibold font-sarabun text-sm transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
          ถัดไป: ยืนยันข้อมูล →
        </button>
      </div>
    </>
  )
}

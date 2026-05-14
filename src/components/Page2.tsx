// Page2.tsx
import { useState, type ReactNode } from 'react'
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
  const [searchInput, setSearchInput] = useState('')

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
    const addr = searchInput.trim()
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
      address    : locality.raw,
    })
  }

  const field = (label: string, req: boolean, children: ReactNode) => (
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
              onChange={(e) => {
                const val = e.target.value
                if (/^[ก-๙a-zA-Z\s]*$/.test(val)) onChange({ contactName: val })
              }} />
          )}
          {field('เบอร์โทรศัพท์', true,
            <input className={inputCls} type="tel" placeholder="0XX-XXXXXXX"
              value={formData.contactPhone}
              onChange={(e) => {
                const val = e.target.value
                if (/^\d{0,10}$/.test(val)) onChange({ contactPhone: val })
              }} />
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
            <input className={inputCls} type="text" inputMode="numeric" placeholder="อายุ"
              value={formData.age}
              onChange={(e) => {
                const val = e.target.value
                if (/^\d{0,3}$/.test(val)) onChange({ age: val })
              }} />
          )}
          {field('น้ำหนัก (กก.)', false,
            <input className={inputCls} type="text" inputMode="numeric" placeholder="กก."
              value={formData.weight}
              onChange={(e) => {
                const val = e.target.value
                if (/^\d{0,3}$/.test(val)) onChange({ weight: val })
              }} />
          )}
          {field('ส่วนสูง (ซม.)', false,
            <input className={inputCls} type="text" inputMode="numeric" placeholder="ซม."
              value={formData.height}
              onChange={(e) => {
                const val = e.target.value
                if (/^\d{0,3}$/.test(val)) onChange({ height: val })
              }} />
          )}
          {field('สัญชาติ', false,
            <select className={inputCls} value={formData.nationality} onChange={(e) => onChange({ nationality: e.target.value })}>
              <option value="">-- เลือกสัญชาติ --</option>
              <option value="ไทย">ไทย</option>
              <option value="อังกฤษ">อังกฤษ</option>
              <option value="จีน">จีน</option>
              <option value="ญี่ปุ่น">ญี่ปุ่น</option>
              <option value="เกาหลี">เกาหลี</option>
              <option value="เวียดนาม">เวียดนาม</option>
              <option value="อินโดนีเซีย">อินโดนีเซีย</option>
              <option value="มาเลเซีย">มาเลเซีย</option>
              <option value="เมียนมา">เมียนมา</option>
              <option value="ลาว">ลาว</option>
            </select>
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
          {field('ค้นหาสถานที่ (เพื่อความสะดวกในการปักหมุด)', false,
            <input className={inputCls} placeholder="บ้านเลขที่ ถนน ตำบล อำเภอ จังหวัด"
              value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
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

import { useState, useEffect } from 'react'
import {
  MapPinIcon,
  MagnifyingGlassIcon,
  CursorArrowRaysIcon,
} from '@heroicons/react/24/outline'
import Card from './Card'
import MapPicker from './MapPicker'
import type { FormData } from '../types'

interface Props {
  formData: FormData
  onChange: (data: Partial<FormData>) => void
  onNext: () => void
  onBack: () => void
}

export default function Page2({ formData, onChange, onNext, onBack }: Props) {
  const [coordLabel, setCoordLabel] = useState('ยังไม่ได้เลือกพิกัด')

  useEffect(() => {
    if (formData.lat && formData.lng) {
      setCoordLabel(`พิกัด: ${parseFloat(formData.lat).toFixed(5)}, ${parseFloat(formData.lng).toFixed(5)}`)
    }
  }, [formData.lat, formData.lng])

  function useMyLocation() {
    if (!navigator.geolocation) { alert('เบราว์เซอร์นี้ไม่รองรับ GPS'); return }
    setCoordLabel('กำลังขอตำแหน่ง...')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({ lat: String(pos.coords.latitude), lng: String(pos.coords.longitude) })
      },
      () => setCoordLabel('ไม่สามารถเข้าถึงตำแหน่งได้')
    )
  }

  function searchAddress() {
    const addr = formData.address.trim()
    if (!addr) { alert('กรุณากรอกที่อยู่ก่อน'); return }
    setCoordLabel('กำลังค้นหา...')
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}&limit=1`)
      .then((r) => r.json())
      .then((data) => {
        if (data.length > 0) {
          onChange({ lat: data[0].lat, lng: data[0].lon })
        } else {
          setCoordLabel('ไม่พบที่อยู่นี้')
        }
      })
      .catch(() => setCoordLabel('เกิดข้อผิดพลาด'))
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
          {field('ชื่อผู้ติดต่อ (ไม่ต้องระบุคำนำหน้าชื่อ)', true,
            <input className={inputCls} placeholder="ชื่อ - นามสกุล"
              value={formData.contactName}
              onChange={(e) => {
                const val = e.target.value.replace(/[^\p{L}\s]/gu, '')
                onChange({ contactName: val })
              }} />
          )}
          {field('เบอร์โทรศัพท์', true,
            <input className={inputCls} type="tel" placeholder="0XXXXXXXXX"
              maxLength={10} inputMode="numeric" pattern="[0-9]*"
              value={formData.contactPhone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '')
                if (val.length <= 10) onChange({ contactPhone: val })
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
            <input className={inputCls} type="text" placeholder="อายุ"
              maxLength={3} inputMode="numeric" pattern="[0-9]*"
              value={formData.age}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '')
                if (val.length <= 3) onChange({ age: val })
              }} />
          )}
          {field('น้ำหนัก (กก.)', false,
            <input className={inputCls} type="text" placeholder="กก."
              maxLength={3} inputMode="numeric" pattern="[0-9]*"
              value={formData.weight}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '')
                if (val.length <= 3) onChange({ weight: val })
              }} />
          )}
          {field('ส่วนสูง (ซม.)', false,
            <input className={inputCls} type="text" placeholder="ซม."
              maxLength={3} inputMode="numeric" pattern="[0-9]*"
              value={formData.height}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '')
                if (val.length <= 3) onChange({ height: val })
              }} />
          )}
          {field('สัญชาติ', false,
            <select className={inputCls} value={formData.nationality} onChange={(e) => onChange({ nationality: e.target.value })}>
              <option value="">-- เลือกสัญชาติ --</option>
              <option>ไทย</option>
              <option>อังกฤษ</option>
              <option>จีน</option>
              <option>เกาหลี</option>
              <option>ลาว</option>
              <option>เมียนมา</option>
              <option>มาเลเซีย</option>
              <option>เวียดนาม</option>
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
          {field('ที่อยู่', true,
            <input className={inputCls} placeholder="บ้านเลขที่ ถนน ตำบล อำเภอ จังหวัด"
              value={formData.address} onChange={(e) => onChange({ address: e.target.value })} />
          )}

          <div className="flex gap-2 flex-wrap">
            <button onClick={useMyLocation}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border-2 border-brand-400 text-brand-500 text-xs font-semibold font-sarabun hover:bg-brand-50 transition-colors">
              <CursorArrowRaysIcon className="w-4 h-4" />
              ใช้ตำแหน่งปัจจุบัน
            </button>
            <button onClick={searchAddress}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border-2 border-brand-400 text-brand-500 text-xs font-semibold font-sarabun hover:bg-brand-50 transition-colors">
              <MagnifyingGlassIcon className="w-4 h-4" />
              ค้นหาจากที่อยู่
            </button>
          </div>

          <MapPicker
            lat={formData.lat ? parseFloat(formData.lat) : null}
            lng={formData.lng ? parseFloat(formData.lng) : null}
            onChange={(la, ln) => onChange({ lat: String(la), lng: String(ln) })}
          />

          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-sarabun">
            <MapPinIcon className="w-3.5 h-3.5 text-brand-400" />
            {coordLabel}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {field('Latitude', false,
              <input className={inputCls} readOnly placeholder="รอพิกัด..." value={formData.lat} />
            )}
            {field('Longitude', false,
              <input className={inputCls} readOnly placeholder="รอพิกัด..." value={formData.lng} />
            )}
          </div>
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

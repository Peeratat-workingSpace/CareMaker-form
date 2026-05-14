import Card from './Card'
import Receipt from './Receipt'
import type { FormData } from '../types'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

interface Props {
  selectedServices: Set<string>
  startDate: Date | null
  endDate: Date | null
  alternateDays: boolean
  hoursIdx: number | null
  formData: FormData
  onRemoveService: (id: string) => void
  onSubmit: () => void
  onBack: () => void
}

export default function Page3({
  selectedServices, startDate, endDate, alternateDays, hoursIdx,
  formData, onRemoveService, onSubmit, onBack
}: Props) {
  return (
    <>
      <Card icon="fa-solid fa-clipboard-list" title="ยืนยันข้อมูลก่อนส่ง">
        {/* Contact + Patient summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div>
            <div className="font-prompt font-semibold text-brand-900 text-sm mb-2 flex items-center gap-1.5">
              <i className="fa-solid fa-user text-brand-500 text-xs" />
              ผู้ติดต่อ
            </div>
            <p className="font-sarabun text-sm text-gray-800">{formData.contactName}</p>
            <p className="font-sarabun text-xs text-gray-500 mt-0.5">
              <i className="fa-solid fa-phone mr-1" />{formData.contactPhone}
            </p>
          </div>
          <div>
            <div className="font-prompt font-semibold text-brand-900 text-sm mb-2 flex items-center gap-1.5">
              <i className="fa-solid fa-hospital-user text-brand-500 text-xs" />
              ผู้ป่วย
            </div>
            <p className="font-sarabun text-sm text-gray-800">
              เพศ: {formData.gender} | อายุ: {formData.age} ปี
            </p>
            <p className="font-sarabun text-xs text-gray-500 mt-0.5">
              น้ำหนัก: {formData.weight || '-'} กก. | สูง: {formData.height || '-'} ซม.
            </p>
          </div>
        </div>

        <div className="mb-4">
          <div className="font-prompt font-semibold text-brand-900 text-sm mb-1.5 flex items-center gap-1.5">
            <i className="fa-solid fa-stethoscope text-brand-500 text-xs" />
            อาการปัจจุบัน
          </div>
          <p className="font-sarabun text-sm text-gray-600 leading-relaxed">{formData.symptoms}</p>
        </div>

        {formData.diseases && (
          <div className="mb-4">
            <div className="font-prompt font-semibold text-brand-900 text-sm mb-1.5 flex items-center gap-1.5">
              <i className="fa-solid fa-file-medical text-brand-500 text-xs" />
              โรคประจำตัว
            </div>
            <p className="font-sarabun text-sm text-gray-600">{formData.diseases}</p>
          </div>
        )}

        <div className="mb-5">
          <div className="font-prompt font-semibold text-brand-900 text-sm mb-1.5 flex items-center gap-1.5">
            <i className="fa-solid fa-location-dot text-brand-500 text-xs" />
            สถานที่
          </div>
          <p className="font-sarabun text-sm text-gray-600">
            {formData.address || 'ไม่ได้ระบุที่อยู่'}
            {formData.lat ? ` (${parseFloat(formData.lat).toFixed(5)}, ${parseFloat(formData.lng).toFixed(5)})` : ' (ไม่ได้ระบุพิกัด)'}
          </p>
        </div>

        <hr className="border-gray-200 mb-5" />

        <div className="font-prompt font-semibold text-brand-900 text-sm mb-3 flex items-center gap-1.5">
          <i className="fa-solid fa-file-invoice-dollar text-brand-500 text-xs" />
          สรุปบริการและราคา
        </div>

        <Receipt
          selected={selectedServices}
          startDate={startDate}
          endDate={endDate}
          alternateDays={alternateDays}
          hoursIdx={hoursIdx}
          onRemove={onRemoveService}
        />
      </Card>

      <div className="flex gap-3 mb-8">
        <button onClick={onBack}
          className="flex-1 py-3.5 rounded-full border-2 border-brand-400 text-brand-500 font-semibold font-sarabun text-sm hover:bg-brand-50 transition-colors">
          ← แก้ไขข้อมูล
        </button>
        <button onClick={onSubmit}
          className="flex-1 py-3.5 rounded-full bg-accent text-white font-semibold font-sarabun text-sm hover:bg-teal-600 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
          <CheckCircleIcon className="w-5 h-5" />
          ส่งแบบฟอร์ม
        </button>
      </div>
    </>
  )
}

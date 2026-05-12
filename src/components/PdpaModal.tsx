import { useState } from 'react'
import { ShieldCheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

interface Props {
  /** 'initial' = popup แรกเข้า, 'submit' = popup ก่อนส่งข้อมูล */
  mode: 'initial' | 'submit'
  onAccept: () => void
  onDecline: () => void
}

export default function PdpaModal({ mode, onAccept, onDecline }: Props) {
  const [checked1, setChecked1] = useState(false) // ยินยอมข้อมูลพื้นฐาน
  const [checked2, setChecked2] = useState(false) // ยินยอมข้อมูลสุขภาพ (sensitive)
  const [showDetail, setShowDetail] = useState(false)

  const canProceed = checked1 && checked2

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm animate-fade-slide">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-brand-900 to-brand-700 px-5 py-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <ShieldCheckIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-prompt font-semibold text-white text-base leading-tight">
                {mode === 'initial'
                  ? 'นโยบายความเป็นส่วนตัว (PDPA)'
                  : 'ยืนยันการยินยอมก่อนส่งข้อมูล'}
              </h2>
              <p className="text-brand-200 text-xs font-sarabun mt-0.5">
                พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

          {/* Intro */}
          <p className="font-sarabun text-sm text-gray-600 leading-relaxed">
            Caremaker ดำเนินการตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
            กรุณาอ่านและให้ความยินยอมก่อนใช้บริการ
          </p>

          {/* Data collected list */}
          <div className="bg-brand-50 rounded-xl p-4 border border-brand-100">
            <p className="font-prompt text-sm font-semibold text-brand-900 mb-2">
              ข้อมูลที่เราเก็บรวบรวม
            </p>
            <ul className="font-sarabun text-xs text-gray-600 space-y-1.5 list-none">
              {[
                { icon: 'fa-user', text: 'ชื่อ-นามสกุล และเบอร์โทรศัพท์ผู้ติดต่อ' },
                { icon: 'fa-hospital-user', text: 'ข้อมูลผู้ป่วย: เพศ อายุ น้ำหนัก ส่วนสูง สัญชาติ' },
                { icon: 'fa-stethoscope', text: 'ข้อมูลสุขภาพ: อาการ โรคประจำตัว (ข้อมูลละเอียดอ่อน)' },
                { icon: 'fa-location-dot', text: 'ที่อยู่และพิกัดสถานที่ให้บริการ' },
                { icon: 'fa-calendar-days', text: 'วันเวลาและบริการที่ต้องการ' },
              ].map((item) => (
                <li key={item.icon} className="flex items-start gap-2">
                  <i className={`${item.icon} fa-solid text-brand-400 mt-0.5 w-4 text-center flex-shrink-0`} />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Purpose */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="font-prompt text-sm font-semibold text-brand-900 mb-2">
              วัตถุประสงค์การใช้ข้อมูล
            </p>
            <ul className="font-sarabun text-xs text-gray-600 space-y-1 list-disc list-inside">
              <li>จัดหาผู้ดูแลที่เหมาะสมกับความต้องการของท่าน</li>
              <li>ติดต่อกลับเพื่อยืนยันบริการและนัดหมาย</li>
              <li>คำนวณราคาและจัดทำใบเสนอราคา</li>
              <li>ปรับปรุงคุณภาพบริการของ Caremaker</li>
            </ul>
          </div>

          {/* Expandable detail */}
          <button
            onClick={() => setShowDetail((v) => !v)}
            className="w-full text-left text-xs text-brand-500 font-semibold font-sarabun flex items-center gap-1.5 hover:text-brand-700 transition-colors"
          >
            <i className={`fa-solid fa-chevron-${showDetail ? 'up' : 'down'} text-[10px]`} />
            {showDetail ? 'ซ่อน' : 'แสดง'} รายละเอียดเพิ่มเติมเกี่ยวกับสิทธิ์ของท่าน
          </button>

          {showDetail && (
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 text-xs font-sarabun text-gray-700 space-y-2 animate-fade-slide">
              <p className="font-semibold text-yellow-800 font-prompt">สิทธิ์ของท่านตาม PDPA</p>
              <ul className="space-y-1 list-disc list-inside text-gray-600">
                <li><strong>สิทธิ์เข้าถึง</strong> — ขอดูข้อมูลส่วนบุคคลของท่านที่เราเก็บไว้</li>
                <li><strong>สิทธิ์แก้ไข</strong> — ขอให้แก้ไขข้อมูลที่ไม่ถูกต้อง</li>
                <li><strong>สิทธิ์ลบ</strong> — ขอให้ลบข้อมูลของท่านออกจากระบบ</li>
                <li><strong>สิทธิ์ถอนความยินยอม</strong> — ถอนความยินยอมได้ตลอดเวลา โดยไม่กระทบสิทธิ์ที่เกิดขึ้นก่อนหน้า</li>
                <li><strong>สิทธิ์ร้องเรียน</strong> — ยื่นเรื่องต่อ สำนักงาน PDPC ได้</li>
              </ul>
              <p className="text-gray-500 mt-2">
                ติดต่อ DPO: <span className="text-brand-600 font-semibold">privacy@caremaker.th</span> | โทร 02-123-4567
              </p>
              <p className="text-gray-400 text-[10px]">
                เก็บข้อมูลเป็นระยะเวลา 3 ปีนับจากวันที่ให้บริการ ข้อมูลจะไม่ถูกเปิดเผยต่อบุคคลที่สาม
                ยกเว้นกรณีที่กฎหมายกำหนดหรือท่านให้ความยินยอมเพิ่มเติม
              </p>
            </div>
          )}

          {/* Consent checkboxes — explicitly separated per PDPA guidelines */}
          <div className="space-y-3 pt-1">
            <p className="font-prompt text-xs font-semibold text-gray-500 uppercase tracking-wide">
              การให้ความยินยอม (โปรดติ๊กทุกข้อ)
            </p>

            {/* Consent 1 — general personal data */}
            <label className={[
              'flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all',
              checked1 ? 'border-brand-500 bg-brand-50' : 'border-gray-200 bg-white hover:border-brand-300',
            ].join(' ')}>
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked1}
                  onChange={() => setChecked1((v) => !v)}
                />
                <div className={[
                  'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all',
                  checked1 ? 'border-brand-500 bg-brand-500' : 'border-gray-300 bg-white',
                ].join(' ')}>
                  {checked1 && <CheckCircleIcon className="w-4 h-4 text-white" />}
                </div>
              </div>
              <p className="font-sarabun text-sm text-gray-700 leading-relaxed">
                ข้าพเจ้า<strong>ยินยอม</strong>ให้ Caremaker เก็บรวบรวม ใช้ และเปิดเผย
                <strong> ข้อมูลส่วนบุคคลทั่วไป</strong> (ชื่อ เบอร์โทร ที่อยู่ พิกัด)
                เพื่อวัตถุประสงค์ในการจัดหาบริการดูแลผู้ป่วย
              </p>
            </label>

            {/* Consent 2 — sensitive health data (explicit consent required by PDPA) */}
            <label className={[
              'flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all',
              checked2 ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-red-300',
            ].join(' ')}>
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked2}
                  onChange={() => setChecked2((v) => !v)}
                />
                <div className={[
                  'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all',
                  checked2 ? 'border-red-500 bg-red-500' : 'border-gray-300 bg-white',
                ].join(' ')}>
                  {checked2 && <CheckCircleIcon className="w-4 h-4 text-white" />}
                </div>
              </div>
              <div>
                <p className="font-sarabun text-sm text-gray-700 leading-relaxed">
                  ข้าพเจ้า<strong>ยินยอมโดยชัดแจ้ง (Explicit Consent)</strong> ให้ Caremaker
                  เก็บรวบรวม ใช้ และประมวลผล
                  <strong> ข้อมูลสุขภาพและอาการของผู้ป่วย</strong> ซึ่งเป็นข้อมูลละเอียดอ่อน
                  ตามมาตรา 26 แห่ง พ.ร.บ. PDPA 2562
                </p>
                <span className="inline-block mt-1 text-[10px] font-semibold text-red-500 bg-red-100 px-2 py-0.5 rounded-full font-sarabun">
                  ⚕️ ข้อมูลสุขภาพ — ต้องได้รับความยินยอมโดยชัดแจ้ง
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0 bg-gray-50 space-y-2">
          {!canProceed && (
            <p className="text-center text-xs text-gray-400 font-sarabun">
              กรุณาติ๊กยินยอมทุกข้อเพื่อดำเนินการต่อ
            </p>
          )}
          <div className="flex gap-3">
            <button
              onClick={onDecline}
              className="flex-none px-4 py-3 rounded-full border-2 border-gray-300 text-gray-500 font-semibold font-sarabun text-sm hover:bg-gray-100 transition-colors flex items-center gap-1.5"
            >
              <XMarkIcon className="w-4 h-4" />
              ไม่ยินยอม
            </button>
            <button
              disabled={!canProceed}
              onClick={onAccept}
              className={[
                'flex-1 py-3 rounded-full font-semibold font-sarabun text-sm transition-all flex items-center justify-center gap-2',
                canProceed
                  ? 'bg-brand-500 text-white hover:bg-brand-700 shadow-md hover:shadow-lg hover:-translate-y-0.5'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed',
              ].join(' ')}
            >
              <ShieldCheckIcon className="w-4 h-4" />
              {mode === 'initial' ? 'ยินยอมและเริ่มใช้งาน' : 'ยืนยันและส่งข้อมูล'}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
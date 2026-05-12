import { CheckCircleIcon } from '@heroicons/react/24/solid'

interface Props {
  onReset: () => void
}

export default function Page4({ onReset }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center animate-fade-slide">
      <CheckCircleIcon className="w-20 h-20 text-accent mx-auto mb-4" />
      <h2 className="font-prompt text-2xl font-bold text-brand-900 mb-3">ส่งแบบฟอร์มสำเร็จ!</h2>
      <p className="font-sarabun text-gray-500 max-w-sm mx-auto leading-relaxed text-sm">
        ทีมงาน Caremaker จะติดต่อกลับภายใน 1–2 ชั่วโมง<br />
        เพื่อยืนยันบริการและเสนอราคาสุดท้าย<br /><br />
        ขอบคุณที่ไว้วางใจ Caremaker 🤍
      </p>
      <button
        onClick={onReset}
        className="mt-8 px-8 py-3.5 rounded-full bg-brand-500 hover:bg-brand-700 text-white font-semibold font-sarabun text-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
      >
        เริ่มต้นใหม่
      </button>
    </div>
  )
}

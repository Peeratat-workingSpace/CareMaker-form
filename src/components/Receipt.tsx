import { XMarkIcon } from '@heroicons/react/24/solid'
import { SERVICES, HOURS_OPTIONS } from '../data/data'

interface Props {
  selected: Set<string>
  startDate: Date | null
  endDate: Date | null
  alternateDays: boolean
  hoursIdx: number | null
  onRemove?: (id: string) => void
}

export default function Receipt({ selected, startDate, endDate, alternateDays, hoursIdx, onRemove }: Props) {
  const today = new Date()

  if (!startDate || !endDate || hoursIdx === null || selected.size === 0) {
    return (
      <div className="text-center py-10 text-gray-400 font-sarabun text-sm">
        <i className="fa-solid fa-arrow-up text-gray-300 text-2xl mb-2 block" />
        กรุณาเลือกบริการและระยะเวลาด้านบน
      </div>
    )
  }

  const rawDays   = Math.round((endDate.getTime() - startDate.getTime()) / 86400000) + 1
  const days      = alternateDays ? Math.ceil(rawDays / 2) : rawDays
  const h         = HOURS_OPTIONS[hoursIdx]
  const mult      = h.ratePerDay * days
  const fmtDate   = (d: Date) => d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })

  let total = 0
  const rows = Array.from(selected).map((id) => {
    const svc   = SERVICES.find((s) => s.id === id)!
    const price = Math.round(svc.price * mult)
    total += price
    return { svc, price }
  })

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-900 to-brand-700 px-5 py-4 flex items-center justify-between">
        <h3 className="font-prompt text-white font-semibold">ใบเสนอราคา Caremaker</h3>
        <span className="text-brand-200 text-xs font-sarabun">
          {today.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-2.5">
        {/* Date row */}
        <div className="flex justify-between items-center py-2.5 border-b border-dashed border-gray-200 text-sm font-sarabun">
          <span className="text-gray-500 flex items-center gap-1.5">
            <i className="fa-regular fa-calendar-days text-brand-400" />
            {fmtDate(startDate)} – {fmtDate(endDate)}
            {alternateDays && <span className="ml-1 text-xs text-brand-500 font-semibold">(วันเว้นวัน)</span>}
          </span>
          <span className="font-semibold text-brand-700">{days} วัน</span>
        </div>

        {/* Hours row */}
        <div className="flex justify-between items-center py-2.5 border-b border-dashed border-gray-200 text-sm font-sarabun">
          <span className="text-gray-500 flex items-center gap-1.5">
            <i className="fa-solid fa-clock text-brand-400" />
            {h.hrs} ชั่วโมง/วัน ({h.type})
          </span>
          <span className="font-semibold text-brand-700">x{h.ratePerDay}</span>
        </div>

        {/* Service rows */}
        {rows.map(({ svc, price }) => (
          <div key={svc.id} className="flex justify-between items-center py-2.5 border-b border-dashed border-gray-200 text-sm font-sarabun gap-2">
            <span className="text-gray-500 flex-1">
              <i className={`${svc.icon} mr-1.5 text-brand-400`} />
              {svc.name}
            </span>
            <span className="font-semibold text-brand-700 whitespace-nowrap">฿{price.toLocaleString()}</span>
            {onRemove && (
              <button
                onClick={() => onRemove(svc.id)}
                className="text-red-500 hover:text-red-500 hover:bg-red-50 rounded p-1 transition-colors"
              >
                <XMarkIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="px-5 py-4 bg-brand-50 border-t-2 border-brand-200 flex items-center justify-between">
        <span className="font-semibold text-gray-700 font-sarabun">ราคารวมโดยประมาณ</span>
        <span className="font-prompt text-2xl font-bold text-brand-700">฿{total.toLocaleString()}</span>
      </div>
    </div>
  )
}

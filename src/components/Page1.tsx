import { useState } from 'react'
import { CalendarDaysIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import Card from './Card'
import ServiceGrid from './ServiceGrid'
import CalendarModal from './CalendarModal'
import HoursGrid from './HoursGrid'
import Receipt from './Receipt'

interface Props {
  selectedServices: Set<string>
  onToggleService: (id: string) => void
  startDate: Date | null
  endDate: Date | null
  alternateDays: boolean
  onCalendarConfirm: (start: Date, end: Date, alternate: boolean) => void
  hoursIdx: number | null
  onHoursSelect: (idx: number) => void
  onNext: () => void
}

export default function Page1({
  selectedServices,
  onToggleService,
  startDate,
  endDate,
  alternateDays,
  onCalendarConfirm,
  hoursIdx,
  onHoursSelect,
  onNext,
}: Props) {
  const [calOpen, setCalOpen] = useState(false)

  const fmtDate = (d: Date) =>
    d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long' })

  const rawDays = startDate && endDate
    ? Math.round((endDate.getTime() - startDate.getTime()) / 86400000) + 1
    : null
  const effectiveDays = rawDays !== null
    ? (alternateDays ? Math.ceil(rawDays / 2) : rawDays)
    : null

  return (
    <>
      {/* Services */}
      <Card
        icon="fa-solid fa-stethoscope"
        title="เลือกบริการที่ต้องการ"
        badge={`เลือกแล้ว ${selectedServices.size} บริการ`}
      >
        <p className="text-red-400 text-sm mb-4 font-sarabun">
          คลิกเพื่อเลือกบริการ สามารถเลือกได้หลายรายการ กดอีกครั้งเพื่อดูรายละเอียด
        </p>
        <ServiceGrid selected={selectedServices} onToggle={onToggleService} />
      </Card>

      {/* Duration */}
      <Card icon="fa-regular fa-calendar-days" title="ระยะเวลาที่ต้องการดูแล">
        <p className="text-red-400 text-sm mb-4 font-sarabun">
          กดปุ่มด้านล่างเพื่อเปิดปฏิทิน เลือกวันเริ่มต้นและวันสิ้นสุด
        </p>

        {/* Calendar trigger button */}
        <button
          onClick={() => setCalOpen(true)}
          className={[
            'w-full flex items-center justify-between px-4 py-4 rounded-xl border-2 transition-all font-sarabun',
            startDate && endDate
              ? 'border-brand-500 bg-brand-50 text-brand-900'
              : 'border-brand-200 bg-brand-50 text-brand-700 hover:border-brand-400 hover:bg-brand-100',
          ].join(' ')}
        >
          <div className="flex items-center gap-3">
            <CalendarDaysIcon className="w-6 h-6 text-brand-500 flex-shrink-0" />
            <div className="text-left">
              {startDate && endDate ? (
                <>
                  <div className="font-semibold text-brand-900 text-sm">
                    {fmtDate(startDate)} → {fmtDate(endDate)}
                  </div>
                  <div className="text-xs text-brand-500">
                    {effectiveDays} วัน{alternateDays ? ' (วันเว้นวัน)' : ''}
                  </div>
                </>
              ) : (
                <div className="font-semibold">กดเพื่อเปิดปฏิทิน</div>
              )}
            </div>
          </div>
          <ChevronRightIcon className="w-5 h-5 text-brand-400" />
        </button>

        {/* Hours per day — show after dates selected */}
        {startDate && endDate && (
          <div className="mt-5">
            <hr className="border-gray-200 mb-4" />
            <div className="flex items-center gap-2 font-prompt font-semibold text-brand-900 text-sm mb-1">
              <i className="fa-solid fa-clock text-brand-500" />
              เลือกจำนวนชั่วโมงดูแลต่อวัน
            </div>
            <HoursGrid selectedIdx={hoursIdx} onSelect={onHoursSelect} />
          </div>
        )}
      </Card>

      {/* Receipt */}
      <Card icon="fa-solid fa-file-invoice-dollar" title="สรุปราคาโดยประมาณ">
        <Receipt
          selected={selectedServices}
          startDate={startDate}
          endDate={endDate}
          alternateDays={alternateDays}
          hoursIdx={hoursIdx}
          onRemove={onToggleService}
        />

        <button
          onClick={onNext}
          className="mt-5 w-full py-3.5 rounded-full bg-brand-500 hover:bg-brand-700 text-white font-semibold font-sarabun text-sm transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
        >
          ถัดไป: กรอกข้อมูลผู้ป่วย
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </Card>

      {/* Calendar Modal */}
      <CalendarModal
        isOpen={calOpen}
        onClose={() => setCalOpen(false)}
        startDate={startDate}
        endDate={endDate}
        alternateDays={alternateDays}
        onConfirm={(s, e, alt) => {
          onCalendarConfirm(s, e, alt)
          setCalOpen(false)
        }}
      />
    </>
  )
}

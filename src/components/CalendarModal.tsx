import { useEffect, useRef, useState } from 'react'
import { XMarkIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'
import { TH_MONTHS, TH_DAYS_SHORT } from '../data/data'

interface Props {
  isOpen: boolean
  onClose: () => void
  startDate: Date | null
  endDate: Date | null
  alternateDays: boolean
  onConfirm: (start: Date, end: Date, alternate: boolean) => void
}

function startOfDay(d: Date) {
  const c = new Date(d)
  c.setHours(0, 0, 0, 0)
  return c
}

function addMonths(date: Date, n: number) {
  const d = new Date(date.getFullYear(), date.getMonth() + n, 1)
  return d
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

interface MonthProps {
  year: number
  month: number
  pickStep: 0 | 1
  start: Date | null
  end: Date | null
  hovered: Date | null
  onDayClick: (d: Date) => void
  onDayHover: (d: Date | null) => void
  alternateDays: boolean
}

function MonthGrid({ year, month, pickStep, start, end, hovered, onDayClick, onDayHover, alternateDays }: MonthProps) {
  const today = startOfDay(new Date())
  const firstDow = new Date(year, month, 1).getDay() // 0=Sun
  const daysInMonth = getDaysInMonth(year, month)

  const previewEnd = pickStep === 1 ? (hovered || end) : end

  // Compute which days to highlight as alternate (skipped)
  const altSkipped = new Set<string>()
  if (alternateDays && start && (end || previewEnd)) {
    const s = start
    const e = end || previewEnd!
    if (s <= e) {
      let cur = new Date(s)
      let i = 0
      while (cur <= e) {
        if (i % 2 === 1) {
          altSkipped.add(cur.toDateString())
        }
        cur = new Date(cur)
        cur.setDate(cur.getDate() + 1)
        i++
      }
    }
  }

  const cells: (Date | null)[] = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d))
  }

  return (
    <div className="mb-8">
      {/* Month label */}
      <div className="text-center font-prompt font-semibold text-brand-900 text-base md:text-lg mb-3">
        {TH_MONTHS[month]} {year + 543}
      </div>

      {/* Day-of-week header */}
      <div className="grid grid-cols-7 mb-1">
        {TH_DAYS_SHORT.map((d) => (
          <div key={d} className="text-center text-[11px] md:text-xs font-bold text-gray-400 py-1 font-sarabun">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((date, idx) => {
          if (!date) return <div key={`e-${idx}`} />

          const ds = date.toDateString()
          const isPast = date < today
          const isStart = start && isSameDay(date, start)
          const isEnd   = end   && isSameDay(date, end)
          const isPreviewEnd = previewEnd && !end && isSameDay(date, previewEnd)
          const isToday = isSameDay(date, today)

          let inRange = false
          if (start && previewEnd) {
            const lo = start < previewEnd ? start : previewEnd
            const hi = start < previewEnd ? previewEnd : start
            inRange = date > lo && date < hi
          }

          const isSkipped = altSkipped.has(ds)

          let cellClass = 'relative flex items-center justify-center text-sm md:text-base cursor-pointer select-none h-10 md:h-12 transition-all duration-100 font-sarabun '

          if (isPast) {
            cellClass += 'text-gray-200 cursor-not-allowed '
          } else if (isStart) {
            cellClass += 'bg-brand-500 text-white font-bold cal-start '
          } else if (isEnd || isPreviewEnd) {
            cellClass += 'bg-brand-500 text-white font-bold cal-end '
          } else if (inRange) {
            cellClass += 'cal-in-range '
            if (isSkipped) cellClass += 'opacity-40 '
          } else {
            cellClass += 'hover:bg-brand-100 rounded-lg '
          }

          return (
            <div
              key={ds}
              className={cellClass}
              onClick={() => !isPast && onDayClick(date)}
              onMouseEnter={() => !isPast && onDayHover(date)}
              onMouseLeave={() => onDayHover(null)}
            >
              {date.getDate()}
              {isToday && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
              )}
              {isSkipped && inRange && (
                <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="w-4 h-[2px] bg-gray-400 opacity-60 rotate-45 rounded" />
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function CalendarModal({ isOpen, onClose, startDate, endDate, alternateDays, onConfirm }: Props) {
  const [localStart, setLocalStart]         = useState<Date | null>(startDate)
  const [localEnd,   setLocalEnd]           = useState<Date | null>(endDate)
  const [pickStep,   setPickStep]           = useState<0 | 1>(startDate ? 1 : 0)
  const [hovered,    setHovered]            = useState<Date | null>(null)
  const [altDay,     setAltDay]             = useState(alternateDays)
  const [numMonths]                         = useState(12) // render 12 months ahead
  const scrollRef = useRef<HTMLDivElement>(null)

  const baseDate = new Date()
  baseDate.setDate(1)

  const months: { year: number; month: number }[] = []
  for (let i = 0; i < numMonths; i++) {
    const d = addMonths(baseDate, i)
    months.push({ year: d.getFullYear(), month: d.getMonth() })
  }

  useEffect(() => {
    setLocalStart(startDate)
    setLocalEnd(endDate)
    setPickStep(startDate && !endDate ? 1 : startDate && endDate ? 0 : 0)
    setAltDay(alternateDays)
  }, [isOpen, startDate, endDate, alternateDays])

  const handleDayClick = (date: Date) => {
    if (pickStep === 0) {
      setLocalStart(date)
      setLocalEnd(null)
      setPickStep(1)
    } else {
      if (localStart && date < localStart) {
        // clicked before start — restart
        setLocalStart(date)
        setLocalEnd(null)
        setPickStep(1)
      } else {
        setLocalEnd(date)
        setPickStep(0)
      }
    }
  }

  const totalDays = localStart && localEnd
    ? Math.round((localEnd.getTime() - localStart.getTime()) / 86400000) + 1
    : null

  const effectiveDays = totalDays !== null
    ? altDay ? Math.ceil(totalDays / 2) : totalDays
    : null

  const fmtDate = (d: Date) =>
    d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })

  const canConfirm = localStart && localEnd

  if (!isOpen) return null

  return (
    // mobile: full-screen | desktop: centered dialog with overlay
    <div className="fixed inset-0 z-50 flex flex-col md:items-center md:justify-center md:bg-black/50 animate-scale-in">
      <div className="flex flex-col w-full h-full md:h-[88vh] md:max-w-lg md:rounded-2xl md:overflow-hidden md:shadow-2xl bg-white">

      {/* ── Top bar ── */}
      <div className="bg-gradient-to-r from-brand-900 to-brand-700 px-5 py-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-white font-prompt font-semibold text-lg">
            <CalendarDaysIcon className="w-5 h-5" />
            เลือกวันที่ดูแล
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Selected range display */}
        <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2.5">
          <div className="flex-1 text-center">
            <div className="text-brand-200 text-[10px] font-sarabun mb-0.5">วันเริ่มต้น</div>
            <div className="text-white font-bold font-prompt text-sm">
              {localStart ? fmtDate(localStart) : '—'}
            </div>
          </div>
          <div className="text-brand-200 text-lg">→</div>
          <div className="flex-1 text-center">
            <div className="text-brand-200 text-[10px] font-sarabun mb-0.5">วันสิ้นสุด</div>
            <div className="text-white font-bold font-prompt text-sm">
              {localEnd ? fmtDate(localEnd) : pickStep === 1 ? 'เลือกวันสิ้นสุด' : '—'}
            </div>
          </div>
          {totalDays !== null && (
            <div className="text-center border p-2 rounded">
              <div className="text-white font-bold font-prompt text-sm">{effectiveDays}</div>
              <div className="text-brand-200 text-[10px] font-sarabun">วัน</div>
            </div>
          )}
        </div>

        {/* Instruction */}
        <p className="text-brand-200 text-xs font-sarabun mt-2 text-center">
          {pickStep === 0 ? '👆 กดเลือกวันเริ่มต้น' : '👆 กดเลือกวันสิ้นสุด (ข้ามเดือนได้)'}
        </p>
      </div>

      {/* ── Scrollable calendar body ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5 bg-gray-50">
        <div className="max-w-md mx-auto">
          {months.map(({ year, month }) => (
            <MonthGrid
              key={`${year}-${month}`}
              year={year}
              month={month}
              pickStep={pickStep}
              start={localStart}
              end={localEnd}
              hovered={hovered}
              onDayClick={handleDayClick}
              onDayHover={setHovered}
              alternateDays={altDay}
            />
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        {/* Alternate-day toggle — only show after both dates selected */}
        {canConfirm && (
          <label className="flex items-center gap-3 mb-3 cursor-pointer select-none p-3 rounded-xl bg-brand-50 border border-brand-200 max-w-[340px] mx-auto">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={altDay}
                onChange={() => setAltDay(v => !v)}
              />
              <div className="w-10 h-6 bg-gray-300 peer-checked:bg-brand-500 rounded-full transition-colors" />
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
            </div>
            <div className="flex-1 font-sarabun">
              <div className="text-sm font-semibold text-brand-900">จองวันเว้นวัน</div>
              <div className="text-xs text-gray-500">
                {altDay
                  ? `จองเฉพาะวันคี่ — ประมาณ ${effectiveDays} วัน (จาก ${totalDays} วัน)`
                  : 'จองทุกวันในช่วงที่เลือก'}
              </div>
            </div>
            <i className="fa-solid fa-calendar-week text-brand-400 text-lg" />
          </label>
        )}

        <div className="flex gap-3 max-w-[340px] mx-auto">
          <button
            onClick={() => {
              setLocalStart(null)
              setLocalEnd(null)
              setPickStep(0)
              setAltDay(false)
            }}
            className="flex-none px-5 py-3 rounded-full border-2 border-brand-400 text-brand-500 font-semibold font-sarabun text-sm hover:bg-brand-50 transition-colors"
          >
            ล้างข้อมูล
          </button>
          <button
            disabled={!canConfirm}
            onClick={() => canConfirm && onConfirm(localStart!, localEnd!, altDay)}
            className={[
              'flex-1 py-3 rounded-full font-semibold font-sarabun text-sm transition-all',
              canConfirm
                ? 'bg-brand-500 text-white hover:bg-brand-700 shadow-md hover:shadow-lg hover:-translate-y-0.5'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed',
            ].join(' ')}
          >
            {canConfirm
              ? `ยืนยัน ${effectiveDays} วัน${altDay ? ' (วันเว้นวัน)' : ''}`
              : 'กรุณาเลือกวันที่'}
          </button>
        </div>
      </div>

      </div>{/* end inner dialog div */}
    </div>
  )
}
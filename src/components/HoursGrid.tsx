import { MoonIcon } from '@heroicons/react/24/outline'
import { HOURS_OPTIONS } from '../data/data'

interface Props {
  selectedIdx: number | null
  onSelect: (idx: number) => void
}

export default function HoursGrid({ selectedIdx, onSelect }: Props) {
  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mt-3">
        {HOURS_OPTIONS.map((opt, i) => {
          const isSelected = selectedIdx === i
          return (
            <button
              key={opt.hrs}
              onClick={() => onSelect(i)}
              className={[
                'border-2 rounded-xl p-3 text-center cursor-pointer transition-all font-sarabun',
                isSelected
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-gray-200 bg-white hover:border-brand-400',
              ].join(' ')}
            >
              <div className="font-prompt text-2xl font-bold text-brand-700">{opt.hrs}</div>
              <div className="text-xs text-gray-500 mt-0.5">ชั่วโมง/วัน</div>
              <div className="text-[11px] text-gray-400 mt-0.5">{opt.type}</div>
            </button>
          )
        })}
      </div>

      {selectedIdx === 2 && (
        <div className="mt-3 flex items-center gap-2 px-3.5 py-2.5 bg-yellow-50 border border-yellow-300 rounded-xl text-sm text-yellow-800 font-sarabun">
          <MoonIcon className="w-4 h-4 flex-shrink-0" />
          การเลือก 24 ชั่วโมง ผู้ให้บริการจะต้องมีที่พักในสถานที่ของท่าน
        </div>
      )}
    </div>
  )
}

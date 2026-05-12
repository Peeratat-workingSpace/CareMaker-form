import { CheckIcon } from '@heroicons/react/24/solid'
import { SERVICES } from '../data/data'

interface Props {
  selected: Set<string>
  onToggle: (id: string) => void
}

export default function ServiceGrid({ selected, onToggle }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {SERVICES.map((svc) => {
        const isSelected = selected.has(svc.id)
        return (
          <button
            key={svc.id}
            onClick={() => onToggle(svc.id)}
            className={[
              'relative border-2 rounded-xl p-3.5 text-left transition-all duration-200 cursor-pointer',
              'flex flex-col gap-1.5 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
              isSelected
                ? 'border-brand-500 bg-brand-50 shadow-[0_0_0_3px_rgba(41,121,212,0.15)]'
                : 'border-gray-200 bg-white hover:border-brand-400',
            ].join(' ')}
          >
            {/* Check badge */}
            {isSelected && (
              <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center">
                <CheckIcon className="w-3 h-3" />
              </span>
            )}

            {/* Icon */}
            <span className="text-2xl">
              <i className={svc.icon} />
            </span>

            {/* Name */}
            <span className="text-xs font-semibold text-gray-800 leading-tight font-sarabun">
              {svc.name}
            </span>

            {/* Price */}
            <span className="text-xs text-brand-500 font-semibold font-sarabun">
              +{svc.price.toLocaleString()} บาท/วัน
            </span>

            {/* Detail (expanded when selected) */}
            {isSelected && (
              <div className="mt-1.5 p-2 bg-white rounded-lg border-l-2 border-brand-400 text-xs text-gray-500 leading-relaxed font-sarabun animate-fade-slide">
                {svc.detail}
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

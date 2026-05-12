import { CheckIcon } from '@heroicons/react/24/solid'
import type { Page } from '../types'

interface Props {
  currentPage: Page
}

const STEPS = [
  { num: 1, label: 'เลือกบริการ & คำนวนราคา' },
  { num: 2, label: 'กรอกข้อมูลผู้ป่วย' },
  { num: 3, label: 'ยืนยันและส่งแบบฟอร์ม' },
]

export default function StepBar({ currentPage }: Props) {
  return (
    <nav className="bg-white border-b border-gray-200 px-2 md:px-6 flex overflow-x-auto">
      {STEPS.map((step) => {
        const isActive = currentPage === step.num
        const isDone   = currentPage > step.num
        return (
          <div
            key={step.num}
            className={[
              'flex items-center gap-2 px-3 md:px-5 py-3.5 whitespace-nowrap text-sm font-medium border-b-[3px] transition-all',
              isActive ? 'border-brand-500 text-brand-700 font-semibold' : '',
              isDone   ? 'border-transparent text-accent'                 : '',
              !isActive && !isDone ? 'border-transparent text-gray-400'  : '',
            ].join(' ')}
          >
            <span
              className={[
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all',
                isActive ? 'bg-brand-500 text-white' : '',
                isDone   ? 'bg-accent text-white'    : '',
                !isActive && !isDone ? 'bg-gray-200 text-gray-400' : '',
              ].join(' ')}
            >
              {isDone ? <CheckIcon className="w-3.5 h-3.5" /> : step.num}
            </span>
            <span className="font-sarabun hidden sm:inline">{step.label}</span>
          </div>
        )
      })}
    </nav>
  )
}

import type { ReactNode } from 'react'

interface Props {
  icon: string
  title: string
  children: ReactNode
  badge?: string
}

export default function Card({ icon, title, children, badge }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-5 overflow-hidden">
      {/* Card header */}
      <div className="flex items-center gap-2.5 px-5 py-4 bg-gradient-to-r from-brand-50 to-white border-b border-gray-100">
        <span className="text-brand-500 text-lg w-5 text-center flex-shrink-0">
          <i className={icon} />
        </span>
        <h2 className="font-prompt text-brand-900 font-semibold text-[15px] flex-1">{title}</h2>
        {badge && (
          <span className="bg-brand-100 text-brand-700 text-xs font-semibold px-2.5 py-1 rounded-full font-sarabun">
            {badge}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="p-5">{children}</div>
    </div>
  )
}

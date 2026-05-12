import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-brand-900 to-brand-700 px-4 md:px-6 py-4 flex items-center gap-4 sticky top-0 z-50 shadow-lg">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 md:w-11 md:h-11 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
          <i className="fa-solid fa-hand-holding-heart text-brand-500 text-lg md:text-xl" />
        </div>
        <div>
          <div className="font-prompt text-lg md:text-xl font-bold text-white tracking-tight">
            Caremaker
          </div>
          <div className="text-xs text-brand-200 font-sarabun">
            บริการดูแลผู้ป่วยและผู้สูงอายุ
          </div>
        </div>
      </div>

      {/* Contact info — hidden on mobile */}
      <div className="ml-auto hidden md:flex items-center gap-6">
        <a
          href="tel:021234567"
          className="flex items-center gap-2 text-brand-200 hover:text-white transition-colors text-sm font-sarabun"
        >
          <PhoneIcon className="w-4 h-4" />
          02-123-4567
        </a>
        <a
          href="mailto:care@caremaker.th"
          className="flex items-center gap-2 text-brand-200 hover:text-white transition-colors text-sm font-sarabun"
        >
          <EnvelopeIcon className="w-4 h-4" />
          care@caremaker.th
        </a>
      </div>
    </header>
  )
}

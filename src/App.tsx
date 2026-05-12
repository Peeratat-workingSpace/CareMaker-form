import { useState } from 'react'
import Header from './components/Header'
import StepBar from './components/StepBar'
import Page1 from './components/Page1'
import Page2 from './components/Page2'
import Page3 from './components/Page3'
import Page4 from './components/Page4'
import PdpaModal from './components/PdpaModal'
import type { FormData, Page } from './types'

const EMPTY_FORM: FormData = {
  contactName: '', contactPhone: '',
  gender: '', age: '', weight: '', height: '', nationality: '',
  symptoms: '', diseases: '',
  address: '', lat: '', lng: '', notes: '',
}

export default function App() {
  const [page, setPage]                     = useState<Page>(1)
  const [selectedServices, setSelectedSvc]  = useState<Set<string>>(new Set())
  const [startDate, setStartDate]           = useState<Date | null>(null)
  const [endDate,   setEndDate]             = useState<Date | null>(null)
  const [alternateDays, setAlternateDays]   = useState(false)
  const [hoursIdx, setHoursIdx]             = useState<number | null>(null)
  const [formData, setFormData]             = useState<FormData>(EMPTY_FORM)

  function toggleService(id: string) {
    setSelectedSvc((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function removeService(id: string) {
    setSelectedSvc((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  function handleCalendarConfirm(start: Date, end: Date, alternate: boolean) {
    setStartDate(start)
    setEndDate(end)
    setAlternateDays(alternate)
  }

  function goToPage2() {
    if (selectedServices.size === 0) { alert('กรุณาเลือกบริการอย่างน้อย 1 รายการ'); return }
    if (!startDate || !endDate)      { alert('กรุณาเลือกวันเริ่มต้นและวันสิ้นสุดในปฏิทิน'); return }
    if (hoursIdx === null)           { alert('กรุณาเลือกจำนวนชั่วโมงดูแลต่อวัน'); return }
    setPage(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goToPage3() {
    const req: (keyof FormData)[] = ['contactName', 'contactPhone', 'gender', 'age', 'symptoms', 'address']
    for (const key of req) {
      if (!formData[key].trim()) {
        alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน')
        return
      }
    }
    setPage(3)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handlePdpaSubmitAccept() {
    setShowPdpaSubmit(false)
    setPage(4)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetAll() {
    setPage(1)
    setSelectedSvc(new Set())
    setStartDate(null)
    setEndDate(null)
    setAlternateDays(false)
    setHoursIdx(null)
    setFormData(EMPTY_FORM)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // popup pdpa
  const [pdpaInitialDone, setPdpaInitialDone] = useState(false)   // ผ่าน popup แรกแล้ว
  const [showPdpaSubmit,  setShowPdpaSubmit]  = useState(false)   // แสดง popup ก่อนส่ง


  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── PDPA popup แรกเข้า ── */}
      {!pdpaInitialDone && (
        <PdpaModal
          mode="initial"
          onAccept={() => setPdpaInitialDone(true)}
          onDecline={() => {
            // ไม่ยินยอม → แจ้งเตือนและไม่ให้ใช้งาน
            alert('หากไม่ยินยอม PDPA จะไม่สามารถใช้บริการได้ กรุณาติดต่อเราโดยตรงที่ 02-123-4567')
          }}
        />
      )}

      {/* ── PDPA popup ก่อนส่ง ── */}
      {showPdpaSubmit && (
        <PdpaModal
          mode="submit"
          onAccept={handlePdpaSubmitAccept}
          onDecline={() => setShowPdpaSubmit(false)}
        />
      )}

      <Header />
      {page < 4 && <StepBar currentPage={page} />}

      <main className="max-w-4xl mx-auto px-4 py-6 pb-16">
        {page === 1 && (
          <Page1
            selectedServices={selectedServices}
            onToggleService={toggleService}
            startDate={startDate}
            endDate={endDate}
            alternateDays={alternateDays}
            onCalendarConfirm={handleCalendarConfirm}
            hoursIdx={hoursIdx}
            onHoursSelect={setHoursIdx}
            onNext={goToPage2}
          />
        )}

        {page === 2 && (
          <Page2
            formData={formData}
            onChange={(partial) => setFormData((prev) => ({ ...prev, ...partial }))}
            onNext={goToPage3}
            onBack={() => { setPage(1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          />
        )}

        {page === 3 && (
          <Page3
            selectedServices={selectedServices}
            startDate={startDate}
            endDate={endDate}
            alternateDays={alternateDays}
            hoursIdx={hoursIdx}
            formData={formData}
            onRemoveService={removeService}
            onSubmit={() => setShowPdpaSubmit(true)}
            onBack={() => { setPage(2); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          />
        )}

        {page === 4 && <Page4 onReset={resetAll} />}
      </main>
    </div>
  )
}

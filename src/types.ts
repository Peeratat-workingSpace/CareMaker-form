export interface Service {
  id: string
  icon: string        // FontAwesome class e.g. "fa-solid fa-syringe"
  name: string
  price: number       // baht per day (base)
  detail: string
}

export interface HoursOption {
  hrs: number
  label: string
  type: string
  ratePerDay: number
}

export interface FormData {
  contactName: string
  contactPhone: string
  gender: string
  age: string
  weight: string
  height: string
  nationality: string
  symptoms: string
  diseases: string
  address: string
  lat: string
  lng: string
  notes: string
}

export type Page = 1 | 2 | 3 | 4

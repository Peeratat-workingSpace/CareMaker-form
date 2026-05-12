import type { Service, HoursOption } from '../types'

export const SERVICES: Service[] = [
  { id:'tube',    icon:'fa-solid fa-prescription-bottle-medical', name:'การให้อาหารทางสายยาง',          price:500,  detail:'ให้อาหารเหลวผ่านสายยางที่สอดไว้ตามที่แพทย์กำหนด ดูแลความสะอาดและตรวจสอบตำแหน่งสาย' },
  { id:'skin',    icon:'fa-solid fa-head-side-cough',             name:'การดูแลเสมหะ',                  price:400,  detail:'ดูดเสมหะ ช่วยระบายเสมหะตามความจำเป็น ดูแลทางเดินหายใจให้โล่ง' },
  { id:'trach',   icon:'fa-solid fa-lungs',                       name:'การดูแลท่อช่วยหายใจ',           price:600,  detail:'ดูแลความสะอาดรอบท่อ เปลี่ยนผ้าก๊อส ตรวจสอบตำแหน่งท่อ ตามมาตรฐานทางการแพทย์' },
  { id:'cath',    icon:'fa-solid fa-droplet',                     name:'ดูแลสายปัสสาวะ',                price:350,  detail:'ดูแลสายสวนปัสสาวะ ทำความสะอาด บันทึกปริมาณปัสสาวะ ป้องกันการติดเชื้อ' },
  { id:'diaper',  icon:'fa-solid fa-pump-medical',                name:'การเปลี่ยนแผ่นพยาบาล/ผ้าอ้อม', price:300,  detail:'เปลี่ยนผ้าอ้อมผู้ใหญ่ ดูแลความสะอาดบริเวณผิวหนัง ป้องกันแผลกดทับ' },
  { id:'monitor', icon:'fa-solid fa-heart-pulse',                 name:'เฝ้าดูอาการ/สังเกตอาการ',      price:250,  detail:'เฝ้าดูอาการเปลี่ยนแปลง วัดสัญญาณชีพ บันทึก และรายงานแพทย์หากพบความผิดปกติ' },
  { id:'toilet',  icon:'fa-solid fa-restroom',                    name:'พาเข้าห้องน้ำ/ประคองร่างกาย',  price:200,  detail:'ช่วยพยุงร่างกาย พาเดินเข้าห้องน้ำอย่างปลอดภัย ป้องกันการพลัดตกหกล้ม' },
  { id:'bath1',   icon:'fa-solid fa-shower',                      name:'ช่วยอาบน้ำในห้องน้ำ',           price:300,  detail:'พยุงร่างกายขณะอาบน้ำในห้องน้ำ ดูแลความปลอดภัย ช่วยสระผมและทำความสะอาดร่างกาย' },
  { id:'bath2',   icon:'fa-solid fa-bath',                        name:'ช่วยอาบน้ำบนที่นอน',            price:400,  detail:'อาบน้ำเช็ดตัวบนเตียง เปลี่ยนผ้าปูที่นอน ดูแลผิวหนังและป้องกันแผลกดทับ' },
  { id:'feed',    icon:'fa-solid fa-utensils',                    name:'การป้อนอาหารทางปาก',            price:200,  detail:'ป้อนอาหารและน้ำดื่มให้ผู้ป่วยอย่างปลอดภัย ระวังการสำลัก บันทึกปริมาณที่รับประทาน' },
  { id:'o2',      icon:'fa-solid fa-mask-ventilator',             name:'การดูแลสายออกซิเจน',            price:350,  detail:'ตรวจสอบสายออกซิเจน ปรับอัตราการไหล ดูแลความสะอาดหน้ากากหรือสายจมูก' },
  { id:'clean',   icon:'fa-solid fa-broom',                       name:'ดูแลความสะอาดห้องพัก',          price:300,  detail:'ดูแลความสะอาดบริเวณที่พักของผู้ป่วย เปลี่ยนผ้าปู ทำความสะอาดอุปกรณ์ทางการแพทย์' },
]

export const HOURS_OPTIONS: HoursOption[] = [
  { hrs:8,  label:'8 ชั่วโมง/วัน',  type:'ไป-กลับ',      ratePerDay:1.0 },
  { hrs:12, label:'12 ชั่วโมง/วัน', type:'ไป-กลับ',      ratePerDay:1.4 },
  { hrs:24, label:'24 ชั่วโมง/วัน', type:'พักค้างคืน',  ratePerDay:2.2 },
]

export const TH_MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
                           'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม']

export const TH_DAYS_SHORT = ['อา','จ','อ','พ','พฤ','ศ','ส']

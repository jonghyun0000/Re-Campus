// 카테고리별 데모용 환경 절감량 추정치 (단위: kg)
// 본 수치는 발표용 데모 추정값이며 실제 LCA 분석값이 아님을 README/발표자료에 명시.
export const ECO_TABLE = {
  '전공책':   { wasteReductionKg: 0.8, carbonReductionKg: 1.2 },
  '의류':     { wasteReductionKg: 0.5, carbonReductionKg: 3.0 },
  '생활용품': { wasteReductionKg: 1.0, carbonReductionKg: 2.0 },
  '전자기기': { wasteReductionKg: 2.0, carbonReductionKg: 5.0 },
  '기타':     { wasteReductionKg: 0.7, carbonReductionKg: 1.0 },
}

export const CATEGORIES = ['전공책', '의류', '생활용품', '전자기기', '기타']
export const CONDITIONS = ['최상', '상', '중', '하']
export const STATUSES = [
  { key: 'available', label: '거래 가능', color: 'bg-brand-100 text-brand-700' },
  { key: 'reserved',  label: '예약중',    color: 'bg-amber-100 text-amber-700' },
  { key: 'completed', label: '거래 완료', color: 'bg-slate-200 text-slate-600' },
  { key: 'hidden',    label: '숨김',      color: 'bg-red-100 text-red-700' },
]
export const SCHOOLS = ['한림대학교', '강원대학교', '성심대학교', '연세대학교 미래캠퍼스']

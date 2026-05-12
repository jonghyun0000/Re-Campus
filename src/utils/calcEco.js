import { ECO_TABLE } from '../data/ecoTable.js'

export function getEcoByCategory(category) {
  return ECO_TABLE[category] || ECO_TABLE['기타']
}

// 거래가 완료된 아이템들로부터 총 절감량 합산
export function sumEco(items) {
  return items.reduce((acc, it) => {
    acc.waste  += Number(it.wasteReductionKg)  || 0
    acc.carbon += Number(it.carbonReductionKg) || 0
    return acc
  }, { waste: 0, carbon: 0 })
}

// 친근한 환산 문구
// 승용차 1km 주행 ≈ 0.21 kg CO2 / 소나무 1그루 연간 흡수 ≈ 6.6 kg CO2
export function friendlyCarbon(kg) {
  const km = (kg / 0.21)
  const trees = (kg / 6.6)
  return {
    km: Math.round(km),
    trees: Math.max(1, Math.round(trees * 10) / 10),
  }
}

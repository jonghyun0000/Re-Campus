export const formatPrice = (won, type) => {
  if (type === '나눔' || !won) return '나눔'
  return new Intl.NumberFormat('ko-KR').format(won) + '원'
}
export const formatKg = (n) => (Math.round((n || 0) * 10) / 10).toLocaleString('ko-KR') + ' kg'
export const formatCount = (n) => (n || 0).toLocaleString('ko-KR')
export const formatDate = (iso) => {
  if (!iso) return '-'
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`
}

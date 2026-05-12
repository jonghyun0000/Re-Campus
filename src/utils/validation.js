export function validateItem(form) {
  const errors = {}
  if (!form.title || form.title.trim().length < 2) errors.title = '제목을 2자 이상 입력해 주세요.'
  if (!form.category) errors.category = '카테고리를 선택해 주세요.'
  if (!form.condition) errors.condition = '상태를 선택해 주세요.'
  if (!form.transactionType) errors.transactionType = '거래 유형을 선택해 주세요.'
  if (form.transactionType === '저가거래') {
    const p = Number(form.price)
    if (!p || p < 0) errors.price = '저가거래 시 가격(0 초과)을 입력해 주세요.'
  }
  if (!form.description || form.description.trim().length < 5) errors.description = '설명을 5자 이상 입력해 주세요.'
  return errors
}

import { ECO_TABLE } from './ecoTable.js'

const today = new Date()
const daysAgo = (n) => {
  const d = new Date(today); d.setDate(d.getDate() - n); return d.toISOString()
}
const monthsAgo = (m, day = 10) => {
  const d = new Date(today.getFullYear(), today.getMonth() - m, day); return d.toISOString()
}

export const SEED_USERS = [
  { id: 'u1', name: '김재현', email: 'jaehyun@hallym.ac.kr',  school: '한림대학교', role: 'user',  verificationStatus: 'approved' },
  { id: 'u2', name: '이서연', email: 'seoyeon@kangwon.ac.kr', school: '강원대학교', role: 'user',  verificationStatus: 'approved' },
  { id: 'u3', name: '박민준', email: 'minjun@hallym.ac.kr',   school: '한림대학교', role: 'user',  verificationStatus: 'pending'  },
  { id: 'u4', name: '정수아', email: 'sua@sungsim.ac.kr',     school: '성심대학교', role: 'user',  verificationStatus: 'approved' },
  { id: 'u5', name: '최도윤', email: 'doyun@yonsei.ac.kr',    school: '연세대학교 미래캠퍼스', role: 'user', verificationStatus: 'pending' },
  { id: 'admin', name: '관리자', email: 'admin@recampus.io',  school: '한림대학교', role: 'admin', verificationStatus: 'approved' },
]

const mk = (id, userId, title, desc, category, condition, transactionType, price, imageUrl, status, createdAt, completedAt = null) => ({
  id, userId, title, description: desc, category, condition, transactionType, price, imageUrl, status,
  wasteReductionKg: ECO_TABLE[category].wasteReductionKg,
  carbonReductionKg: ECO_TABLE[category].carbonReductionKg,
  createdAt, completedAt,
})

export const SEED_ITEMS = [
  mk('i1','u1','경영학원론 7판','거의 새 책. 형광펜 자국 약간.','전공책','상','저가거래',8000,
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600','completed', daysAgo(40), daysAgo(35)),
  mk('i2','u2','겨울 패딩 (블랙, 95)','한 시즌 착용. 클리닝 완료.','의류','상','저가거래',25000,
    'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600','available', daysAgo(3)),
  mk('i3','u1','스탠드 조명','책상용 LED 스탠드. 정상 작동.','생활용품','중','나눔',0,
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600','available', daysAgo(5)),
  mk('i4','u4','아이패드 7세대 (32GB)','케이스 포함. 액정 깨끗.','전자기기','중','저가거래',180000,
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600','reserved', daysAgo(2)),
  mk('i5','u2','자료구조와 알고리즘','필기 거의 없음.','전공책','최상','저가거래',12000,
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600','completed', monthsAgo(1, 5), monthsAgo(1, 8)),
  mk('i6','u4','전기포트','자취방에서 사용. 깨끗함.','생활용품','상','나눔',0,
    'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600','completed', monthsAgo(2, 10), monthsAgo(2, 14)),
  mk('i7','u1','후드티 (네이비, L)','보풀 없음. 깔끔.','의류','상','저가거래',5000,
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600','completed', monthsAgo(3, 7), monthsAgo(3, 9)),
  mk('i8','u5','블루투스 키보드','로지텍. 배터리 양호.','전자기기','상','저가거래',15000,
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600','available', daysAgo(7)),
  mk('i9','u2','선풍기 (탁상용)','여름 한정 사용.','생활용품','중','나눔',0,
    'https://images.unsplash.com/photo-1527788263495-3518a5c1c42d?w=600','completed', monthsAgo(4, 12), monthsAgo(4, 15)),
  mk('i10','u4','일반화학 8판','강의 교재. 줄긋기 있음.','전공책','중','저가거래',6000,
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600','available', daysAgo(1)),
  mk('i11','u1','무선 마우스','정상 작동. USB 동글 포함.','전자기기','상','저가거래',7000,
    'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600','completed', monthsAgo(5, 18), monthsAgo(5, 22)),
  mk('i12','u5','니트 (오트밀, M)','보풀 약간.','의류','중','나눔',0,
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600','available', daysAgo(10)),
]

export const SEED_REQUESTS = [
  { id: 'r1', itemId: 'i1', requesterId: 'u2', ownerId: 'u1', status: 'completed', createdAt: daysAgo(38) },
  { id: 'r2', itemId: 'i5', requesterId: 'u1', ownerId: 'u2', status: 'completed', createdAt: monthsAgo(1, 6) },
  { id: 'r3', itemId: 'i4', requesterId: 'u3', ownerId: 'u4', status: 'accepted',  createdAt: daysAgo(1) },
  { id: 'r4', itemId: 'i7', requesterId: 'u4', ownerId: 'u1', status: 'completed', createdAt: monthsAgo(3, 8) },
  { id: 'r5', itemId: 'i6', requesterId: 'u2', ownerId: 'u4', status: 'completed', createdAt: monthsAgo(2, 11) },
  { id: 'r6', itemId: 'i9', requesterId: 'u1', ownerId: 'u2', status: 'completed', createdAt: monthsAgo(4, 13) },
  { id: 'r7', itemId: 'i11',requesterId: 'u4', ownerId: 'u1', status: 'completed', createdAt: monthsAgo(5, 20) },
]

export const SEED_VERSION = 'v1.0.0'

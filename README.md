# 🌱 Re:Campus — 캠퍼스 자원 순환 데이터 플랫폼

> 버려지는 캠퍼스 자원을 학생 간 재사용으로 연결하고, 거래 결과를 **탄소 절감량·폐기물 감소량 데이터로 증명하는 학교 ESG 플랫폼**

---

## 1. 프로젝트명
**Re:Campus** (Re + Campus + Recycle)

## 2. 한 줄 소개
캠퍼스 안에서 버려지는 전공책·의류·생활용품·전자기기를 학생 간 재사용하도록 연결하고,
거래 결과를 **탄소 절감량·폐기물 감소량 데이터**로 시각화하는 **캠퍼스 ESG 데이터 플랫폼**.

## 3. 프로젝트 배경
대학에는 매 학기마다 막대한 양의 전공책·의류·생활용품·전자기기가 버려진다.
기존 중고거래 앱은 캠퍼스 단위 활동을 측정·시각화하지 못하고, 학교 ESG 성과로 환산되지도 않는다.
**Re:Campus**는 "거래"가 곧 "환경 데이터"가 되도록 설계해, 학교의 자원 순환 성과를 정량적으로 보여준다.

## 4. 핵심 기능
- **데모 로그인 / 사용자 전환** — 발표 시연용 무비밀번호 전환
- **물품 등록 / 둘러보기 / 상세 / 수령 신청 / 거래 완료** — 전체 거래 라이프사이클
- **카테고리·상태·거래유형 필터 + 검색**
- **카테고리 선택 시 환경 절감량 자동 미리보기**
- **마이페이지** — 등록·신청·기여량
- **데이터 대시보드** — 누적 지표 / 학교별·카테고리별·월별 통계 / 친근한 환산 문구
- **관리자 페이지** — 학교 인증 승인/대기, 게시물 숨김 처리, 데이터 초기화

## 5. 기술 스택
- **Framework**: React 18 + Vite 5
- **Routing**: React Router v6
- **Styling**: Tailwind CSS 3 (커스텀 brand 그린 팔레트)
- **Charts**: Recharts
- **State / Persistence**: React Hooks + `localStorage` (외부 백엔드 없음)
- **Polyfill / Font**: Pretendard

## 6. 파일 구조
```
recampus/
├─ public/favicon.svg
├─ src/
│  ├─ assets/
│  ├─ components/  (Navbar, Footer, ItemCard, StatCard, ChartCard, Modal, EmptyState, Toast)
│  ├─ pages/       (Home, Items, ItemDetail, NewItem, MyPage, Dashboard, Admin, Login)
│  ├─ data/        (seedData.js, ecoTable.js)
│  ├─ utils/       (storage.js, calcEco.js, format.js, validation.js)
│  ├─ hooks/useLocalStorage.js
│  ├─ App.jsx · main.jsx · index.css
├─ docs/  (발표대본.md, 시연영상_스크립트.md, 프로젝트_설명서.md, 요구사항_정리.md)
├─ README.md, package.json, vite.config.js, tailwind.config.js, postcss.config.js, index.html
```

## 7. 실행 방법
```bash
# 1) 의존성 설치
npm install

# 2) 개발 서버
npm run dev
# → http://localhost:5173

# 3) 프로덕션 빌드
npm run build && npm run preview
```
> Node.js 18+ 권장. 첫 실행 시 시드 데이터가 자동으로 `localStorage`에 적재됩니다.

## 8. 주요 화면 설명
| 화면 | 설명 |
|---|---|
| **Home** | 한 줄 정의 + 누적 지표 4종 + 임팩트 환산 카드 + CTA |
| **Items** | 카드 리스트 + 검색/카테고리/상태/거래유형 필터 |
| **ItemDetail** | 이미지·정보·예상 절감량 + 수령 신청 / 신청자 관리 / 거래 완료 |
| **NewItem** | 폼 + 이미지 업로드·URL + **카테고리 선택 즉시 환경 절감량 자동 미리보기** |
| **MyPage** | 내 등록/신청/완료 + 개인 탄소·폐기물 기여량 |
| **Dashboard** | 누적 지표 / 학교별·카테고리별·월별 차트 / 카테고리 상세 테이블 |
| **Admin** | 사용자 인증 변경 / 게시물 숨김 / 데이터 초기화 |
| **Login** | 데모 사용자 카드 선택형 로그인 |

## 9. 데이터 구조
```js
users:    { id, name, email, school, role: 'user'|'admin', verificationStatus: 'approved'|'pending' }
items:    { id, userId, title, description, category, condition, transactionType: '나눔'|'저가거래',
            price, imageUrl, status: 'available'|'reserved'|'completed'|'hidden',
            wasteReductionKg, carbonReductionKg, createdAt, completedAt }
requests: { id, itemId, requesterId, ownerId, status: 'pending'|'accepted'|'rejected'|'completed', createdAt }
```

## 10. 환경 절감량 계산 방식
거래가 **completed** 상태가 되는 순간 해당 아이템의 `wasteReductionKg`, `carbonReductionKg`가
학교/카테고리/월 단위로 합산되어 대시보드에 반영된다.

| 카테고리 | 폐기물 감소량 (kg) | 탄소 절감량 (kg) |
|---|---|---|
| 전공책 | 0.8 | 1.2 |
| 의류 | 0.5 | 3.0 |
| 생활용품 | 1.0 | 2.0 |
| 전자기기 | 2.0 | 5.0 |
| 기타 | 0.7 | 1.0 |

**친근한 환산**
- 승용차 1km 주행 ≈ 0.21 kg CO₂
- 소나무 1그루 연간 흡수 ≈ 6.6 kg CO₂

> ⚠️ 본 수치는 **데모용 추정값**이며, 실제 LCA(전과정 평가) 분석값이 아닙니다.

## 11. 평가 기준별 어필 포인트
| 항목(20점) | 어필 포인트 |
|---|---|
| **창의성** | 중고거래가 아니라 **거래 = 환경 데이터**로 전환되는 ESG 데이터 플랫폼 컨셉. 임팩트 환산 문구(소나무·승용차)로 체감 가능한 가치 제시 |
| **기술 적용도** | React 컴포넌트화 / React Router / localStorage CRUD / 검색·다중 필터 / Recharts 시각화 / 재사용 유틸·훅·시드 데이터 / 반응형 |
| **UI 설계** | 그린 ESG 브랜드 시스템, 카드/칩/모달/토스트/빈 상태 일관된 디자인, 홈→상세→완료→대시보드 흐름 명확 |
| **완성도** | npm install 후 즉시 실행, 새로고침 데이터 유지, 데이터 초기화 버튼, 빈 상태/검증 처리, 시드 12개 물품으로 풍부한 시연 |
| **동영상·발표** | docs에 2분 시연 스크립트, 5분 발표 대본 포함 — 발표자가 그대로 읽어도 자연스러움 |

## 12. 시연 영상 순서 (2분)
1. **0:00–0:15** 홈 화면 — 컨셉·누적 지표·임팩트 카드
2. **0:15–0:35** 둘러보기 — 검색·카테고리·상태 필터
3. **0:35–1:00** 물품 등록 — 카테고리 선택 → 환경 절감량 자동 미리보기
4. **1:00–1:20** 수령 신청 → 등록자 전환 → 거래 완료
5. **1:20–1:40** 대시보드 — 학교/카테고리/월별 차트 반영
6. **1:40–2:00** 관리자 페이지 — 인증·숨김·초기화

## 13. 향후 개선 방향
- Supabase 등 실제 백엔드 연동 (멀티 디바이스 동기화)
- 학교 메일 인증 자동화 (`@hallym.ac.kr` 도메인 검증)
- LCA(전과정 평가) 기반 카테고리별 실측 계수 적용
- 캠퍼스 GS / 학생회 ESG 대시보드 연동
- 푸시 알림 (수령 신청 / 거래 완료)
- 학교별 리더보드, 학기별 ESG 리포트 PDF 자동 생성

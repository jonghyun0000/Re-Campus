export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6 text-sm">
        <div>
          <div className="font-extrabold text-slate-900">Re:Campus</div>
          <p className="muted mt-1">캠퍼스 안에서 버려지는 자원을 학생 간 재사용하도록 연결하고, 거래 결과를 환경 데이터로 시각화하는 학교 ESG 플랫폼.</p>
        </div>
        <div>
          <div className="font-bold text-slate-800 mb-2">데이터 안내</div>
          <ul className="space-y-1 muted">
            <li>환경 절감량은 데모용 추정값입니다.</li>
            <li>거래 완료된 물품 기준으로 합산됩니다.</li>
            <li>localStorage 기반으로 동작합니다.</li>
          </ul>
        </div>
        <div>
          <div className="font-bold text-slate-800 mb-2">팀</div>
          <p className="muted">대학 웹 프로젝트 / 2026 · Re:Campus Team</p>
        </div>
      </div>
      <div className="text-center text-xs muted pb-6">© 2026 Re:Campus — Campus Resource Circulation Data Platform</div>
    </footer>
  )
}

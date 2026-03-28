import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function PhoneFrame({ children }: Props) {
  return (
    <div className="min-h-svh flex items-center justify-center" style={{ background: '#f0f0f0' }}>
      {/* 폰 외곽 */}
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: 390,
          height: 844,
          borderRadius: 54,
          background: '#fff',
          boxShadow: '0 0 0 2px #d1d5db, 0 0 0 10px #9ca3af, 0 30px 80px rgba(0,0,0,0.35)',
        }}
      >
        {/* 다이나믹 아일랜드 */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50">
          <div
            className="flex items-center gap-1.5 px-3"
            style={{
              background: '#000',
              borderRadius: 20,
              height: 34,
              minWidth: 120,
            }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-gray-800" />
            <div className="w-3.5 h-3.5 rounded-full bg-gray-800 border-2 border-gray-700" />
          </div>
        </div>

        {/* 상단 버튼 (볼륨) */}
        <div className="absolute left-0 top-28 flex flex-col gap-2.5" style={{ marginLeft: -3 }}>
          {[40, 40].map((h, i) => (
            <div key={i} className="w-1 rounded-r" style={{ height: h, background: '#9ca3af' }} />
          ))}
        </div>
        {/* 전원 버튼 */}
        <div className="absolute right-0 top-36" style={{ marginRight: -3 }}>
          <div className="w-1 rounded-l" style={{ height: 60, background: '#9ca3af' }} />
        </div>

        {/* 앱 콘텐츠 */}
        <div className="flex-1 overflow-hidden flex flex-col" style={{ paddingTop: 12 }}>
          {children}
        </div>

        {/* 홈 인디케이터 */}
        <div className="flex justify-center pb-2 shrink-0">
          <div className="w-32 h-1 rounded-full bg-gray-300" />
        </div>
      </div>
    </div>
  )
}

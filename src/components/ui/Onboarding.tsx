import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onDone: () => void
}

const slides = [
  { emoji: '🏗️', title: '미루면 집이 지어집니다', desc: '할일을 미룰 때마다 건물의 한 층이 올라가요.\n중요한 일을 미룰수록 더 멋진 층이 생겨요.' },
  { emoji: '⭐', title: '중요도 1~5단계', desc: '할일마다 중요도를 설정하세요.\n5단계 일을 미루면 황금 펜트하우스가 생겨요.' },
  { emoji: '⚠️', title: '균형을 맞춰야 해요', desc: '사소한 일만 미루면 건물이 위태로워져요.\n중요한 일도 적절히 미뤄야 집이 튼튼해져요.' },
  { emoji: '🔥', title: '매일 미루세요', desc: '매일 꾸준히 일을 미루면 스트릭이 쌓여요.\n하루도 빠지지 말고 미루세요.' },
]

export default function Onboarding({ onDone }: Props) {
  const [page, setPage] = useState(0)
  const isLast = page === slides.length - 1

  return (
    <div className="min-h-svh bg-white flex flex-col items-center justify-between px-6 py-16 max-w-sm mx-auto">
      {/* 인디케이터 */}
      <div className="flex gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === page ? 24 : 6,
              background: i === page ? 'var(--theme-text)' : 'var(--theme-point)',
            }}
          />
        ))}
      </div>

      {/* 슬라이드 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center text-center"
        >
          <div className="text-8xl mb-8">{slides[page].emoji}</div>
          <h2 className="font-bold text-2xl mb-4 leading-tight text-gray-800">{slides[page].title}</h2>
          <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{slides[page].desc}</p>
        </motion.div>
      </AnimatePresence>

      {/* 버튼 */}
      <div className="w-full flex flex-col gap-3">
        <button
          onClick={() => isLast ? onDone() : setPage((p) => p + 1)}
          className="w-full text-white font-bold py-4 rounded-2xl text-sm active:scale-95 transition-transform"
          style={{ background: 'var(--theme-text)' }}
        >
          {isLast ? '시작하기 🚀' : '다음'}
        </button>
        {!isLast && (
          <button onClick={onDone} className="text-sm py-2" style={{ color: 'var(--theme-point)' }}>
            건너뛰기
          </button>
        )}
      </div>
    </div>
  )
}

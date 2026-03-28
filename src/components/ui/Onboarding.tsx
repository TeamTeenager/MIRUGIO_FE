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
    <div className="h-full bg-white flex flex-col items-center justify-between px-8 py-16 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-rose-50 rounded-full blur-3xl opacity-50" />

      {/* 인디케이터 */}
      <div className="flex gap-1.5 z-10">
        {slides.map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: i === page ? 32 : 8,
              background: i === page ? '#111827' : '#f3f4f6',
            }}
          />
        ))}
      </div>

      {/* 슬라이드 */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="flex flex-col items-center text-center max-w-[280px]"
          >
            <div className="text-9xl mb-12 drop-shadow-2xl filter saturate-[1.2]">{slides[page].emoji}</div>
            <h2 className="font-black text-3xl mb-5 leading-tight text-gray-900 tracking-tight">
              {slides[page].title}
            </h2>
            <p className="text-gray-400 text-[13px] font-medium leading-relaxed whitespace-pre-line">
              {slides[page].desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 버튼 */}
      <div className="w-full flex flex-col gap-4 z-10">
        <button
          onClick={() => isLast ? onDone() : setPage((p) => p + 1)}
          className="w-full bg-gray-900 text-white font-black py-5 rounded-3xl text-[15px] shadow-2xl shadow-gray-200 active:scale-95 transition-all"
        >
          {isLast ? 'BUILD NOW 🏗️' : 'NEXT'}
        </button>
        {!isLast && (
          <button 
            onClick={onDone} 
            className="text-[11px] font-black py-2 text-gray-300 uppercase tracking-widest hover:text-gray-400 transition-colors"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  )
}

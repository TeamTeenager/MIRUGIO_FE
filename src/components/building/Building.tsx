import { motion, useAnimate, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { useGameStore } from '../../store/useGameStore'
import { supabase } from '../../lib/supabase'
import Floor from './Floor'
import ConstructionAnim from './ConstructionAnim'
import type { Importance } from '../../types'

export default function Building() {
  const { floors, isCollapsed, resetBuilding, pendingAnimation, clearPendingAnimation, userId } = useGameStore()

  const handleDevReset = async () => {
    if (userId) {
      await Promise.all([
        supabase.from('floors').delete().eq('user_id', userId),
        supabase.from('tasks').delete().eq('user_id', userId),
      ])
    }
    resetBuilding()
  }
  const [scope, animate] = useAnimate()

  useEffect(() => {
    if (pendingAnimation !== null) {
      const t = setTimeout(() => clearPendingAnimation(), 5500)
      return () => clearTimeout(t)
    }
  }, [pendingAnimation])

  useEffect(() => {
    if (isCollapsed && scope.current) {
      animate(scope.current, {
        rotate: [0, -3, 3, -5, 5, -2, 2, 0, 15, -15, 30, 90],
        x: [0, -10, 10, -15, 15, -5, 5, 0, 20, -30, 60, 200],
        opacity: [1, 1, 1, 1, 1, 1, 1, 1, 0.8, 0.5, 0.2, 0],
      }, { duration: 1.5, ease: 'easeIn' })
    }
  }, [isCollapsed])

  return (
    <div className="flex flex-col items-center w-full">
      {/* 건물 */}
      <div className="w-full max-w-xs relative" ref={scope}>
        <ConstructionAnim importance={pendingAnimation as Importance | null} />
        {floors.length === 0 ? (
          <div className="w-full flex flex-col items-center">
            {/* 공사 안내판 */}
            <div className="mb-3 flex flex-col items-center">
              <div
                className="px-4 py-2 rounded-lg text-center shadow-sm border-2"
                style={{ background: '#fffde7', borderColor: '#f59e0b' }}
              >
                <p className="text-xs font-black text-yellow-600 tracking-widest">🚧 건설 예정지 🚧</p>
                <p className="text-xs text-yellow-500 mt-0.5">할일을 미루면 집이 지어집니다</p>
              </div>
              {/* 안내판 기둥 */}
              <div className="w-1 h-4 bg-yellow-400" />
            </div>

            {/* 땅 */}
            <div className="w-full relative overflow-hidden rounded-lg" style={{ height: 64, background: '#d4b896' }}>
              {/* 흙 질감 */}
              <div className="absolute inset-0 opacity-30"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, #b8976a 0px, #b8976a 2px, transparent 2px, transparent 8px)' }}
              />
              {/* 말뚝들 */}
              {[10, 30, 50, 70, 90].map((left) => (
                <div key={left} className="absolute bottom-0 flex flex-col items-center" style={{ left: `${left}%` }}>
                  <div className="w-0 h-0" style={{ borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderBottom: '6px solid #ef4444' }} />
                  <div className="w-1 bg-amber-800" style={{ height: 20 }} />
                </div>
              ))}
              {/* 줄 */}
              <div className="absolute w-full" style={{ top: 18 }}>
                <svg width="100%" height="8">
                  <line x1="10%" y1="4" x2="90%" y2="4" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col-reverse w-full">
            <AnimatePresence>
              {floors.map((floor, i) => (
                <Floor key={floor.id} floor={floor} index={i} />
              ))}
            </AnimatePresence>
          </div>
        )}
        <div className="w-full h-3 rounded-b" style={{ background: 'var(--theme-point)' }} />
      </div>

      {/* 붕괴 후 리셋 */}
      {isCollapsed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="mt-6 text-center"
        >
          <p className="font-bold mb-3 text-red-400">🏚️ 건물이 무너졌습니다...</p>
          <button
            onClick={resetBuilding}
            className="font-bold px-6 py-2 rounded-full text-sm text-white"
            style={{ background: 'var(--theme-text)' }}
          >
            다시 시작
          </button>
        </motion.div>
      )}

      {/* 개발용 초기화 버튼 */}
      <button
        onClick={handleDevReset}
        className="mt-6 text-xs text-gray-300 underline"
      >
        [DEV] 초기화
      </button>
    </div>
  )
}

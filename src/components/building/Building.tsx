import { motion, useAnimate, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { useGameStore } from '../../store/useGameStore'
import { supabase } from '../../lib/supabase'
import Floor from './Floor'

export default function Building() {
  const { floors, isCollapsed, resetBuilding, pendingAnimation, clearPendingAnimation, pendingComplete, clearPendingComplete, completeTask, userId } = useGameStore()

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
    if (pendingComplete !== null) {
      const t = setTimeout(() => {
        completeTask(pendingComplete)
        clearPendingComplete()
      }, 500)
      return () => clearTimeout(t)
    }
  }, [pendingComplete])

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
      <div className="w-full max-w-[280px] relative" ref={scope}>
        {floors.length === 0 ? (
          <div className="w-full flex flex-col items-center py-12">
            {/* 공사 안내판 */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mb-6 flex flex-col items-center"
            >
              <div
                className="px-6 py-3 rounded-[20px] text-center shadow-xl border border-amber-100 bg-white"
              >
                <div className="flex items-center gap-2 justify-center mb-1">
                  <span className="text-sm animate-pulse">🚧</span>
                  <p className="text-[10px] font-black text-amber-500 tracking-[0.2em] uppercase">Construction Site</p>
                </div>
                <p className="text-xs font-bold text-gray-400">할일을 미루면 집이 지어집니다</p>
              </div>
              {/* 안내판 기둥 */}
              <div className="w-1.5 h-6 bg-gray-100 rounded-b-full shadow-inner" />
            </motion.div>

            {/* 땅 */}
            <div className="w-full relative overflow-hidden rounded-[32px] shadow-2xl shadow-gray-200/50" style={{ height: 80, background: '#f1f3f5' }}>
              <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0px, #000 1px, transparent 1px, transparent 10px)' }}
              />
              {/* 말뚝들 */}
              {[20, 40, 60, 80].map((left) => (
                <div key={left} className="absolute bottom-0 flex flex-col items-center" style={{ left: `${left}%` }}>
                  <div className="w-2 h-2 rounded-full bg-rose-500 mb-1 shadow-lg shadow-rose-200" />
                  <div className="w-1 bg-gray-200" style={{ height: 24 }} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col-reverse w-full shadow-2xl shadow-gray-200/40">
            <AnimatePresence>
              {floors.map((floor, i) => (
                <Floor
                  key={floor.id}
                  floor={floor}
                  index={i}
                  isNew={pendingAnimation !== null && i === floors.length - 1}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
        <div className="w-full h-5 rounded-b-[32px] bg-gray-900 shadow-xl" />
      </div>

      {/* 붕괴 후 리셋 */}
      {isCollapsed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="mt-12 text-center"
        >
          <div className="bg-white rounded-3xl p-6 shadow-2xl border border-red-50 inline-block">
            <p className="font-black text-gray-900 mb-4 tracking-tight">🏚️ 건물이 무너졌습니다...</p>
            <button
              onClick={resetBuilding}
              className="font-black px-8 py-3 rounded-2xl text-xs text-white bg-gray-900 shadow-lg shadow-gray-200 active:scale-95 transition-transform"
            >
              처음부터 다시 쌓기
            </button>
          </div>
        </motion.div>
      )}

      {/* 개발용 초기화 버튼 */}
      <button
        onClick={handleDevReset}
        className="mt-12 text-[10px] font-bold text-gray-300 uppercase tracking-widest hover:text-gray-400 transition-colors"
      >
        [Dev] Clear All Data
      </button>
    </div>
  )
}

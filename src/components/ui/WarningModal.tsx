import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'

export default function WarningModal() {
  const { showWarning, warningType, dismissWarning } = useGameStore()

  const isStability = warningType === 'stability'

  return (
    <AnimatePresence>
      {showWarning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl border border-white/20"
          >
            <div className="text-6xl mb-4 drop-shadow-lg">
              {isStability ? '⚠️' : '🧱'}
            </div>
            <h2 className="font-black text-2xl mb-3 text-gray-900 tracking-tight">
              {isStability ? '건물이 위태롭습니다!' : '단조로운 건축 양식!'}
            </h2>
            
            <div className="space-y-2 mb-8">
              <p className="text-gray-600 text-sm leading-relaxed">
                {isStability 
                  ? '너무 사소한 일만 미루고 있어요.' 
                  : '똑같은 중요도의 층이 계속 쌓이고 있습니다.'}
              </p>
              <p className="font-bold text-base text-red-500">
                {isStability
                  ? '지금 당장 중요도 4단계 이상의 일을 미뤄야 합니다!'
                  : '분위기 전환을 위해 다른 중요도의 일을 미뤄보세요!'}
              </p>
              <p className="text-gray-400 text-xs">
                {isStability
                  ? '계속 낮은 중요도 일을 미루면 건물이 무너집니다.'
                  : '다양한 층을 쌓아야 건물이 더 견고해집니다.'}
              </p>
            </div>

            <button
              onClick={dismissWarning}
              className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
            >
              알겠습니다
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

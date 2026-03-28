import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'

export default function WarningModal() {
  const { showWarning, dismissWarning } = useGameStore()

  return (
    <AnimatePresence>
      {showWarning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-6"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-xl"
            style={{ border: '2px solid #fca5a5' }}
          >
            <div className="text-5xl mb-3">⚠️</div>
            <h2 className="font-bold text-xl mb-2 text-gray-800">건물이 위태롭습니다!</h2>
            <p className="text-gray-500 text-sm mb-2">너무 사소한 일만 미루고 있어요.</p>
            <p className="font-bold text-sm mb-6 text-red-400">
              지금 당장 중요도 4단계 이상의 일을 미뤄야 합니다!
            </p>
            <p className="text-gray-300 text-xs mb-4">계속 낮은 중요도 일을 미루면 건물이 무너집니다.</p>
            <button
              onClick={dismissWarning}
              className="w-full text-white font-bold py-3 rounded-xl"
              style={{ background: '#fca5a5' }}
            >
              알겠습니다
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

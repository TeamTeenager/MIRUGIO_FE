import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'
import type { Importance } from '../../types'

interface Props {
  open: boolean
  onClose: () => void
}

const importanceLabels: Record<Importance, { label: string; desc: string; color: string }> = {
  1: { label: '1단계', desc: '별로 안 중요함', color: 'bg-gray-600' },
  2: { label: '2단계', desc: '조금 중요함', color: 'bg-stone-500' },
  3: { label: '3단계', desc: '꽤 중요함', color: 'bg-blue-600' },
  4: { label: '4단계', desc: '많이 중요함', color: 'bg-purple-600' },
  5: { label: '5단계', desc: '매우 중요함', color: 'bg-yellow-500' },
}

export default function AddTaskModal({ open, onClose }: Props) {
  const addTask = useGameStore((s) => s.addTask)
  const [title, setTitle] = useState('')
  const [importance, setImportance] = useState<Importance>(3)

  const handleSubmit = () => {
    if (!title.trim()) return
    addTask(title.trim(), importance)
    setTitle('')
    setImportance(3)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-50 flex items-end"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full bg-neutral-900 rounded-t-2xl p-6 pb-10"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-white font-bold text-lg mb-4">미룰 일 추가</h2>

            <input
              autoFocus
              type="text"
              placeholder="무슨 일을 미룰건가요?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full bg-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-white/30 outline-none mb-4"
            />

            <p className="text-white/50 text-xs mb-2">중요도 선택</p>
            <div className="flex gap-2 mb-6">
              {([1, 2, 3, 4, 5] as Importance[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setImportance(level)}
                  className={`
                    flex-1 py-3 rounded-xl text-white text-sm font-bold transition-all
                    ${importanceLabels[level].color}
                    ${importance === level ? 'ring-2 ring-white scale-105' : 'opacity-50'}
                  `}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="text-center text-white/40 text-xs mb-4">
              {importanceLabels[importance].desc}
            </p>

            <button
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="w-full bg-white text-black font-bold py-3 rounded-xl disabled:opacity-30"
            >
              추가하기
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

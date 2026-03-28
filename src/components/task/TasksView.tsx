import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'
import type { Importance } from '../../types'
const importanceConfig: Record<Importance, { bg: string; border: string; label: string }> = {
  1: { bg: '#e5e7eb', border: '#d1d5db', label: '별로 안 중요함' },
  2: { bg: '#fde68a', border: '#fbbf24', label: '조금 중요함' },
  3: { bg: '#93c5fd', border: '#60a5fa', label: '꽤 중요함' },
  4: { bg: '#c4b5fd', border: '#a78bfa', label: '많이 중요함' },
  5: { bg: '#fef9c3', border: '#f59e0b', label: '매우 중요함' },
}

export default function TasksView() {
  const { tasks, addTask, startComplete, showWarning } = useGameStore()
  const [title, setTitle] = useState('')
  const [importance, setImportance] = useState<Importance>(3)

  const done = [...tasks].filter((t) => t.status === 'procrastinated').reverse()
  const isBlocked = showWarning && importance < 4
  const hasAddedToday = false // 테스트 중 비활성화 (lastProcrastinatedDate === new Date().toDateString())

  const handleAdd = () => {
    if (!title.trim()) return
    addTask(title.trim(), importance)
    setTitle('')
  }

  return (
    <div className="flex-1 overflow-y-auto px-5 pt-6 pb-4">
      {/* 경고 배너 */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl px-4 py-3 mb-4 text-sm font-medium"
            style={{ background: '#fef2f2', color: '#f87171', border: '1px solid #fca5a5' }}
          >
            ⚠️ 중요도 4단계 이상의 일만 등록할 수 있어요
          </motion.div>
        )}
      </AnimatePresence>

      {/* 오늘 이미 등록한 경우 */}
      {hasAddedToday && (
        <div className="rounded-2xl p-5 mb-6 text-center" style={{ background: 'var(--theme-point)' }}>
          <div className="text-4xl mb-2">🏗️</div>
          <p className="font-bold text-gray-700 text-sm">오늘의 층은 이미 쌓았어요!</p>
          <p className="text-gray-400 text-xs mt-1">내일 다시 미룰 수 있어요</p>
        </div>
      )}

      {/* 등록 폼 */}
      {!hasAddedToday && <div className="rounded-2xl p-4 mb-6" style={{ background: 'var(--theme-point)' }}>
        <h2 className="font-bold text-base mb-3 text-gray-700">미룰 일 등록</h2>

        <input
          type="text"
          placeholder="무슨 일을 미룰건가요?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="w-full bg-white rounded-xl px-4 py-3 text-sm placeholder-gray-300 outline-none mb-3 text-gray-700"
          style={{ border: '1.5px solid', borderColor: 'var(--theme-text)' }}
        />

        <p className="text-xs mb-2" style={{ color: 'var(--theme-text)' }}>중요도</p>
        <div className="flex gap-2 mb-1">
          {([1, 2, 3, 4, 5] as Importance[]).map((level) => {
            const blocked = showWarning && level < 4
            return (
              <button
                key={level}
                onClick={() => !blocked && setImportance(level)}
                disabled={blocked}
                className="flex-1 py-2.5 rounded-xl text-gray-700 text-sm font-bold transition-all"
                style={{
                  background: importanceConfig[level].bg,
                  border: `2px solid ${importance === level ? importanceConfig[level].border : 'transparent'}`,
                  opacity: blocked ? 0.3 : importance === level ? 1 : 0.6,
                  transform: importance === level ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <span className="text-base font-black text-gray-600">{level}</span>
              </button>
            )
          })}
        </div>
        <p className="text-xs text-center mb-3" style={{ color: 'var(--theme-text)' }}>
          {importanceConfig[importance].label}
        </p>

        <button
          onClick={handleAdd}
          disabled={!title.trim() || isBlocked}
          className="w-full text-white font-bold py-3 rounded-xl text-sm disabled:opacity-30 active:scale-95 transition-transform"
          style={{ background: 'var(--theme-text)' }}
        >
          등록하면 바로 미루기 🏗️
        </button>
      </div>}


      {/* 미룬 기록 */}
      {done.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold mb-2 uppercase tracking-wider text-gray-300">
            미룬 기록 ({done.length})
          </h3>
          <div className="flex flex-col gap-2">
            {done.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ background: 'var(--theme-point)' }}
              >
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-black text-gray-600"
                  style={{ background: importanceConfig[task.importance].bg }}
                >
                  {task.importance}
                </span>
                <span className="text-gray-600 text-sm flex-1 truncate">{task.title}</span>
                <button
                  onClick={() => startComplete(task.id)}
                  className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold text-white active:scale-95 transition-transform"
                  style={{ background: '#fca5a5' }}
                >
                  했음
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

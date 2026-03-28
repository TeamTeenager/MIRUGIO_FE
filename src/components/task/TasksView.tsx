import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'
import type { Importance } from '../../types'
const importanceConfig: Record<Importance, { bg: string; text: string; label: string }> = {
  1: { bg: 'bg-slate-100', text: 'text-slate-600', label: '별로 안 중요함' },
  2: { bg: 'bg-amber-100', text: 'text-amber-700', label: '조금 중요함' },
  3: { bg: 'bg-blue-100', text: 'text-blue-700', label: '꽤 중요함' },
  4: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: '많이 중요함' },
  5: { bg: 'bg-rose-100', text: 'text-rose-700', label: '매우 중요함' },
}

export default function TasksView() {
  const { tasks, addTask, startComplete, showWarning, warningType } = useGameStore()
  const [title, setTitle] = useState('')
  const [importance, setImportance] = useState<Importance>(3)

  const done = [...tasks].filter((t) => t.status === 'procrastinated').reverse()
  const isStabilityWarning = showWarning && warningType === 'stability'
  const isBlocked = isStabilityWarning && importance < 4

  const handleAdd = () => {
    if (!title.trim() || isBlocked) return
    addTask(title.trim(), importance)
    setTitle('')
  }

  return (
    <div className="flex-1 overflow-y-auto pt-6 pb-24 scrollbar-hide">
      {/* 경고 배너 */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="rounded-3xl p-5 mb-8 shadow-xl shadow-red-100/50 border border-red-100 bg-white"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">⚠️</span>
              <div>
                <h4 className="font-black text-red-500 text-sm tracking-tight mb-0.5">
                  {warningType === 'stability' ? '붕괴 위험 감지!' : '건축물 다양성 부족!'}
                </h4>
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  {warningType === 'stability' 
                    ? '건물이 너무 불안정합니다. 중요도 4단계 이상의 일을 미뤄서 지지대를 만드세요!' 
                    : '똑같은 층만 쌓으면 건물이 지루해져요. 다른 중요도의 일을 선택해보세요.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 등록 폼 */}
      <div className="bg-white rounded-[32px] p-7 shadow-2xl shadow-gray-200/50 border border-gray-50 mb-10">
        <h2 className="font-black text-xl mb-6 text-gray-900 tracking-tight">미룰 일 등록</h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">What to procrastinate?</label>
            <input
              type="text"
              placeholder="무슨 일을 미룰건가요?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="w-full bg-gray-50 rounded-2xl px-5 py-4 text-sm placeholder-gray-300 outline-none focus:ring-2 ring-gray-900/5 transition-all text-gray-800 font-medium border border-transparent focus:border-gray-100"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Importance</label>
              <span className={`text-[11px] font-bold ${importanceConfig[importance].text} px-2.5 py-1 rounded-full ${importanceConfig[importance].bg}`}>
                {importanceConfig[importance].label}
              </span>
            </div>
            
            <div className="flex gap-2.5">
              {([1, 2, 3, 4, 5] as Importance[]).map((level) => {
                const blocked = isStabilityWarning && level < 4
                const isSelected = importance === level
                return (
                  <button
                    key={level}
                    onClick={() => !blocked && setImportance(level)}
                    disabled={blocked}
                    className={`
                      flex-1 h-14 rounded-2xl flex items-center justify-center transition-all relative overflow-hidden
                      ${isSelected ? 'bg-gray-900 scale-105 shadow-xl shadow-gray-200' : 'bg-gray-50'}
                      ${blocked ? 'opacity-20 grayscale' : 'opacity-100'}
                    `}
                  >
                    <span className={`text-lg font-black ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                      {level}
                    </span>
                    {isSelected && (
                      <motion.div
                        layoutId="importanceGlow"
                        className="absolute inset-0 bg-white/10"
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={!title.trim() || isBlocked}
            className="w-full bg-gray-900 text-white font-black py-5 rounded-3xl text-sm shadow-xl shadow-gray-200 active:scale-[0.98] transition-all disabled:bg-gray-200 disabled:shadow-none mt-2"
          >
            건축 시작하기 🏗️
          </button>
        </div>
      </div>


      {/* 미룬 기록 */}
      {done.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              History ({done.length})
            </h3>
            <div className="h-px bg-gray-100 flex-1 ml-4" />
          </div>
          
          <div className="space-y-3">
            {done.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="group flex items-center gap-4 bg-white rounded-3xl p-4 shadow-sm border border-gray-50 hover:shadow-md transition-shadow"
              >
                <span className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-sm font-black ${importanceConfig[task.importance].bg} ${importanceConfig[task.importance].text}`}>
                  {task.importance}
                </span>
                <span className="text-gray-700 text-sm font-bold flex-1 truncate">{task.title}</span>
                <button
                  onClick={() => startComplete(task.id)}
                  className="shrink-0 px-5 py-2.5 rounded-2xl text-[11px] font-black bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                >
                  DONE
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'

const importanceColor: Record<number, string> = {
  1: 'bg-gray-600',
  2: 'bg-stone-500',
  3: 'bg-blue-600',
  4: 'bg-purple-600',
  5: 'bg-yellow-500',
}

export default function TaskList() {
  const { tasks, procrastinate, showWarning } = useGameStore()
  const pending = tasks.filter((t) => t.status === 'pending')

  if (pending.length === 0) {
    return (
      <p className="text-center text-white/30 text-sm py-6">
        할일이 없습니다. + 버튼으로 추가하세요
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence>
        {pending.map((task) => {
          const isLowImportance = showWarning && task.importance < 4
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`
                flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3
                ${isLowImportance ? 'opacity-40' : ''}
              `}
            >
              {/* 중요도 뱃지 */}
              <span
                className={`
                  w-7 h-7 rounded-full ${importanceColor[task.importance]}
                  flex items-center justify-center text-white text-xs font-bold shrink-0
                `}
              >
                {task.importance}
              </span>

              {/* 제목 */}
              <span className="text-white text-sm flex-1 truncate">{task.title}</span>

              {/* 미루기 버튼 */}
              <button
                onClick={() => procrastinate(task.id)}
                disabled={isLowImportance}
                className={`
                  shrink-0 px-3 py-1 rounded-full text-xs font-bold
                  ${isLowImportance
                    ? 'bg-white/10 text-white/30 cursor-not-allowed'
                    : 'bg-white text-black active:scale-95 transition-transform'
                  }
                `}
              >
                미루기
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

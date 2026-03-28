import { motion } from 'framer-motion'

interface Props {
  active: 'home' | 'tasks'
  onChange: (tab: 'home' | 'tasks') => void
}

export default function TabBar({ active, onChange }: Props) {
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 w-[240px]">
      <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-2 flex items-center justify-between">
        <button
          onClick={() => onChange('home')}
          className="relative flex-1 flex flex-col items-center py-3 gap-1 z-10"
        >
          {active === 'home' && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-gray-900 rounded-2xl -z-10 shadow-lg shadow-gray-200"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="text-xl">🏗️</span>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${active === 'home' ? 'text-white' : 'text-gray-400'}`}>
            Building
          </span>
        </button>
        <button
          onClick={() => onChange('tasks')}
          className="relative flex-1 flex flex-col items-center py-3 gap-1 z-10"
        >
          {active === 'tasks' && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-gray-900 rounded-2xl -z-10 shadow-lg shadow-gray-200"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="text-xl">📋</span>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${active === 'tasks' ? 'text-white' : 'text-gray-400'}`}>
            Tasks
          </span>
        </button>
      </div>
    </div>
  )
}

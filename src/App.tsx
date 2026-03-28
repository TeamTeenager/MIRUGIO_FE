import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Onboarding from './components/ui/Onboarding'
import PhoneFrame from './components/ui/PhoneFrame'
import TabBar from './components/ui/TabBar'
import Building from './components/building/Building'
import StreakBadge from './components/ui/StreakBadge'
import WarningModal from './components/ui/WarningModal'
import TasksView from './components/task/TasksView'
import { useGameStore } from './store/useGameStore'
import { initAnonymousAuth } from './lib/auth'
import { applyTheme } from './lib/theme'

applyTheme()

function useOnboarding() {
  const [done, setDone] = useState(() => localStorage.getItem('onboarding-done') === 'true')
  const finish = () => {
    localStorage.setItem('onboarding-done', 'true')
    setDone(true)
  }
  return { done, finish }
}

function useSupabaseInit() {
  const { setUserId, loadFromSupabase } = useGameStore()
  useEffect(() => {
    initAnonymousAuth().then((userId) => {
      if (!userId) return
      setUserId(userId)
      loadFromSupabase(userId)
    })
  }, [])
}

export default function App() {
  const { done, finish } = useOnboarding()
  useSupabaseInit()
  const { floors, activeTab, setActiveTab } = useGameStore()

  if (!done) return <PhoneFrame><Onboarding onDone={finish} /></PhoneFrame>

  return (
    <PhoneFrame>
    <div className="bg-white flex flex-col h-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4 shrink-0">
        <div>
          <h1 className="font-bold text-2xl tracking-tight text-gray-800">미루지오</h1>
          <p className="text-xs mt-0.5 text-gray-400">{floors.length}층 건축 중</p>
        </div>
        <StreakBadge />
      </div>

      {/* 탭 콘텐츠 */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-y-auto px-5 pb-4 flex flex-col justify-end"
            >
              <Building />
            </motion.div>
          ) : (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden flex flex-col"
            >
              <TasksView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 탭바 */}
      <TabBar active={activeTab} onChange={setActiveTab} />

      <WarningModal />
    </div>
    </PhoneFrame>
  )
}

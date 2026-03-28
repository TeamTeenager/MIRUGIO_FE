import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Splash from './components/ui/Splash'
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
  const [splash, setSplash] = useState(true)
  const [done, setDone] = useState(false)
  const finish = () => setDone(true)
  return { splash, setSplash, done, finish }
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
  const { splash, setSplash, done, finish } = useOnboarding()
  useSupabaseInit()
  const { floors, activeTab, setActiveTab } = useGameStore()

  if (splash) return <PhoneFrame><Splash onDone={() => setSplash(false)} /></PhoneFrame>
  if (!done) return <PhoneFrame><Onboarding onDone={finish} /></PhoneFrame>

  return (
    <PhoneFrame>
    <div className="bg-[#f8f9fa] flex flex-col h-full relative overflow-hidden">
      {/* 장식용 그라데이션 */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
      
      {/* 헤더 */}
      <div className="relative flex items-center justify-between px-6 pt-14 pb-6 shrink-0 z-10">
        <div>
          <h1 className="font-black text-3xl tracking-tight text-gray-900 leading-none">
            미루지오
          </h1>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">
              Building {floors.length} Floors
            </p>
          </div>
        </div>
        <StreakBadge />
      </div>

      {/* 탭 콘텐츠 */}
      <div className="flex-1 overflow-hidden flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex-1 overflow-y-auto px-5 pb-24 flex flex-col justify-end"
            >
              <Building />
            </motion.div>
          ) : (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex-1 overflow-hidden flex flex-col px-5 pb-24"
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

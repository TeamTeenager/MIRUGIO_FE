import { useGameStore } from '../../store/useGameStore'

export default function StreakBadge() {
  const streak = useGameStore((s) => s.streak)
  if (streak === 0) return null

  return (
    <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-2xl shadow-sm border border-gray-100">
      <span className="text-lg">🔥</span>
      <div className="flex flex-col -gap-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-tight">Streak</span>
        <span className="text-sm font-black text-gray-900 leading-tight">{streak} Days</span>
      </div>
    </div>
  )
}

import { useGameStore } from '../../store/useGameStore'

export default function StreakBadge() {
  const streak = useGameStore((s) => s.streak)
  if (streak === 0) return null

  return (
    <div
      className="flex items-center gap-1 rounded-full px-3 py-1"
      style={{ background: 'var(--theme-point)', color: 'var(--theme-text)' }}
    >
      <span className="text-base">🔥</span>
      <span className="text-sm">
        <span className="font-black text-lg leading-none">{streak}</span>일 연속 미룸
      </span>
    </div>
  )
}

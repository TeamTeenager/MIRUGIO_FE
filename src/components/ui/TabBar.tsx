interface Props {
  active: 'home' | 'tasks'
  onChange: (tab: 'home' | 'tasks') => void
}

export default function TabBar({ active, onChange }: Props) {
  return (
    <div className="flex border-t border-gray-100 bg-white pb-safe">
      <button
        onClick={() => onChange('home')}
        className="flex-1 flex flex-col items-center py-3 gap-1 transition-colors"
        style={{ color: active === 'home' ? 'var(--theme-text)' : '#d1d5db' }}
      >
        <span className="text-xl">🏗️</span>
        <span className="text-xs font-semibold">내 건물</span>
      </button>
      <button
        onClick={() => onChange('tasks')}
        className="flex-1 flex flex-col items-center py-3 gap-1 transition-colors"
        style={{ color: active === 'tasks' ? 'var(--theme-text)' : '#d1d5db' }}
      >
        <span className="text-xl">📋</span>
        <span className="text-xs font-semibold">할일</span>
      </button>
    </div>
  )
}

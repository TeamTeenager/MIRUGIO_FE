export type Importance = 1 | 2 | 3 | 4 | 5

export interface Task {
  id: string
  title: string
  importance: Importance
  status: 'pending' | 'procrastinated' | 'completed'
  createdAt: string
  procrastinatedAt?: string
}

export interface Floor {
  id: string
  taskId: string
  title: string
  importance: Importance
  position: number
}

export interface GameState {
  tasks: Task[]
  floors: Floor[]
  stability: number
  streak: number
  lastProcrastinatedDate: string | null
  isCollapsed: boolean
  showWarning: boolean
  warningDismissedAt: string | null
  activeTab: 'home' | 'tasks'
}

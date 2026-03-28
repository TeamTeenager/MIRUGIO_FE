import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, Floor, GameState, Importance } from '../types'
import { calcStability } from '../utils/stability'
import { supabase } from '../lib/supabase'

interface GameActions {
  addTask: (title: string, importance: Importance) => void
  procrastinate: (taskId: string) => void
  startComplete: (taskId: string) => void
  completeTask: (taskId: string) => void
  setActiveTab: (tab: 'home' | 'tasks') => void
  clearPendingAnimation: () => void
  clearPendingComplete: () => void
  dismissWarning: () => void
  collapseBuilding: () => void
  resetBuilding: () => void
  setUserId: (id: string) => void
  loadFromSupabase: (userId: string) => Promise<void>
}

interface ExtendedState extends GameState {
  userId: string | null
  pendingAnimation: number | null
  pendingComplete: string | null
}

const initialState: ExtendedState = {
  tasks: [],
  floors: [],
  stability: 100,
  streak: 0,
  lastProcrastinatedDate: null,
  isCollapsed: false,
  showWarning: false,
  warningType: null,
  warningDismissedAt: null,
  activeTab: 'home',
  userId: null,
  pendingAnimation: null,
  pendingComplete: null,
}

export const useGameStore = create<ExtendedState & GameActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUserId: (id) => set({ userId: id }),

      loadFromSupabase: async (userId) => {
        const [{ data: tasks }, { data: floors }] = await Promise.all([
          supabase.from('tasks').select('*').eq('user_id', userId).order('created_at'),
          supabase.from('floors').select('*').eq('user_id', userId).order('position'),
        ])

        if (!tasks || !floors) return

        const mappedTasks: Task[] = tasks.map((t) => ({
          id: t.id,
          title: t.title,
          importance: t.importance,
          status: t.status,
          createdAt: t.created_at,
          procrastinatedAt: t.procrastinated_at,
        }))

        const mappedFloors: Floor[] = floors.map((f) => ({
          id: f.id,
          taskId: f.task_id,
          title: f.title,
          importance: f.importance,
          position: f.position,
        }))

        set({
          tasks: mappedTasks,
          floors: mappedFloors,
          stability: calcStability(mappedFloors),
        })
      },

      addTask: (title, importance) => {
        const { floors, streak, showWarning, warningType, userId } = get()

        const today = new Date().toDateString()

        // 붕괴 체크
        if (showWarning) {
          if (warningType === 'consecutive' && importance !== 5) {
            get().collapseBuilding()
            return
          }
          if (warningType === 'stability' && importance < 4) {
            get().collapseBuilding()
            return
          }
        }

        // 테스트 중: 등록할 때마다 +1
        const newStreak = streak + 1

        const taskId = crypto.randomUUID()
        const floorId = crypto.randomUUID()
        const now = new Date().toISOString()

        const task: Task = {
          id: taskId,
          title,
          importance,
          status: 'procrastinated',
          createdAt: now,
          procrastinatedAt: now,
        }

        const newFloor: Floor = {
          id: floorId,
          taskId,
          title,
          importance,
          position: floors.length,
        }

        const newFloors = [...floors, newFloor]
        const newStability = calcStability(newFloors)

        // 마지막 2개의 층이 현재 추가한 층의 중요도와 같은지 체크
        const isConsecutive = floors.length >= 1 && floors.slice(-1).every(f => f.importance === importance)
        const currentShowWarning = newStability < 40 || isConsecutive
        const currentWarningType = isConsecutive ? 'consecutive' : (newStability < 40 ? 'stability' : null)

        set((s) => ({
          tasks: [...s.tasks, task],
          floors: newFloors,
          stability: newStability,
          streak: newStreak,
          lastProcrastinatedDate: today,
          showWarning: currentShowWarning,
          warningType: currentWarningType,
          warningDismissedAt: null,
          activeTab: 'home',
          pendingAnimation: importance,
        }))

        // Supabase 동기화 (fire & forget)
        if (userId) {
          supabase.from('tasks').insert({
            id: taskId,
            user_id: userId,
            title,
            importance,
            status: 'procrastinated',
            procrastinated_at: now,
          }).then()

          supabase.from('floors').insert({
            id: floorId,
            user_id: userId,
            task_id: taskId,
            title,
            importance,
            position: floors.length,
          }).then()

          supabase.from('profiles').update({
            streak: newStreak,
            last_procrastinated_date: today,
          }).eq('id', userId).then()
        }
      },

      procrastinate: (taskId) => {
        const { tasks, floors, streak, lastProcrastinatedDate, showWarning, warningType } = get()
        const task = tasks.find((t) => t.id === taskId)
        if (!task) return

        // 붕괴 체크
        if (showWarning) {
          if (warningType === 'consecutive' && task.importance !== 5) {
            get().collapseBuilding()
            return
          }
          if (warningType === 'stability' && task.importance < 4) {
            get().collapseBuilding()
            return
          }
        }

        const today = new Date().toDateString()
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)

        let newStreak = streak
        if (lastProcrastinatedDate === yesterday.toDateString()) {
          newStreak = streak + 1
        } else if (lastProcrastinatedDate !== today) {
          newStreak = 1
        }

        const newFloor: Floor = {
          id: crypto.randomUUID(),
          taskId,
          title: task.title,
          importance: task.importance,
          position: floors.length,
        }

        const newFloors = [...floors, newFloor]
        const newStability = calcStability(newFloors)
        // 마지막 층이 현재 미루려는 일의 중요도와 같은지 체크
        const isConsecutive = floors.length >= 1 && floors.slice(-1).every(f => f.importance === task.importance)
        const currentShowWarning = newStability < 40 || isConsecutive
        const currentWarningType = isConsecutive ? 'consecutive' : (newStability < 40 ? 'stability' : null)

        const updatedTasks = tasks.map((t) =>
          t.id === taskId
            ? { ...t, status: 'procrastinated' as const, procrastinatedAt: new Date().toISOString() }
            : t
        )

        set({
          tasks: updatedTasks,
          floors: newFloors,
          stability: newStability,
          streak: newStreak,
          lastProcrastinatedDate: today,
          showWarning: currentShowWarning,
          warningType: currentWarningType,
          warningDismissedAt: null,
        })
      },

      completeTask: (taskId) => {
        const { tasks, floors, userId } = get()
        const newFloors = floors
          .filter((f) => f.taskId !== taskId)
          .map((f, i) => ({ ...f, position: i }))
        const newStability = calcStability(newFloors)
        const updatedTasks = tasks.map((t) =>
          t.id === taskId ? { ...t, status: 'completed' as const } : t
        )

        set({
          tasks: updatedTasks,
          floors: newFloors,
          stability: newStability,
          showWarning: newStability < 40,
          warningType: newStability < 40 ? 'stability' : null,
          activeTab: 'home',
        })

        // Supabase 동기화
        if (userId) {
          supabase.from('tasks').update({ status: 'completed' }).eq('id', taskId).then()
          supabase.from('floors').delete().eq('task_id', taskId).then()

          // 남은 층 position 재정렬
          newFloors.forEach((f) => {
            supabase.from('floors').update({ position: f.position }).eq('id', f.id).then()
          })
        }
      },

      startComplete: (taskId) => {
        set({ activeTab: 'home', pendingComplete: taskId })
      },

      setActiveTab: (tab) => set({ activeTab: tab }),
      clearPendingAnimation: () => set({ pendingAnimation: null }),
      clearPendingComplete: () => set({ pendingComplete: null }),

      dismissWarning: () => {
        set({ showWarning: false, warningType: null, warningDismissedAt: new Date().toISOString() })
      },

      collapseBuilding: () => {
        set({ isCollapsed: true, showWarning: false, warningType: null })
      },

      resetBuilding: () => {
        set({ ...initialState })
      },
    }),
    {
      name: 'mirugio-storage',
      partialize: (state) => ({
        tasks: state.tasks,
        floors: state.floors,
        stability: state.stability,
        streak: state.streak,
        lastProcrastinatedDate: state.lastProcrastinatedDate,
        isCollapsed: state.isCollapsed,
        showWarning: state.showWarning,
        warningType: state.warningType,
        warningDismissedAt: state.warningDismissedAt,
        // userId, activeTab은 persist 제외
      }),
    }
  )
)

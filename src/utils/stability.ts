import type { Floor } from '../types'

export function calcStability(floors: Floor[]): number {
  if (floors.length === 0) return 100

  let stability = 100

  // 최근 3층이 모두 중요도 2 이하면 불안정
  const recent = floors.slice(-3)
  const recentAvg = recent.reduce((sum, f) => sum + f.importance, 0) / recent.length
  if (recent.length >= 3 && recentAvg < 2.5) {
    stability -= 40
  }

  // 연속 낮은 중요도 층 패널티
  let consecutiveLow = 0
  for (let i = floors.length - 1; i >= 0; i--) {
    if (floors[i].importance <= 2) {
      consecutiveLow++
    } else {
      break
    }
  }
  stability -= consecutiveLow * 8

  // 전체 평균 중요도가 낮으면 패널티
  const avgImportance = floors.reduce((sum, f) => sum + f.importance, 0) / floors.length
  if (avgImportance < 2) stability -= 15

  return Math.max(0, Math.min(100, stability))
}

export function shouldWarn(stability: number): boolean {
  return stability < 40
}

export function calcStreak(
  lastDate: string | null,
  today: string = new Date().toDateString()
): { streak: number; reset: boolean } {
  if (!lastDate) return { streak: 1, reset: false }
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  if (lastDate === yesterday.toDateString()) return { streak: 0, reset: false }
  if (lastDate === today) return { streak: 0, reset: false }
  return { streak: 0, reset: true }
}

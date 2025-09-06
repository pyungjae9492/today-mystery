import { useState, useEffect } from "react"
import { useLocalStorage } from "usehooks-ts"

interface QuizStats {
  messageCount: number
  hintCount: number
  attemptCount: number
  completedAt: string
  success: boolean // 정답을 맞췄는지 포기했는지
}

interface QuizProgress {
  quizId: string
  completed: boolean
  completedAt: string
  stats?: QuizStats
}

interface DailyQuizState {
  currentQuizId: string
  isCompleted: boolean
  isToday: boolean
  stats?: QuizStats
  clearProgress: () => void
  markCompleted: (stats?: QuizStats) => void
  updateStats: (stats: Partial<QuizStats>) => void
}

// 퀴즈 ID 목록 (실제로는 더 많은 퀴즈가 있을 수 있음)
const QUIZ_IDS = [
  "toady-001",
  "toady-002",
  "toady-003",
  "toady-004",
  "toady-005",
  "toady-006",
  "toady-007",
]

const LS_KEY_QUIZ_PROGRESS = "toady:quizProgress"

export function useDailyQuiz(): DailyQuizState {
  const [progress, setProgress] = useLocalStorage<QuizProgress | null>(LS_KEY_QUIZ_PROGRESS, null)
  const [currentQuizId, setCurrentQuizId] = useState<string>("")
  const [isCompleted, setIsCompleted] = useState(false)
  const [isToday, setIsToday] = useState(false)
  const [stats, setStats] = useState<QuizStats | undefined>(undefined)

  // 오늘 날짜를 기반으로 퀴즈 ID 생성
  const generateTodayQuizId = (): string => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const day = today.getDate()

    // 날짜를 기반으로 퀴즈 ID 선택 (일관성 있게)
    const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    const hash = dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const quizIndex = hash % QUIZ_IDS.length

    console.log(dateString, hash, quizIndex)

    return QUIZ_IDS[quizIndex]
  }

  // 날짜가 같은지 확인
  const isSameDate = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
  }

  useEffect(() => {
    const todayQuizId = generateTodayQuizId()
    const today = new Date()

    // 기존 진행상황이 있는지 확인
    if (progress) {
      const progressDate = new Date(progress.completedAt)

      // 다른 날짜의 퀴즈였다면 진행상황 초기화
      if (!isSameDate(progressDate, today)) {
        setProgress(null)
        setCurrentQuizId(todayQuizId)
        setIsCompleted(false)
        setIsToday(true)
        setStats(undefined)
        return
      }

      // 오늘 퀴즈가 완료되었다면
      if (progress.quizId === todayQuizId && progress.completed) {
        setCurrentQuizId(todayQuizId)
        setIsCompleted(true)
        setIsToday(true)
        setStats(progress.stats)
        return
      }

      // 오늘 퀴즈이지만 완료되지 않았다면
      if (progress.quizId === todayQuizId && !progress.completed) {
        setCurrentQuizId(todayQuizId)
        setIsCompleted(false)
        setIsToday(true)
        setStats(undefined)
        return
      }
    }

    // 새로운 퀴즈 시작
    setCurrentQuizId(todayQuizId)
    setIsCompleted(false)
    setIsToday(true)
    setStats(undefined)
  }, [progress, setProgress])

  const clearProgress = () => {
    setProgress(null)
    setStats(undefined)
  }

  const markCompleted = (newStats?: QuizStats) => {
    const today = new Date()
    const finalStats = newStats || {
      messageCount: 0,
      hintCount: 0,
      attemptCount: 0,
      completedAt: today.toISOString(),
      success: false
    }

    setProgress({
      quizId: currentQuizId,
      completed: true,
      completedAt: today.toISOString(),
      stats: finalStats
    })
    setIsCompleted(true)
    setStats(finalStats)
  }

  const updateStats = (newStats: Partial<QuizStats>) => {
    setStats(prev => prev ? { ...prev, ...newStats } : undefined)
  }

  return {
    currentQuizId,
    isCompleted,
    isToday,
    stats,
    clearProgress,
    markCompleted,
    updateStats
  }
} 
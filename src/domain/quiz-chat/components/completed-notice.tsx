"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, MessageSquare, Lightbulb, Trophy, Eye, Timer } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

interface QuizStats {
  messageCount: number
  hintCount: number
  durationMs: number
  completedAt: string
  success: boolean
}

interface CompletedNoticeProps {
  onReset?: () => void
  stats?: QuizStats
  answer?: string
  title?: string
  scenario?: string
  onShowHistory?: () => void
}

export function CompletedNotice({ onReset, stats, answer, title, scenario, onShowHistory }: CompletedNoticeProps) {
  const [countdown, setCountdown] = useState<string>("")

  const nextMidnight = useMemo(() => {
    const now = new Date()
    const d = new Date(now)
    d.setHours(24, 0, 0, 0) // 오늘 24:00 == 내일 00:00
    return d
  }, [])

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const diff = nextMidnight.getTime() - now.getTime()
      if (diff <= 0) {
        setCountdown("00:00:00")
        return
      }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      const fmt = [h, m, s].map((v) => String(v).padStart(2, "0")).join(":")
      setCountdown(fmt)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [nextMidnight])

  const formatCompletedTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (ms: number) => {
    if (!ms || ms < 0) return "-"
    const h = Math.floor(ms / 3600000)
    const m = Math.floor((ms % 3600000) / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    const parts = [h, m, s]
    return parts.map((v) => String(v).padStart(2, '0')).join(':')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center min-h-[400px] px-4 text-center pt-12"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", duration: 0.6 }}
        className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-black/40 ${
          stats?.success 
            ? "bg-gradient-to-br from-green-400 to-green-600" 
            : "bg-gradient-to-br from-orange-400 to-orange-600"
        }`}
      >
        <span className="text-3xl">
          {stats?.success ? "🎉" : "📝"}
        </span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-extrabold tracking-tight text-white mb-2"
      >
        {stats?.success ? "오늘의 퀴즈 완료!" : "오늘의 퀴즈 종료"}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-neutral-300 mb-6 max-w-md leading-relaxed text-balance whitespace-pre-wrap break-keep"
      >
        {stats?.success 
          ? "축하합니다! 퀴즈를 성공적으로 해결하셨습니다! 내일 새로운 퀴즈가 준비되어 있어요."
          : "정답을 확인하여 퀴즈를 종료하셨습니다. 내일 다시 도전해보세요!"}
      </motion.p>

      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full max-w-md mb-6"
        >
          <div className="bg-neutral-900/70 rounded-xl p-4 border border-white/10 backdrop-blur">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-neutral-300">
                <Trophy size={16} />
                <span className="text-sm font-medium">오늘의 기록</span>
              </div>
              {onShowHistory && (
                <button
                  onClick={onShowHistory}
                  className="text-xs px-2 py-1 rounded-md border border-white/10 hover:bg-white/5 text-neutral-300"
                >
                  채팅 히스토리 열기
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <MessageSquare size={14} className="text-blue-400" />
                <span className="text-neutral-300">질문</span>
                <span className="text-white font-medium">{stats.messageCount}개</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Lightbulb size={14} className="text-yellow-400" />
                <span className="text-neutral-300">힌트</span>
                <span className="text-white font-medium">{stats.hintCount}개</span>
              </div>

              <div className="flex items-center gap-2">
                <Timer size={14} className="text-purple-400" />
                <span className="text-neutral-300">걸린 시간</span>
                <span className="text-white font-medium">{formatDuration(stats.durationMs)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-green-400" />
                <span className="text-neutral-300">완료</span>
                <span className="text-white font-medium">
                  {formatCompletedTime(stats.completedAt)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {(answer || title || scenario) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="w-full max-w-md mb-6"
        >
          <div className="rounded-lg p-4 border border-white/10 bg-neutral-900/70 text-left">
            {title && (
              <div className="mb-2">
                <span className="text-[11px] text-violet-300/70">오늘의 퀴즈</span>
                <p className="text-sm text-neutral-200 leading-relaxed text-balance whitespace-pre-wrap break-keep">{title}</p>
              </div>
            )}
            {scenario && (
              <div className="mb-2">
                <span className="text-[11px] text-violet-300/70">시나리오</span>
                <p className="text-sm text-neutral-300 leading-relaxed text-balance whitespace-pre-wrap break-keep">{scenario}</p>
              </div>
            )}
            {answer && (
              <div className="mt-1">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="w-4 h-4 text-violet-400" />
                  <span className="text-sm font-medium text-violet-300">정답</span>
                </div>
                <p className="text-sm text-neutral-200 leading-relaxed text-balance whitespace-pre-wrap break-keep">
                  {answer}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="bg-neutral-900 rounded-lg p-4 mb-6 border border-neutral-700 max-w-md w-full flex justify-between items-center"
      >
        <div className="flex items-center gap-2 text-neutral-400">
          <Calendar size={16} />
          <span className="text-sm">다음 퀴즈까지 남은 시간</span>
        </div>
        <div className="text-white font-bold tracking-wider tabular-nums">
          {countdown}
        </div>
      </motion.div>

      <div className="flex gap-3">
        {onReset && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            onClick={onReset}
            className="text-sm text-neutral-400 hover:text-white transition-colors underline"
          >
            오늘 퀴즈 다시 풀기
          </motion.button>
        )}
      </div>
    </motion.div>
  )
} 
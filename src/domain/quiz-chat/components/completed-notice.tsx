"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, MessageSquare, Lightbulb, Target, Trophy, Eye } from "lucide-react"

interface QuizStats {
  messageCount: number
  hintCount: number
  attemptCount: number
  completedAt: string
  success: boolean
}

interface CompletedNoticeProps {
  onReset?: () => void
  stats?: QuizStats
  answer?: string
}

export function CompletedNotice({ onReset, stats, answer }: CompletedNoticeProps) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  const formatTime = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  const formatCompletedTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center min-h-[400px] px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", duration: 0.6 }}
        className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
          stats?.success 
            ? "bg-gradient-to-r from-green-400 to-green-600" 
            : "bg-gradient-to-r from-orange-400 to-orange-600"
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
        className="text-2xl font-bold text-white mb-2"
      >
        {stats?.success ? "오늘의 퀴즈 완료!" : "오늘의 퀴즈 종료"}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-neutral-300 mb-6 max-w-md leading-relaxed"
      >
        {stats?.success 
          ? "축하합니다! 퀴즈를 성공적으로 해결하셨습니다! 내일 새로운 퀴즈가 준비되어 있어요."
          : "정답을 확인하여 퀴즈를 종료하셨습니다. 내일 다시 도전해보세요!"
        }
      </motion.p>

      {/* 통계 정보 */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full max-w-md mb-6"
        >
          <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-700">
            <div className="flex items-center gap-2 text-neutral-400 mb-3">
              <Trophy size={16} />
              <span className="text-sm font-medium">오늘의 기록</span>
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
                <Target size={14} className="text-purple-400" />
                <span className="text-neutral-300">도전</span>
                <span className="text-white font-medium">{stats.attemptCount}회</span>
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

      {/* 정답 표시 */}
      {answer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="w-full max-w-md mb-6"
        >
          <div className="bg-red-950/30 border border-red-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-red-300">정답</span>
            </div>
            <p className="text-sm text-red-200 leading-relaxed">
              {answer}
            </p>
          </div>
        </motion.div>
      )}

      {/* 다음 퀴즈 정보 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="bg-neutral-900 rounded-lg p-4 mb-6 border border-neutral-700"
      >
        <div className="flex items-center gap-2 text-neutral-400 mb-2">
          <Calendar size={16} />
          <span className="text-sm">다음 퀴즈</span>
        </div>
        <div className="text-white font-medium">
          {formatTime(tomorrow)}
        </div>
      </motion.div>

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
    </motion.div>
  )
} 
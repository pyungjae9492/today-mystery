"use client"

import { useRef, useState, useEffect } from "react"
import { useEventListener, useMediaQuery } from "usehooks-ts"
import { ChatWindow } from "./chat-window"
import { MessageInput } from "./message-input"
import { CompletedNotice } from "./completed-notice"
import { useDailyQuiz } from "@/lib/use-daily-quiz"
import { getQuiz } from "@/lib/quiz"

interface ChatContainerProps {
	onFirstMessage?: () => void
	unlockedHints?: number
	onUnlockHint?: () => void
	onConfirmAnswer?: () => void
	guideOpen?: boolean
	onGuideToggle?: () => void
}

export function ChatContainer({ 
	onFirstMessage, 
	unlockedHints = 0, 
	onUnlockHint,
	onConfirmAnswer,
	guideOpen = false,
	onGuideToggle
}: ChatContainerProps) {
	const sentRef = useRef(false)
	const [isThinking, setIsThinking] = useState(false)
	const [messageCount, setMessageCount] = useState(0)
	const [hintCount, setHintCount] = useState(0)
	const [attemptCount, setAttemptCount] = useState(0)
	const { isCompleted, currentQuizId, markCompleted, stats } = useDailyQuiz()
	const isMobile = useMediaQuery("(max-width: 767px)")

	// 퀴즈 데이터 가져오기
	const quiz = getQuiz(currentQuizId || "toady-001")
	const QUIZ = quiz ? {
		hints: quiz.hints || [],
		answer: quiz.answer,
	} : {
		hints: [],
		answer: "",
	}

	// 통계 정보 초기화
	useEffect(() => {
		if (stats) {
			setMessageCount(stats.messageCount)
			setHintCount(stats.hintCount)
			setAttemptCount(stats.attemptCount)
		}
	}, [stats])

	useEventListener("toady:send" as unknown as keyof WindowEventMap, () => {
		if (!sentRef.current) {
			onFirstMessage?.()
			sentRef.current = true
		}
	})

	// 힌트 해금 함수
	const handleUnlockHint = () => {
		if (unlockedHints < QUIZ.hints.length) {
			onUnlockHint?.()
			// 힌트 카운트 업데이트
			setHintCount(unlockedHints + 1)
		}
	}

	// 정답 확인 완료 함수
	const handleConfirmAnswer = () => {
		// 힌트 사용 횟수는 localStorage에서 가져오기
		const unlockedHints = parseInt(localStorage.getItem("today:unlockedHints") || "0")
		const finalStats = {
			messageCount,
			hintCount: unlockedHints,
			attemptCount,
			completedAt: new Date().toISOString(),
			success: false // 정답 확인으로 종료했으므로 false
		}
		markCompleted(finalStats)
		onConfirmAnswer?.()
	}

	// 통계 업데이트 함수
	const handleUpdateStats = (newStats: { messageCount?: number; hintCount?: number; attemptCount?: number }) => {
		if (newStats.messageCount !== undefined) {
			setMessageCount(newStats.messageCount)
		}
		if (newStats.hintCount !== undefined) {
			setHintCount(newStats.hintCount)
		}
		if (newStats.attemptCount !== undefined) {
			setAttemptCount(newStats.attemptCount)
		}
	}

	// 퀴즈가 완료된 경우 완료 페이지 표시
	if (isCompleted) {
		return (
			<div className="flex h-full flex-col relative">
				<div className="flex-1 min-h-0 overflow-y-auto">
					<CompletedNotice 
						stats={stats}
						answer={QUIZ.answer}
					/>
				</div>
			</div>
		)
	}

	return (
		<div className="flex h-full flex-col relative">
			{/* 채팅 윈도우 - 남은 공간 모두 차지 */}
			<div className="flex-1 min-h-0">
				<ChatWindow onFirstMessage={onFirstMessage} onThinkingChange={setIsThinking} />
			</div>
			
			{/* 메시지 입력 - 하단 고정 */}
			<div className="flex-shrink-0">
				<MessageInput 
					onSend={(text) => {
						window.dispatchEvent(new CustomEvent("toady:send", { detail: { text } }))
					}} 
					disabled={isThinking || isCompleted}
					isCompleted={isCompleted}
					hints={QUIZ.hints}
					unlockedHints={unlockedHints}
					onUnlockHint={handleUnlockHint}
					onShowAnswer={handleConfirmAnswer}
					answer={QUIZ.answer}
					messageCount={messageCount}
					onUpdateStats={handleUpdateStats}
				/>
			</div>
		</div>
	)
} 
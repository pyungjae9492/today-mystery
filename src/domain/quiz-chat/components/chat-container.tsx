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
	const { isCompleted, currentQuizId, markCompleted, stats } = useDailyQuiz()
	const isMobile = useMediaQuery("(max-width: 767px)")
	const [showHistory, setShowHistory] = useState(false)

	const LS_KEY_START_AT = "toady:startAt"

	// 퀴즈 데이터 가져오기
	const quiz = getQuiz(currentQuizId || "toady-001")
	const QUIZ = quiz ? {
		title: quiz.title,
		scenario: quiz.scenario,
		hints: quiz.hints || [],
		answer: quiz.answer,
	} : {
		title: "",
		scenario: "",
		hints: [],
		answer: "",
	}

	// 통계 정보 초기화
	useEffect(() => {
		if (stats) {
			setMessageCount(stats.messageCount)
			setHintCount(stats.hintCount)
		}
	}, [stats])

	useEffect(() => {
		if (!isCompleted) {
			const v = localStorage.getItem(LS_KEY_START_AT)
			if (!v) localStorage.setItem(LS_KEY_START_AT, String(Date.now()))
		}
	}, [isCompleted])

	useEventListener("toady:send" as unknown as keyof WindowEventMap, () => {
		if (!sentRef.current) {
			onFirstMessage?.()
			sentRef.current = true
			// 첫 입력 시 시작 시간 저장(없으면)
			if (!localStorage.getItem(LS_KEY_START_AT)) {
				localStorage.setItem(LS_KEY_START_AT, String(Date.now()))
			}
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
		const unlocked = parseInt(localStorage.getItem("today:unlockedHints") || "0")
		const startAt = parseInt(localStorage.getItem(LS_KEY_START_AT) || "0")
		const durationMs = startAt ? Date.now() - startAt : 0
		const finalStats = {
			messageCount,
			hintCount: unlocked,
			durationMs,
			completedAt: new Date().toISOString(),
			success: false
		}
		markCompleted(finalStats)
		onConfirmAnswer?.()
	}

	// 통계 업데이트 함수
	const handleUpdateStats = (newStats: { messageCount?: number; hintCount?: number }) => {
		if (newStats.messageCount !== undefined) {
			setMessageCount(newStats.messageCount)
		}
		if (newStats.hintCount !== undefined) {
			setHintCount(newStats.hintCount)
		}
	}

	// 퀴즈가 완료된 경우 완료 페이지 + 바텀 시트 히스토리(컨테이너 내부)
	if (isCompleted) {
		return (
			<div className="flex h-full flex-col relative">
				<div className="flex-1 min-h-0 overflow-y-auto">
					<CompletedNotice 
						stats={stats}
						answer={QUIZ.answer}
						title={QUIZ.title}
						scenario={QUIZ.scenario}
						onShowHistory={() => setShowHistory(true)}
					/>
				</div>

				{showHistory && (
					<>
						{/* 컨테이너 내부 오버레이 */}
						<button
							className="absolute inset-0 z-40 bg-black/40"
							aria-label="히스토리 닫기"
							onClick={() => setShowHistory(false)}
						/>
						{/* 바텀 시트 */}
						<div className="absolute left-0 right-0 bottom-0 z-50 rounded-t-2xl border border-white/10 bg-neutral-950 shadow-2xl">
							<div className="mx-auto w-full max-w-screen-sm">
								<div className="pt-3 pb-2 flex items-center justify-center">
									<div className="h-1.5 w-10 rounded-full bg-white/20" />
								</div>
								<div className="px-4 pb-4">
									<h3 className="text-sm font-semibold text-white mb-2">채팅 히스토리</h3>
									<div className="h-[60vh] rounded-lg border border-white/10 bg-neutral-900/60 overflow-hidden">
										<ChatWindow readOnly heightClass="h-[60vh]" />
									</div>
								</div>
							</div>
						</div>
					</>
				)}
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
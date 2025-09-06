"use client"

import React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessage, ChatRole } from "./chat-message"
import * as Dialog from "@radix-ui/react-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { useLocalStorage, useEventListener } from "usehooks-ts"
import { getQuiz } from "@/lib/quiz"
import { useDailyQuiz } from "@/lib/use-daily-quiz"
import { LoadingDots } from "./loading-dots"
// import { Confetti } from "./confetti"
import { Confetti as CanvasConfetti } from "@/components/magicui/confetti"
import { SuccessModal } from "./success-modal"
import { CompletedNotice } from "./completed-notice"

interface ChatWindowProps {
	onFirstMessage?: () => void
	onThinkingChange?: (isThinking: boolean) => void
	readOnly?: boolean
	compact?: boolean
	heightClass?: string
}

type Message = { id: string; role: ChatRole; content: string }

type SendEvent = CustomEvent<{ text: string }>

type HistoryItem = { role: ChatRole; content: string }

export function ChatWindow({ onFirstMessage, onThinkingChange, readOnly = false, compact = false, heightClass }: ChatWindowProps) {
	// localStorage keys
	const LS_KEY_MESSAGES = "toady:messages"
	const LS_KEY_ANSWER_OPEN = "toady:answerOpen"
	const LS_KEY_SESSION = "toady:sessionId"

	const [messages, setMessages] = useLocalStorage<Message[]>(LS_KEY_MESSAGES, [])
	const { currentQuizId, isCompleted, markCompleted, clearProgress, stats } = useDailyQuiz()
	const quiz = getQuiz(currentQuizId)
	
	// 자동 초기화 제거: 사용자가 새 퀴즈로 바꿀 때는 상위 로직에서 clearProgress를 호출하도록 유지
	const [isThinking, setIsThinking] = useState(false)
	const [answerOpen, setAnswerOpen] = useLocalStorage<boolean>(LS_KEY_ANSWER_OPEN, false)
	const [sessionId, setSessionId] = useLocalStorage<string>(LS_KEY_SESSION, "")
	const [showConfetti, setShowConfetti] = useState(false)
	const [showSuccessModal, setShowSuccessModal] = useState(false)
	const viewportRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (!sessionId) {
			const sid = crypto.randomUUID()
			setSessionId(sid)
		}
	}, [sessionId, setSessionId])

	useEffect(() => {
		if (!viewportRef.current) return
		viewportRef.current.scrollTop = viewportRef.current.scrollHeight
	}, [messages, isThinking, answerOpen])

	useEffect(() => {
		onThinkingChange?.(isThinking)
	}, [isThinking, onThinkingChange])

	const addMessage = useCallback((role: ChatRole, content: string) => {
		setMessages((prev: Message[]) => [...prev, { id: crypto.randomUUID(), role, content }])
	}, [setMessages])

	const handleSend = useCallback(async (text: string) => {
		const trimmed = text.trim()
		if (!trimmed || isThinking || isCompleted) return
		
		if (trimmed.startsWith("@")) {
			if (trimmed.startsWith("@힌트")) {
				addMessage("assistant", pickHint())
				return
			}
			if (trimmed.startsWith("@정답")) {
				setAnswerOpen(true)
				return
			}
			if (trimmed.startsWith("@포기")) {
				addMessage("assistant", "포기하셨군요. 정답을 공개합니다.")
				setAnswerOpen(true)
				return
			}
		}

		const isFirst = messages.length === 0
		addMessage("user", text)
		if (isFirst) onFirstMessage?.()
		setIsThinking(true)

		try {
			const history: HistoryItem[] = messages.map((m: Message) => ({ role: m.role, content: m.content }))
			const res = await fetch("/api/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ sessionId, quizId: currentQuizId, text, history })
			})
			if (!res.ok) throw new Error("chat api error")
			const data = await res.json()
			const reply = typeof data?.reply === "string" ? data.reply : "관련 없음."
			addMessage("assistant", reply)
			
			// 정답 맞췄을 때 축하 효과
			if (data?.classification === "GUESS" && data?.details === "CORRECT") {
				setShowConfetti(true)
				setTimeout(() => {
					setShowSuccessModal(true)
					setShowConfetti(false)
				}, 800)
			}
		} catch (err) {
			addMessage("assistant", "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
		} finally {
			setIsThinking(false)
		}
	}, [messages, onFirstMessage, sessionId, currentQuizId, addMessage, setAnswerOpen, isThinking, isCompleted])

	useEventListener("toady:send" as unknown as keyof WindowEventMap, (e: Event) => {
		const ce = e as SendEvent
		const text = ce.detail?.text
		if (typeof text === "string") handleSend(text)
	})

	function pickHint() {
		if (!quiz?.hints || quiz.hints.length === 0) {
			return "힌트가 없습니다."
		}
		return `힌트: ${quiz.hints[Math.floor(Math.random() * quiz.hints.length)]}`
	}

	// 성공적으로 완료했을 때 통계 저장: 사용자 메시지 수만 카운트
	const handleSuccessComplete = () => {
		const unlockedHints = parseInt(localStorage.getItem("today:unlockedHints") || "0")
		const userMessageCount = messages.filter((m) => m.role === "user").length + 1
		const startAt = parseInt(localStorage.getItem("toady:startAt") || "0")
		const durationMs = startAt ? Date.now() - startAt : 0
		const finalStats = {
			messageCount: userMessageCount,
			hintCount: unlockedHints,
			durationMs,
			completedAt: new Date().toISOString(),
			success: true
		}
		markCompleted(finalStats)
	}

	// 완료 상태이면서 읽기 전용이 아니라면 완료 화면으로 대체
	if (isCompleted && !readOnly) {
		return (
			<div className={heightClass ? heightClass : (compact ? "h-[320px]" : "h-[calc(100dvh-105px)]") }>
				<CompletedNotice onReset={clearProgress} stats={stats} answer={quiz?.answer} />
			</div>
		)
	}

	const containerClass = heightClass
		? `flex ${heightClass} flex-col`
		: (compact ? "flex h-[320px] flex-col" : "flex h-[calc(100dvh-105px)] flex-col")

	return (
		<div className={containerClass}>
			<ScrollArea className="flex-1" viewportRef={viewportRef}>
				<div className="min-h-full px-3 py-3 space-y-2">
					{messages.length === 0 && (
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 0.7 }}
							transition={{ duration: 0.6 }}
							className="text-center text-xs text-neutral-400 font-mono"
						>
							질문을 시작해보세요. 예/아니오 형태의 질문이 좋아요.
						</motion.p>
					)}
					{messages.map((m: Message) => (
						<ChatMessage key={m.id} role={m.role} content={m.content} />
					))}
					<AnimatePresence>
						{isThinking && (
							<motion.div 
								initial={{ opacity: 0 }} 
								animate={{ opacity: 1 }} 
								exit={{ opacity: 0 }}
								className="flex items-center space-x-2 px-3 py-2"
							>
								<LoadingDots />
								<span className="text-sm text-neutral-400">생각 중...</span>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</ScrollArea>

			{/* 읽기 전용 모드가 아닐 때만 정답 다이얼로그/축하 효과/성공 모달 표시 */}
			{!readOnly && (
				<>
					<Dialog.Root open={answerOpen} onOpenChange={setAnswerOpen}>
						<Dialog.Portal>
							<Dialog.Overlay className="fixed inset-0 bg-black/70" />
							<Dialog.Content className="fixed inset-x-4 bottom-8 rounded-lg border border-white/10 bg-neutral-950 p-4 shadow-2xl">
								<Dialog.Title className="text-sm font-semibold text-white">정답</Dialog.Title>
								<p className="mt-2 text-sm text-neutral-300 leading-relaxed">
									{quiz?.answer ? `정답: ${quiz.answer}` : "정답을 불러올 수 없습니다."}
								</p>
								<div className="mt-3 flex justify-end">
									<Dialog.Close asChild>
										<button className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-black hover:bg-green-500">닫기</button>
									</Dialog.Close>
								</div>
							</Dialog.Content>
						</Dialog.Portal>
					</Dialog.Root>
					
					{/* 축하 효과 */}
					{showConfetti && (
						<CanvasConfetti
							className="fixed inset-0 pointer-events-none z-50"
							options={{
								particleCount: 120,
								spread: 70,
								startVelocity: 45,
								scalar: 0.9,
								origin: { x: 0.5, y: 0.1 },
							}}
						/>
					)}
					
					{/* 성공 모달 */}
					<SuccessModal 
						open={showSuccessModal} 
						onOpenChange={setShowSuccessModal}
						answer={quiz?.answer || "정답을 불러올 수 없습니다."}
						onComplete={handleSuccessComplete}
					/>
				</>
			)}
		</div>
	)
} 
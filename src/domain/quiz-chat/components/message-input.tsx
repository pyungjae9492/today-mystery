"use client"

import React from "react"
import { useRef, useState } from "react"
import { Send, Plus, Lightbulb, Eye, Lock, Unlock, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import * as Popover from "@radix-ui/react-popover"

interface MessageInputProps {
	placeholder?: string
	onSend: (text: string) => void
	disabled?: boolean
	isCompleted?: boolean
	// 힌트와 정답 관련 props 추가
	hints?: string[]
	unlockedHints?: number
	onUnlockHint?: () => void
	onShowAnswer?: () => void
	answer?: string
	// 통계 관련 props 추가
	messageCount?: number
	onUpdateStats?: (stats: { messageCount?: number; hintCount?: number; attemptCount?: number }) => void
}

export function MessageInput({ 
	placeholder = "질문을 입력하세요...", 
	onSend, 
	disabled, 
	isCompleted,
	hints = [],
	unlockedHints = 0,
	onUnlockHint,
	onShowAnswer,
	answer = "",
	messageCount = 0,
	onUpdateStats
}: MessageInputProps) {
	const [text, setText] = useState("")
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [showAnswer, setShowAnswer] = useState(false)
	const [showGiveUpConfirm, setShowGiveUpConfirm] = useState(false)
	const textRef = useRef<HTMLTextAreaElement | null>(null)

	async function handleSubmit() {
		const value = text.trim()
		if (!value || disabled || isSubmitting) return
		
		setIsSubmitting(true)
		try {
			await onSend(value)
			setText("")
			// 메시지 카운트 업데이트
			onUpdateStats?.({ messageCount: messageCount + 1 })
		} finally {
			setIsSubmitting(false)
		}
	}

	// 힌트 해금 함수
	const handleUnlockHint = () => {
		if (unlockedHints < hints.length) {
			onUnlockHint?.()
			// 힌트 카운트 업데이트
			onUpdateStats?.({ hintCount: unlockedHints + 1 })
		}
	}

	// 정답 확인 함수
	const handleShowAnswer = () => {
		setShowGiveUpConfirm(true)
	}

	// 포기 확인 후 정답 표시
	const handleConfirmGiveUp = () => {
		setShowGiveUpConfirm(false)
		setShowAnswer(true)
		// 도전 횟수 업데이트
		onUpdateStats?.({ attemptCount: 1 })
		onShowAnswer?.()
	}

	const isDisabled = disabled || isSubmitting

	if (isCompleted) {
		return (
			<div className="w-full bg-neutral-900/95 backdrop-blur border-top border-white/10">
				<div className="mx-auto px-3 py-2 flex items-center justify-center">
					<p className="text-sm text-neutral-400">
						오늘의 퀴즈를 완료하셨습니다. 내일 새로운 퀴즈를 기다려주세요! 🌟
					</p>
				</div>
				<div className="h-[env(safe-area-inset-bottom)]" />
			</div>
		)
	}

	return (
		<>
			<div className="w-full bg-neutral-900/95 backdrop-blur border-top border-white/10">
				<div className="mx-auto px-3 py-2 flex items-end gap-2 max-w-full">
					<Popover.Root>
						<Popover.Trigger asChild>
							<button
								className={cn(
									"inline-flex items-center justify-center rounded-md p-2",
									"border border-white/10 bg-neutral-800 text-neutral-200 hover:bg-neutral-700",
									isDisabled && "opacity-50 cursor-not-allowed"
								)}
								title="메뉴"
								aria-label="메뉴"
								disabled={isDisabled}
							>
								<Plus size={18} />
							</button>
						</Popover.Trigger>
						<Popover.Portal>
							<Popover.Content
								className="z-50 w-80 rounded-md border border-white/10 bg-neutral-950 p-3 shadow-xl"
								align="start"
								sideOffset={8}
							>
								{/* 힌트 섹션 */}
								{hints.length > 0 && (
									<div className="mb-4">
										<div className="px-2 py-1 text-xs font-medium text-neutral-400 uppercase tracking-wide mb-2">
											힌트 ({unlockedHints}/{hints.length})
										</div>
										<div className="space-y-2">
											{hints.map((hint, index) => (
												<div
													key={index}
													className={`px-2 py-2 rounded text-xs ${
														index < unlockedHints 
															? "bg-yellow-950/30 border border-yellow-800/50" 
															: "bg-neutral-800/50 border border-neutral-700/50"
													}`}
												>
													{index < unlockedHints ? (
														<div className="flex items-start gap-2">
															<Unlock className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
															<p className="text-yellow-300 leading-relaxed">{hint}</p>
														</div>
													) : (
														<button
															onClick={handleUnlockHint}
															className="w-full text-left flex items-center gap-2 text-neutral-200 hover:text-white"
														>
															<Lock className="w-3 h-3" />
															힌트 {index + 1} 해금하기
														</button>
													)}
												</div>
											))}
										</div>
									</div>
								)}

								{/* 정답 섹션 */}
								<div>
									<div className="px-2 py-1 text-xs font-medium text-neutral-400 uppercase tracking-wide mb-2">
										정답
									</div>
									{!isCompleted ? (
										<button
											onClick={handleShowAnswer}
											className="w-full text-left flex items-center gap-2 px-2 py-2 rounded text-xs text-red-300 hover:text-red-200 hover:bg-red-950/20"
										>
											<Eye className="w-3 h-3" />
											정답 확인하기
										</button>
									) : (
										<div className="px-2 py-2 rounded bg-green-950/30 border border-green-800/50">
											<div className="flex items-center gap-2">
												<CheckCircle className="w-3 h-3 text-green-400" />
												<p className="text-green-300 text-xs">퀴즈 완료!</p>
											</div>
										</div>
									)}
								</div>

								<Popover.Arrow className="fill-neutral-950" />
							</Popover.Content>
						</Popover.Portal>
					</Popover.Root>

					<textarea
						ref={textRef}
						value={text}
						onChange={(e) => setText(e.target.value)}
						placeholder={placeholder}
						rows={1}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault()
								handleSubmit()
							}
						}}
						className={cn(
							"flex-1 resize-none rounded-md bg-neutral-900 text-purple-200 placeholder:text-neutral-500",
							"border border-white/10 px-3 py-2 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-purple-600",
							isDisabled && "opacity-50 cursor-not-allowed"
						)}
						disabled={isDisabled}
					/>
					<button
						onClick={handleSubmit}
						className={cn(
							"inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium",
							"bg-purple-600 text-white hover:bg-purple-500 active:scale-[0.98]",
							isDisabled && "opacity-50 cursor-not-allowed"
						)}
						aria-label="메시지 전송"
						disabled={isDisabled}
					>
						<Send size={16} />
						{isSubmitting ? "전송중..." : "보내기"}
					</button>
				</div>
				<div className="h-[env(safe-area-inset-bottom)]" />
			</div>

			{/* 포기 확인 모달 */}
			{showGiveUpConfirm && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
					<div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 max-w-md mx-4">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-2">
								<Eye className="w-4 h-4 text-red-500" />
								<span className="text-sm font-medium text-neutral-200">게임 종료</span>
							</div>
							<button
								onClick={() => setShowGiveUpConfirm(false)}
								className="text-neutral-400 hover:text-neutral-200"
							>
								✕
							</button>
						</div>
						<div className="mb-4">
							<p className="text-sm text-neutral-300 leading-relaxed">
								정답을 확인하면 게임이 종료됩니다. 정말로 포기하시겠습니까?
							</p>
						</div>
						<div className="flex gap-2">
							<button
								onClick={handleConfirmGiveUp}
								className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-2 rounded"
							>
								포기하고 정답 확인
							</button>
							<button
								onClick={() => setShowGiveUpConfirm(false)}
								className="px-3 py-2 text-xs border border-neutral-600 rounded hover:bg-neutral-800"
							>
								계속 도전하기
							</button>
						</div>
					</div>
				</div>
			)}

			{/* 정답 확인 모달 */}
			{showAnswer && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
					<div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 max-w-md mx-4">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-2">
								<Eye className="w-4 h-4 text-red-500" />
								<span className="text-sm font-medium text-neutral-200">정답 확인</span>
							</div>
							<button
								onClick={() => setShowAnswer(false)}
								className="text-neutral-400 hover:text-neutral-200"
							>
								✕
							</button>
						</div>
						<div className="mb-4">
							<div className="p-3 rounded-lg bg-red-950/30 border border-red-800/50">
								<p className="text-sm text-red-300 leading-relaxed">
									{answer}
								</p>
							</div>
						</div>
						<div className="flex gap-2">
							<button
								onClick={() => {
									setShowAnswer(false)
									onShowAnswer?.()
								}}
								className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-2 rounded"
							>
								정답 확인 완료
							</button>
							<button
								onClick={() => setShowAnswer(false)}
								className="px-3 py-2 text-xs border border-neutral-600 rounded hover:bg-neutral-800"
							>
								취소
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	)
} 
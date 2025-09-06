"use client"

import React from "react"
import { useEffect, useState } from "react"
import { QuizNotice } from "@/domain/quiz-chat/components/quiz-notice"
import { ChatContainer } from "@/domain/quiz-chat/components/chat-container"
import { MessageInput } from "@/domain/quiz-chat/components/message-input"
import { DetailedGuide } from "@/domain/quiz-chat/components/detailed-guide"
import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle } from "lucide-react"

import { GuideModal } from "@/domain/quiz-chat/components/guide-modal"
import { useLocalStorage, useMediaQuery } from "usehooks-ts"
import AdSlot from "@/components/ad-slot"
import { getQuiz } from "@/lib/quiz"
import { useDailyQuiz } from "@/lib/use-daily-quiz"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

export default function TodayPage() {
	const [collapsed, setCollapsed] = useLocalStorage<boolean>("today:collapsed", false)
	const [chatStarted, setChatStarted] = useLocalStorage<boolean>("today:chatStarted", false)
	const [guideShown, setGuideShown] = useLocalStorage<boolean>("today:guideShown", false)
	const [unlockedHints, setUnlockedHints] = useLocalStorage<number>("today:unlockedHints", 0)
	const [mounted, setMounted] = useState(false)
	const isMobile = useMediaQuery("(max-width: 767px)")
	const [guideOpen, setGuideOpen] = useState(false)
	
	const { currentQuizId, isCompleted, markCompleted } = useDailyQuiz()

	// 퀴즈 데이터 가져오기
	const quiz = getQuiz(currentQuizId || "toady-001")
	const QUIZ = quiz ? {
		title: quiz.title,
		description: quiz.scenario + " 왜?",
		hints: quiz.hints || [],
		answer: quiz.answer,
	} : {
		title: "로딩 중...",
		description: "퀴즈를 불러오는 중입니다...",
		hints: [],
		answer: "",
	}

	// 하이드레이션 에러 방지를 위한 mounted 상태 관리
	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		if (mounted && isMobile && !guideShown) setGuideOpen(true)
	}, [mounted, isMobile, guideShown])

	useEffect(() => {
		if (!guideOpen) setGuideShown(true)
	}, [guideOpen, setGuideShown])

	// 힌트 해금 함수
	const handleUnlockHint = () => {
		if (unlockedHints < QUIZ.hints.length) {
			setUnlockedHints(unlockedHints + 1)
		}
	}

	// 정답 확인 완료 함수
	const handleConfirmAnswer = () => {
		// 통계 정보는 ChatContainer에서 관리하므로 여기서는 호출만
	}

	if (!mounted) {
		return (
			<></>
		)
	}

	return (
		<div className="dark h-screen bg-neutral-900 text-white overflow-hidden">
			<div className="mx-auto grid h-full max-w-screen-lg grid-cols-1 md:grid-cols-2">
				{/* PC용 사이드바 - 모바일에서는 숨김 */}
				<ScrollArea className="hidden md:block border-r border-white/10 bg-neutral-950/40 p-6 overflow-y-auto h-screen">
					<div className="mt-6 h-[calc(100vh-75px)]">
						<DetailedGuide />	
					</div>
				</ScrollArea>

				{/* 메인 채팅 영역 */}
				<div className="relative flex h-full flex-col">
					<div className="mx-auto flex w-full max-w-screen-sm h-full flex-col">
						{/* 퀴즈 공지 영역 */}
						<AnimatePresence initial={false}>
							{chatStarted && (
								<motion.div
									key="notice"
									initial={{ y: -20, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									exit={{ y: -20, opacity: 0 }}
									transition={{ type: "spring", stiffness: 260, damping: 24 }}
									className="flex-shrink-0"
								>
									<QuizNotice
										title={QUIZ.title}
										description={QUIZ.description}
										collapsed={collapsed}
										onToggle={() => setCollapsed((v) => !v)}
										guideOpen={guideOpen}
										onGuideToggle={() => setGuideOpen(!guideOpen)}
									/>
								</motion.div>
							)}
						</AnimatePresence>

						{/* 채팅 컨테이너 - 남은 공간 모두 차지, relative 포지션 추가 */}
						<div className="flex-1 min-h-0 relative">
							<ChatContainer
								onFirstMessage={() => setChatStarted(true)}
								unlockedHints={unlockedHints}
								onUnlockHint={handleUnlockHint}
								onConfirmAnswer={handleConfirmAnswer}
								guideOpen={guideOpen}
								onGuideToggle={() => setGuideOpen(!guideOpen)}
							/>
						</div>

						{/* 광고 영역 */}
						{process.env.NEXT_PUBLIC_ENABLE_ADS === "true" && (
							<div className="flex-shrink-0 mx-auto mt-4 w-full max-w-screen-sm px-4">
								<AdSlot
									className="w-full grid place-items-center"
									unitPath={process.env.NEXT_PUBLIC_GAM_UNIT_PATH || "/6355419/Travel/Europe/France/Paris"}
									sizes={[[320, 50], [300, 250], [728, 90]]}
									mapping={[
										{ viewport: [0, 0], sizes: [[320, 50], [300, 250]] },
										{ viewport: [768, 0], sizes: [[728, 90], [300, 250]] }
									]}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
} 
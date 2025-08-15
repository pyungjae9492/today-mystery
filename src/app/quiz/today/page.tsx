"use client"

import React from "react"
import { useEffect, useState } from "react"
import { QuizNotice } from "@/domain/quiz/_components/quiz-notice"
import { ChatContainer } from "@/domain/quiz/_components/chat-container"
import { motion, AnimatePresence } from "framer-motion"

import { GuideModal } from "@/domain/quiz/_components/guide-modal"
import { useLocalStorage, useMediaQuery } from "usehooks-ts"
import AdSlot from "@/components/ad-slot"

export default function ToadyPage() {
	const [collapsed, setCollapsed] = useLocalStorage<boolean>("toady:collapsed", false)
	const [chatStarted, setChatStarted] = useLocalStorage<boolean>("toady:chatStarted", false)
	const [guideShown, setGuideShown] = useLocalStorage<boolean>("toady:guideShown", false)
	const [mounted, setMounted] = useState(false)
	const isMobile = useMediaQuery("(max-width: 767px)")
	const [guideOpen, setGuideOpen] = useState(false)

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

	const QUIZ = {
		title: "바다거북스프: 새벽 배달",
		description:
			"한 남자가 새벽에 택배를 받았다. 상자를 열어 본 그는 즉시 경찰에 신고했다. 왜?",
	}

	// 하이드레이션 에러 방지를 위해 mounted 전까지는 기본값 사용
	if (!mounted) {
		return (
			<div className="dark h-svh bg-neutral-900 text-white overflow-hidden">
				<div className="mx-auto grid min-h-svh max-w-screen-lg grid-cols-1 md:grid-cols-2">
					<div className="hidden md:block border-r border-white/10 bg-neutral-950/40 p-6">
						<h1 className="text-lg font-semibold">
							<span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-purple-400 bg-[length:200%_100%] bg-clip-text text-transparent">
								{QUIZ.title}
							</span>
						</h1>
						<p className="mt-2 text-sm text-neutral-300 leading-relaxed">{QUIZ.description}</p>
						<div className="mt-4 text-xs text-neutral-400 space-y-1">
							<p>예/아니오 질문으로 사건의 전말을 추리하세요.</p>
							<p>@힌트, @정답, @포기 명령을 사용할 수 있어요.</p>
						</div>
					</div>
					<div className="flex min-h-svh flex-col">
						<div className="mx-auto flex w-full max-w-screen-sm flex-1 flex-col">
							<div className="flex-1 grid place-items-center px-6 md:hidden">
								<div className="w-full rounded-xl border border-white/10 bg-neutral-950 p-5 text-center">
									<h1 className="text-base font-semibold">
										<span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-purple-400 bg-[length:200%_100%] bg-clip-text text-transparent">
											{QUIZ.title}
										</span>
									</h1>
									<p className="mt-2 text-sm text-neutral-300 leading-relaxed">{QUIZ.description}</p>
									<p className="mt-4 text-xs text-neutral-500">메시지를 보내면 채팅이 시작됩니다.</p>
								</div>
							</div>
							<div className="relative flex min-h-0 flex-1 flex-col">
								<div className="flex-1" />
							</div>

						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="dark h-svh bg-neutral-900 text-white overflow-hidden">
			<div className="mx-auto grid min-h-svh max-w-screen-lg grid-cols-1 md:grid-cols-2">
				<div className="hidden md:block border-r border-white/10 bg-neutral-950/40 p-6">
					<h1 className="text-lg font-semibold">
						<span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-purple-400 bg-[length:200%_100%] bg-clip-text text-transparent">
							{QUIZ.title}
						</span>
					</h1>
					<p className="mt-2 text-sm text-neutral-300 leading-relaxed">{QUIZ.description}</p>
					<div className="mt-4 text-xs text-neutral-400 space-y-1">
						<p>예/아니오 질문으로 사건의 전말을 추리하세요.</p>
						<p>@힌트, @정답, @포기 명령을 사용할 수 있어요.</p>
					</div>
				</div>

				<div className="flex min-h-svh flex-col">
					<div className="mx-auto flex w-full max-w-screen-sm flex-1 flex-col">
						<AnimatePresence initial={false}>
							{chatStarted ? (
								<motion.div
									key="notice"
									initial={{ y: -20, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									exit={{ y: -20, opacity: 0 }}
									transition={{ type: "spring", stiffness: 260, damping: 24 }}
								>
									<QuizNotice
										title={QUIZ.title}
										description={QUIZ.description}
										collapsed={collapsed}
										onToggle={() => setCollapsed((v) => !v)}
									/>
								</motion.div>
							) : (
								<motion.div
									key="hero"
									initial={{ y: 0, opacity: 1 }}
									animate={{ y: 0, opacity: 1 }}
									exit={{ y: -40, opacity: 0 }}
									transition={{ type: "spring", stiffness: 260, damping: 26 }}
									className="flex-1 grid place-items-center px-6 md:hidden"
								>
									<div className="w-full rounded-xl border border-white/10 bg-neutral-950 p-5 text-center">
										<h1 className="text-base font-semibold">
											<motion.span
												initial={{ backgroundPosition: "0% 50%" }}
												animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
												transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
												className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-purple-400 bg-[length:200%_100%] bg-clip-text text-transparent"
											>
												{QUIZ.title}
											</motion.span>
										</h1>
										<p className="mt-2 text-sm text-neutral-300 leading-relaxed">{QUIZ.description}</p>
										<p className="mt-4 text-xs text-neutral-500">메시지를 보내면 채팅이 시작됩니다.</p>
									</div>
								</motion.div>
							)}
						</AnimatePresence>

						<div className="relative flex min-h-0 flex-1 flex-col">
							<AnimatePresence initial={false}>
								{chatStarted ? (
									<motion.div
										key="chat"
										initial={{ y: 40, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										exit={{ y: 40, opacity: 0 }}
										transition={{ type: "spring", stiffness: 260, damping: 24 }}
										className="flex min-h-0 flex-1 flex-col"
									>
										<ChatContainer />
									</motion.div>
								) : (
									<motion.div key="spacer" className="flex-1" />
								)}
							</AnimatePresence>
						</div>

						{process.env.NEXT_PUBLIC_ENABLE_ADS === "true" && (
							<div className="mx-auto mt-4 w-full max-w-screen-sm px-4">
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

			{/* 모바일 가이드 모달 */}
			<GuideModal open={guideOpen} onOpenChange={setGuideOpen} />
		</div>
	)
} 
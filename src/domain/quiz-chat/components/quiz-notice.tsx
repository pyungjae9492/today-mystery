"use client"

import { ChevronDown, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { SidebarGuide } from "./sidebar-guide"
import { GuideModal } from "./guide-modal"
import { useMediaQuery } from "usehooks-ts"
import { useState } from "react"

interface QuizNoticeProps {
	title: string
	description: string
	collapsed: boolean
	onToggle: () => void

	onGuideToggle?: () => void
	guideOpen?: boolean
}

export function QuizNotice({ title, description, collapsed, onToggle, guideOpen = false, onGuideToggle }: QuizNoticeProps) {
	
	const [localGuideOpen, setLocalGuideOpen] = useState(false)
	
	// 외부에서 전달된 상태가 있으면 사용, 없으면 로컬 상태 사용
	const isGuideOpen = guideOpen !== undefined ? guideOpen : localGuideOpen
	const handleGuideToggle = onGuideToggle || (() => setLocalGuideOpen(!localGuideOpen))
	
	const isMobile = useMediaQuery("(max-width: 767px)")
	
	// 모바일에서는 모달을 열고, PC에서는 사이드바를 토글
	const handleGuideClick = () => {
		handleGuideToggle()
	}

	return (
		<>
			<div className="sticky top-0 z-30 bg-neutral-900/90 backdrop-blur relative">
				<motion.div
					initial={{ y: -20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ type: "spring", stiffness: 260, damping: 24 }}
					className={cn(
						"flex items-center justify-between px-4 py-3",
						"text-white border-b border-white/10",
						"rounded-none"
					)}
				>
					<div className="min-w-0 pr-2 flex-1">
						<p className="text-sm font-semibold truncate">
							<motion.span
								initial={{ opacity: 0, y: -4 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.25 }}
							>
								{title}
							</motion.span>
						</p>
					</div>
					<div className="flex items-center gap-2">
						{/* 가이드 버튼 */}
						<button
							onClick={handleGuideClick}
							className="shrink-0 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-white border border-blue-500/40 bg-blue-600 hover:bg-blue-500 active:scale-[0.98]"
							aria-label="게임 가이드 보기"
						>
							<HelpCircle size={16} />
							<span className="hidden sm:inline">가이드</span>
						</button>
						
						{/* 접기 버튼 */}
						<button
							className="shrink-0 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-white border border-purple-500/40 bg-purple-600 hover:bg-purple-500 active:scale-[0.98]"
							onClick={onToggle}
							aria-label={collapsed ? "공지 펼치기" : "공지 접기"}
						>
							<motion.span
								initial={false}
								animate={{ rotate: collapsed ? 0 : 180 }}
								transition={{ type: "spring", stiffness: 300, damping: 20 }}
								className="inline-flex"
							>
								<ChevronDown size={16} />
							</motion.span>
							<span className="hidden sm:inline">{collapsed ? "열기" : "접기"}</span>
						</button>
					</div>
				</motion.div>

				{/* 드롭다운 공지: 헤더 바로 아래 absolute로 표시 */}
				<AnimatePresence initial={false}>
					{!collapsed && (
						<motion.div
							key="notice-panel"
							initial={{ opacity: 0, y: -6, height: 0 }}
							animate={{ opacity: 1, y: 0, height: "auto" }}
							exit={{ opacity: 0, y: -6, height: 0 }}
							transition={{ duration: 0.2 }}
							className="absolute left-0 right-0 top-full px-4"
						>
							<div className="mt-2 rounded-lg border border-white/10 bg-neutral-950/95 p-3 shadow-xl">
								<p className="text-xs text-neutral-300 leading-relaxed">
									{description}
								</p>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* 모바일 가이드 모달 */}
			{isMobile && <GuideModal open={isGuideOpen} onOpenChange={handleGuideToggle} />}
		</>
	)
} 
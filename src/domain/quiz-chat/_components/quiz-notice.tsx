"use client"

import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import React from "react"
import { AnimatePresence, motion } from "framer-motion"

interface QuizNoticeProps {
	title: string
	description: string
	collapsed: boolean
	onToggle: () => void
}

export function QuizNotice({ title, description, collapsed, onToggle }: QuizNoticeProps) {
	return (
		<div className="sticky top-0 z-20">
			<motion.div
				initial={{ y: -20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ type: "spring", stiffness: 260, damping: 24 }}
				className={cn(
					"flex items-center justify-between px-4 py-3",
					"bg-neutral-900/90 backdrop-blur text-white border-b border-white/10",
					"rounded-none"
				)}
			>
				<div className="min-w-0 pr-2">
					<p className="text-sm font-semibold truncate">
						<motion.span
							initial={{ opacity: 0, y: -4 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.25 }}
						>
							{title}
						</motion.span>
					</p>
					<AnimatePresence initial={false}>
						{!collapsed && (
							<motion.p
								key="desc"
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.25 }}
								className="mt-1 text-xs text-neutral-300 leading-relaxed overflow-hidden"
							>
								{description}
							</motion.p>
						)}
					</AnimatePresence>
				</div>
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
					<span>{collapsed ? "열기" : "접기"}</span>
				</button>
			</motion.div>
		</div>
	)
} 
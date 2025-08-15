"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export type ChatRole = "user" | "assistant"

interface ChatMessageProps {
	role: ChatRole
	content: string
}

export function ChatMessage({ role, content }: ChatMessageProps) {
	const isUser = role === "user"
	return (
		<div className={cn("w-full flex", isUser ? "justify-end" : "justify-start")}> 
			<motion.div
				initial={{ y: 8, opacity: 0, scale: 0.98 }}
				animate={{ y: 0, opacity: 1, scale: 1 }}
				transition={{ duration: 0.18 }}
				className={cn(
					"max-w-[80%] rounded-lg px-3 py-2 text-sm leading-relaxed",
					"font-mono",
					isUser
						? "bg-purple-600 text-white border border-purple-400/60 shadow-[0_0_0_1px_rgba(168,85,247,0.35)]"
						: "bg-neutral-950 text-purple-300 border border-purple-500/25 shadow-[0_0_0_1px_rgba(168,85,247,0.15)]"
				)}
			>
				{content}
			</motion.div>
		</div>
	)
} 
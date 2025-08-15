"use client"

import React from "react"
import { useRef, useState } from "react"
import { Send, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import * as Popover from "@radix-ui/react-popover"

interface MessageInputProps {
	placeholder?: string
	onSend: (text: string) => void
	disabled?: boolean
}

const SHORTCUTS = [
	{ label: "@힌트", value: "@힌트" },
	{ label: "@정답", value: "@정답" },
	{ label: "@포기", value: "@포기" },
	{ label: "예/아니오 질문", value: "이 사건에서 X는 관련이 있나요?" },
]

export function MessageInput({ placeholder = "질문을 입력하세요...", onSend, disabled }: MessageInputProps) {
	const [text, setText] = useState("")
	const [isSubmitting, setIsSubmitting] = useState(false)
	const textRef = useRef<HTMLTextAreaElement | null>(null)

	async function handleSubmit() {
		const value = text.trim()
		if (!value || disabled || isSubmitting) return
		
		setIsSubmitting(true)
		try {
			await onSend(value)
			setText("")
		} finally {
			setIsSubmitting(false)
		}
	}

	function insertAtCursor(insert: string) {
		const el = textRef.current
		if (!el) return
		const start = el.selectionStart ?? text.length
		const end = el.selectionEnd ?? text.length
		const next = text.slice(0, start) + insert + text.slice(end)
		setText(next)
		requestAnimationFrame(() => {
			const pos = start + insert.length
			el.selectionStart = el.selectionEnd = pos
			el.focus()
		})
	}

	const isDisabled = disabled || isSubmitting

	return (
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
							title="숏컷"
							aria-label="숏컷"
							disabled={isDisabled}
						>
							<Plus size={18} />
						</button>
					</Popover.Trigger>
					<Popover.Portal>
						<Popover.Content
							className="z-50 w-56 rounded-md border border-white/10 bg-neutral-950 p-2 shadow-xl"
							align="start"
							sideOffset={8}
						>
							<div className="grid gap-1">
								{SHORTCUTS.map((s) => (
									<button
										key={s.label}
										onClick={() => insertAtCursor(s.value)}
										className="w-full text-left rounded px-2 py-1 text-xs text-neutral-200 hover:bg-neutral-800"
									>
										{s.label}
									</button>
								))}
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
	)
} 
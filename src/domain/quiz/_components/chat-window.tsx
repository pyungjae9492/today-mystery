"use client"

import React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessage, ChatRole } from "./chat-message"
import * as Dialog from "@radix-ui/react-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { useLocalStorage, useEventListener } from "usehooks-ts"

interface ChatWindowProps {
	onFirstMessage?: () => void
	onThinkingChange?: (isThinking: boolean) => void
}

type Message = { id: string; role: ChatRole; content: string }

type SendEvent = CustomEvent<{ text: string }>

type HistoryItem = { role: ChatRole; content: string }

const HINTS = [
	"힌트: 물건보다는 상황이 중요해요.",
	"힌트: 시간대가 핵심일 수 있어요.",
	"힌트: 인물의 의도에 주목해보세요.",
	"힌트: 장소가 바뀌면 답이 보일지도?",
]

const ANSWER = "정답: 상자 안에 드라이아이스가 있었고, 남자는 연기를 보고 화재로 오해해 신고했다."

export function ChatWindow({ onFirstMessage, onThinkingChange }: ChatWindowProps) {
	// localStorage keys
	const LS_KEY_MESSAGES = "toady:messages"
	const LS_KEY_ANSWER_OPEN = "toady:answerOpen"
	const LS_KEY_SESSION = "toady:sessionId"

	const [messages, setMessages] = useLocalStorage<Message[]>(LS_KEY_MESSAGES, [])
	const [isThinking, setIsThinking] = useState(false)
	const [answerOpen, setAnswerOpen] = useLocalStorage<boolean>(LS_KEY_ANSWER_OPEN, false)
	const [sessionId, setSessionId] = useLocalStorage<string>(LS_KEY_SESSION, "")
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
		if (!trimmed || isThinking) return
		
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
				body: JSON.stringify({ sessionId, quizId: "toady-001", text, history })
			})
			if (!res.ok) throw new Error("chat api error")
			const data = await res.json()
			const reply = typeof data?.reply === "string" ? data.reply : "관련 없음."
			addMessage("assistant", reply)
		} catch (err) {
			addMessage("assistant", "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
		} finally {
			setIsThinking(false)
		}
	}, [messages, onFirstMessage, sessionId, addMessage, setAnswerOpen, isThinking])

	useEventListener("toady:send" as unknown as keyof WindowEventMap, (e: Event) => {
		const ce = e as SendEvent
		const text = ce.detail?.text
		if (typeof text === "string") handleSend(text)
	})

	function pickHint() {
		return HINTS[Math.floor(Math.random() * HINTS.length)]
	}

	return (
		<div className="flex h-[calc(100svh-140px)] flex-col">
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
					<AnimatePresence>{isThinking && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ChatMessage role="assistant" content="…" /></motion.div>)}</AnimatePresence>
				</div>
			</ScrollArea>

			<Dialog.Root open={answerOpen} onOpenChange={setAnswerOpen}>
				<Dialog.Portal>
					<Dialog.Overlay className="fixed inset-0 bg-black/70" />
					<Dialog.Content className="fixed inset-x-4 bottom-8 rounded-lg border border-white/10 bg-neutral-950 p-4 shadow-2xl">
						<Dialog.Title className="text-sm font-semibold text-white">정답</Dialog.Title>
						<p className="mt-2 text-sm text-neutral-300 leading-relaxed">{ANSWER}</p>
						<div className="mt-3 flex justify-end">
							<Dialog.Close asChild>
								<button className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-black hover:bg-green-500">닫기</button>
							</Dialog.Close>
						</div>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</div>
	)
} 
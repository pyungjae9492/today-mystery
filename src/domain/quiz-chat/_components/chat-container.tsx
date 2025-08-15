"use client"

import React from "react"
import { useRef, useState } from "react"
import { useEventListener } from "usehooks-ts"
import { ChatWindow } from "./chat-window"
import { MessageInput } from "./message-input"

interface ChatContainerProps {
	onFirstMessage?: () => void
}

export function ChatContainer({ onFirstMessage }: ChatContainerProps) {
	const sentRef = useRef(false)
	const [isThinking, setIsThinking] = useState(false)

	useEventListener("toady:send" as unknown as keyof WindowEventMap, () => {
		if (!sentRef.current) {
			onFirstMessage?.()
			sentRef.current = true
		}
	})

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<ChatWindow onFirstMessage={onFirstMessage} onThinkingChange={setIsThinking} />
			<MessageInput 
				onSend={(text) => {
					window.dispatchEvent(new CustomEvent("toady:send", { detail: { text } }))
				}} 
				disabled={isThinking}
			/>
		</div>
	)
} 
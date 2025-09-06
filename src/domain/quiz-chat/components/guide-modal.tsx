"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { HelpCircle, Lightbulb, Target, X, RotateCcw, MessageSquare, CheckCircle, Eye, Zap, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface GuideModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function GuideModal({ open, onOpenChange }: GuideModalProps) {
	const [currentCard, setCurrentCard] = useState(0)
	
	const cards = [
		{
			title: "게임 소개",
			icon: Target,
			content: (
				<div className="space-y-4">
					<p className="text-sm text-neutral-300 leading-relaxed">
						바다거북스프는 짧은 시나리오를 단서로 사건의 전말을 유추하는 추리 게임입니다. 플레이어는 <strong className="text-purple-400">예/아니오</strong>로만 대답 가능한 질문을 던지며 퍼즐을 풀어갑니다.
					</p>
					<p className="text-sm text-neutral-300 leading-relaxed">
						친구들과 너무 재밌게 즐겼던 바다거북스프를 <strong className="text-purple-400">사회자 없이도</strong> 즐길 수 있도록 AI가 진행을 맡는 형태로 만들었습니다.
					</p>
				</div>
			)
		},
		{
			title: "질문하는 법",
			icon: MessageSquare,
			content: (
				<div className="space-y-4">
					<div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
						<h4 className="text-purple-400 font-medium mb-3">✅ 올바른 질문 방법</h4>
						<ul className="space-y-2 text-sm text-neutral-300">
							<li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">•</span><span><strong>예/아니오로 답할 수 있는 질문만:</strong> "~인가요?", "~입니까?"</span></li>
							<li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">•</span><span><strong>핵심 요소 추리:</strong> 사건의 원인, 장소, 인물, 상황 등을 질문</span></li>
							<li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">•</span><span><strong>단계적 접근:</strong> 넓은 범위에서 시작해 점점 좁혀가기</span></li>
						</ul>
					</div>
					<div className="bg-red-950/30 border border-red-800/50 rounded-lg p-4">
						<h4 className="text-red-400 font-medium mb-3">❌ 피해야 할 질문</h4>
						<ul className="space-y-2 text-sm text-neutral-300">
							<li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">•</span><span>"왜?", "어떻게?" 등 개방형 질문</span></li>
							<li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">•</span><span>여러 질문을 한 번에 묻는 복합 질문</span></li>
							<li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">•</span><span>"정답이 ~인가요?" 형태의 추측성 질문</span></li>
						</ul>
					</div>
				</div>
			)
		},
		{
			title: "힌트 활용",
			icon: Eye,
			content: (
				<div className="space-y-4">
					<div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
						<h4 className="text-purple-400 font-medium mb-3">💡 힌트 사용법</h4>
						<ul className="space-y-2 text-sm text-neutral-300">
							<li className="flex items-start gap-2"><span className="text-yellow-400 mt-0.5">•</span><span>막혔을 때 입력창 좌측의 <strong>+ 버튼</strong>을 누르세요</span></li>
							<li className="flex items-start gap-2"><span className="text-yellow-400 mt-0.5">•</span><span>힌트는 순서대로 해금됩니다</span></li>
							<li className="flex items-start gap-2"><span className="text-yellow-400 mt-0.5">•</span><span>힌트를 보고도 모르겠다면 다른 각도로 질문해보세요</span></li>
						</ul>
					</div>
				</div>
			)
		},
		{
			title: "정답 확인",
			icon: CheckCircle,
			content: (
				<div className="space-y-4">
					<div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
						<h4 className="text-purple-400 font-medium mb-3">✅ 정답 확인하기</h4>
						<ul className="space-y-2 text-sm text-neutral-300">
							<li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">•</span><span>정답이 궁금하다면 입력창 좌측의 <strong>+ 버튼</strong> → 정답 확인하기</span></li>
							<li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">•</span><span>정답을 맞추면 오늘의 퀴즈가 완료됩니다</span></li>
							<li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">•</span><span>틀렸다면 계속 질문하며 단서를 모아보세요</span></li>
						</ul>
					</div>
				</div>
			)
		}
	]
	
	const nextCard = () => setCurrentCard((prev) => (prev + 1) % cards.length)
	const prevCard = () => setCurrentCard((prev) => (prev - 1 + cards.length) % cards.length)
	
	const handleOpenChange = (newOpen: boolean) => {
		onOpenChange(newOpen)
	}
	
	return (
		<Dialog.Root open={open} onOpenChange={handleOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-50" />
				<Dialog.Content className="md:hidden fixed inset-x-4 bottom-8 rounded-lg border border-white/10 bg-neutral-950 p-4 shadow-2xl h-[70vh] overflow-hidden z-50">
					<div className="flex items-center justify-between mb-4 flex-shrink-0">
						<Dialog.Title className="text-sm font-semibold text-white flex items-center gap-2">
							<HelpCircle className="w-4 h-4" />
							게임 가이드
						</Dialog.Title>
						<Dialog.Close asChild>
							<button className="text-neutral-400 hover:text-white">
								<X className="w-4 h-4" />
							</button>
						</Dialog.Close>
					</div>
					
					{/* 카드 네비게이션 */}
					<div className="flex items-center justify-between mb-2 flex-shrink-0">
						<button
							onClick={prevCard}
							className="p-2 text-neutral-400 hover:text-white disabled:opacity-50"
							disabled={currentCard === 0}
						>
							<ChevronLeft className="w-4 h-4" />
						</button>
						<div className="flex gap-1">
							{cards.map((_, index) => (
								<button
									key={index}
									onClick={() => setCurrentCard(index)}
									className={`w-2 h-2 rounded-full transition-colors ${
										index === currentCard ? "bg-purple-500" : "bg-neutral-600"
									}`}
								/>
							))}
						</div>
						<button
							onClick={nextCard}
							className="p-2 text-neutral-400 hover:text-white disabled:opacity-50"
							disabled={currentCard === cards.length - 1}
						>
							<ChevronRight className="w-4 h-4" />
						</button>
					</div>
				
					{/* 카드 내용 - ScrollArea + 애니메이션 */}
					<div className="flex-1 min-h-0">
						<ScrollArea className="h-full">
							<div className="p-4">
								<AnimatePresence mode="wait">
									<motion.div
										key={currentCard}
										initial={{ opacity: 0, y: 12 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -12 }}
										transition={{ duration: 0.2 }}
									>
										<div className="flex items-center gap-2 mb-4">
											{React.createElement(cards[currentCard].icon, { className: "w-4 h-4 text-purple-400" })}
											<h3 className="text-sm font-semibold text-white">{cards[currentCard].title}</h3>
										</div>
										{cards[currentCard].content}
									</motion.div>
								</AnimatePresence>
							</div>
						</ScrollArea>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
} 
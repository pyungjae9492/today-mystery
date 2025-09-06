"use client"

import { HelpCircle, Lightbulb, Target, MessageSquare, CheckCircle, Eye, Zap, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SidebarGuideProps {
	isOpen: boolean
	onToggle: () => void
}

export function SidebarGuide({ isOpen, onToggle }: SidebarGuideProps) {
	const [currentCard, setCurrentCard] = useState(0)
	
	const cards = [
		{
			title: "게임 소개",
			icon: Target,
			content: (
				<div className="space-y-4">
					<p className="text-sm text-neutral-300 leading-relaxed">
						바다거북스프는 추리 게임입니다. 주어진 시나리오를 바탕으로 <strong className="text-purple-400">예/아니오 질문만</strong>을 통해 사건의 전말을 파악하고 정답을 찾아내는 게임이에요.
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
							<li className="flex items-start gap-2">
								<span className="text-green-400 mt-0.5">•</span>
								<span><strong>예/아니오로 답할 수 있는 질문만:</strong> "~인가요?", "~입니까?" 형태</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-green-400 mt-0.5">•</span>
								<span><strong>핵심 요소 추리:</strong> 사건의 원인, 장소, 인물, 상황 등을 질문</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-green-400 mt-0.5">•</span>
								<span><strong>단계적 접근:</strong> 넓은 범위에서 시작해 점점 좁혀가기</span>
							</li>
						</ul>
					</div>

					<div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
						<h4 className="text-red-400 font-medium mb-3">❌ 피해야 할 질문</h4>
						<ul className="space-y-2 text-sm text-neutral-300">
							<li className="flex items-start gap-2">
								<span className="text-red-400 mt-0.5">•</span>
								<span><strong>개방형 질문:</strong> "어떻게?", "왜?", "무엇을?" 등</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-red-400 mt-0.5">•</span>
								<span><strong>복합 질문:</strong> 여러 질문을 한 번에 묻기</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-red-400 mt-0.5">•</span>
								<span><strong>정답 추측:</strong> "정답이 ~인가요?" 형태의 질문</span>
							</li>
						</ul>
					</div>
				</div>
			)
		},
		{
			title: "추리 전략",
			icon: Lightbulb,
			content: (
				<div className="space-y-4">
					<div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
						<h4 className="text-purple-400 font-medium mb-3">🎯 효과적인 추리 방법</h4>
						<ul className="space-y-3 text-sm text-neutral-300">
							<li className="flex items-start gap-2">
								<span className="text-blue-400 mt-0.5">1.</span>
								<div>
									<strong>시나리오 분석:</strong> 주어진 정보를 꼼꼼히 읽고 핵심 요소 파악
								</div>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-blue-400 mt-0.5">2.</span>
								<div>
									<strong>가설 설정:</strong> 가능한 시나리오를 머릿속으로 정리
								</div>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-blue-400 mt-0.5">3.</span>
								<div>
									<strong>체계적 질문:</strong> 가장 중요한 요소부터 차례대로 확인
								</div>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-blue-400 mt-0.5">4.</span>
								<div>
									<strong>정보 종합:</strong> 답변을 바탕으로 가설을 수정하고 정교화
								</div>
							</li>
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
							<li className="flex items-start gap-2">
								<span className="text-yellow-400 mt-0.5">•</span>
								<span>막혔을 때 상단의 노란색 힌트 버튼을 클릭하세요</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-yellow-400 mt-0.5">•</span>
								<span>힌트는 순서대로 해금되며, 이전 힌트를 봐야 다음 힌트를 볼 수 있어요</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-yellow-400 mt-0.5">•</span>
								<span>힌트를 보고도 모르겠다면, 다른 각도로 질문해보세요</span>
							</li>
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
							<li className="flex items-start gap-2">
								<span className="text-green-400 mt-0.5">•</span>
								<span>정답을 알 것 같다면 상단의 빨간색 정답 버튼을 클릭하세요</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-green-400 mt-0.5">•</span>
								<span>정답을 맞추면 오늘의 퀴즈가 완료됩니다</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-green-400 mt-0.5">•</span>
								<span>틀렸다면 다시 질문을 통해 정답에 가까워져보세요</span>
							</li>
						</ul>
					</div>
				</div>
			)
		}
	]

	const nextCard = () => setCurrentCard((prev) => (prev + 1) % cards.length)
	const prevCard = () => setCurrentCard((prev) => (prev - 1 + cards.length) % cards.length)

	return (
		<>
			{/* 슬라이드 가이드 */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ x: "100%" }}
						animate={{ x: 0 }}
						exit={{ x: "100%" }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
						className="absolute top-0 right-0 h-full w-80 bg-neutral-950 border-l border-white/10 z-40 flex flex-col"
					>
						{/* 헤더 */}
						<div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
							<h2 className="text-sm font-semibold text-white flex items-center gap-2">
								<HelpCircle className="w-4 h-4" />
								게임 가이드
							</h2>
							<button
								onClick={onToggle}
								className="text-neutral-400 hover:text-white"
							>
								<ChevronRight className="w-4 h-4" />
							</button>
						</div>

						{/* 카드 네비게이션 */}
						<div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
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

						{/* 카드 내용 - ScrollArea 사용 */}
						<div className="flex-1 min-h-0">
							<ScrollArea className="h-full">
								<div className="p-4">
									<div className="flex items-center gap-2 mb-4">
										{React.createElement(cards[currentCard].icon, { className: "w-4 h-4 text-purple-400" })}
										<h3 className="text-sm font-semibold text-white">{cards[currentCard].title}</h3>
									</div>
									{cards[currentCard].content}
								</div>
							</ScrollArea>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	)
} 
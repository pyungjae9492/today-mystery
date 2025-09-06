"use client"

import { HelpCircle, Lightbulb, Target, MessageSquare, CheckCircle, Eye, Zap, ArrowLeft } from "lucide-react"
import { useState } from "react"
import type { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface FaqItem {
	id: string
	title: string
	content: ReactNode
}

export function DetailedGuide() {
	const [activeId, setActiveId] = useState<string | null>(null)

	const faqs: FaqItem[] = [
		{
			id: "ask",
			title: "1. 질문하는 법",
			content: (
				<div className="space-y-4">
					<div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
						<h4 className="text-purple-400 font-medium mb-3">✅ 올바른 질문 방법</h4>
						<ul className="space-y-2 text-sm text-neutral-300">
							<li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">•</span><span><strong>예/아니오로 답할 수 있는 질문만:</strong> {'"~인가요?"'}, {'"~입니까?"'}</span></li>
							<li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">•</span><span><strong>핵심 요소 추리:</strong> 사건의 원인, 장소, 인물, 상황 등을 질문</span></li>
							<li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">•</span><span><strong>단계적 접근:</strong> 넓은 범위에서 시작해 점점 좁혀가기</span></li>
						</ul>
					</div>

					<div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
						<h4 className="text-purple-400 font-medium mb-3">💡 좋은 질문 예시</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
							<div>
								<p className="text-neutral-200 font-medium mb-2">사건 관련:</p>
								<ul className="space-y-1 text-neutral-300 ml-3">
									<li>• {'"사람이 죽었나요?"'}</li>
									<li>• {'"범인이 한 명인가요?"'}</li>
									<li>• {'"사건이 실내에서 일어났나요?"'}</li>
									<li>• {'"특별한 도구가 사용되었나요?"'}</li>
								</ul>
							</div>
							<div>
								<p className="text-neutral-200 font-medium mb-2">상황 관련:</p>
								<ul className="space-y-1 text-neutral-300 ml-3">
									<li>• {'"날씨가 영향을 주었나요?"'}</li>
									<li>• {'"시간이 중요한 요소인가요?"'}</li>
									<li>• {'"돈이 관련되어 있나요?"'}</li>
									<li>• {'"감정이 원인이었나요?"'}</li>
								</ul>
							</div>
						</div>
					</div>

					<div className="bg-red-950/30 border border-red-800/50 rounded-lg p-4">
						<h4 className="text-red-400 font-medium mb-3">❌ 피해야 할 질문</h4>
						<ul className="space-y-2 text-sm text-neutral-300">
							<li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">•</span><span>{'"왜 그랬을까요?"'} (이유 묻기)</span></li>
							<li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">•</span><span>{'"어디서 일어났나요?"'} (구체적 장소)</span></li>
							<li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">•</span><span>{'"누가 했나요?"'} (구체적 인물)</span></li>
							<li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">•</span><span>{'"어떻게 했나요?"'} (구체적 방법)</span></li>
						</ul>
					</div>
				</div>
			)
		},
		{
			id: "answer",
			title: "2. 정답 맞추는 법",
			content: (
				<div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
					<div className="space-y-3 text-sm text-neutral-300">
						<div className="flex items-start gap-2"><span className="text-green-400 mt-0.5">•</span><span><strong>충분한 정보 수집:</strong> 핵심적인 요소들을 모두 파악했다고 생각될 때</span></div>
						<div className="flex items-start gap-2"><span className="text-green-400 mt-0.5">•</span><span><strong>정답 추측:</strong> {'"정답은 ~입니다"'} 형태로 직접 말해보세요</span></div>
						<div className="flex items-start gap-2"><span className="text-green-400 mt-0.5">•</span><span><strong>정답 확인:</strong> 맞으면 게임 완료, 틀리면 계속 질문 가능</span></div>
					</div>
					<div className="mt-4 p-3 bg-green-950/30 border border-green-800/50 rounded">
						<p className="text-sm text-green-300"><strong>💡 팁:</strong> 너무 성급하게 추측하지 말고, 최소 5-10개의 질문을 통해 충분한 정보를 얻은 후 정답을 맞춰보세요.</p>
					</div>
				</div>
			)
		},
		{
			id: "hint",
			title: "3. 힌트 받는 법",
			content: (
				<div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
					<div className="space-y-3 text-sm text-neutral-300">
						<div className="flex items-start gap-2"><span className="text-yellow-400 mt-0.5">•</span><span><strong>메뉴 버튼 클릭:</strong> 입력창 옆의 + 버튼을 클릭하세요</span></div>
						<div className="flex items-start gap-2"><span className="text-yellow-400 mt-0.5">•</span><span><strong>힌트 해금:</strong> {'"힌트 N 해금하기"'} 버튼을 클릭하여 순차적으로 힌트를 받으세요</span></div>
						<div className="flex items-start gap-2"><span className="text-yellow-400 mt-0.5">•</span><span><strong>전략적 사용:</strong> 막혔을 때만 힌트를 사용하고, 너무 빨리 모든 힌트를 보지 마세요</span></div>
					</div>
					<div className="mt-4 p-3 bg-yellow-950/30 border border-yellow-800/50 rounded">
						<p className="text-sm text-yellow-300"><strong>💡 팁:</strong> 힌트는 최후의 수단으로 사용하세요. 먼저 스스로 추리해보는 것이 더 재미있습니다!</p>
					</div>
				</div>
			)
		},
		{
			id: "giveup",
			title: "4. 포기하고 정답 보는 법",
			content: (
				<div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
					<div className="space-y-3 text-sm text-neutral-300">
						<div className="flex items-start gap-2"><span className="text-red-400 mt-0.5">•</span><span><strong>메뉴 버튼 클릭:</strong> 채팅창 좌측의 + 버튼을 클릭하세요</span></div>
						<div className="flex items-start gap-2"><span className="text-red-400 mt-0.5">•</span><span><strong>정답 확인:</strong> {'"정답 확인하기"'} 버튼을 클릭하세요</span></div>
						<div className="flex items-start gap-2"><span className="text-red-400 mt-0.5">•</span><span><strong>정답 확인 완료:</strong> 정답을 확인한 후 {'"정답 확인 완료"'} 버튼을 클릭하면 게임이 완료됩니다</span></div>
					</div>
					<div className="mt-4 p-3 bg-red-950/30 border border-red-800/50 rounded">
						<p className="text-sm text-red-300"><strong>⚠️ 주의:</strong> 정답을 확인하면 게임이 완료되므로, 정말 포기할 때만 사용하세요. 다음 날까지 기다려야 새로운 퀴즈를 풀 수 있습니다.</p>
					</div>
				</div>
			)
		},
		{
			id: "controls",
			title: "조작법",
			content: (
				<div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
						<div>
							<h4 className="text-neutral-200 font-medium mb-2">키보드 단축키:</h4>
							<div className="space-y-2">
								<div className="flex items-center gap-3"><span className="bg-neutral-700 px-2 py-1 rounded font-mono text-xs">Enter</span><span className="text-neutral-300">메시지 전송</span></div>
								<div className="flex items-center gap-3"><span className="bg-neutral-700 px-2 py-1 rounded font-mono text-xs">Shift + Enter</span><span className="text-neutral-300">줄바꿈</span></div>
							</div>
						</div>
						<div>
							<h4 className="text-neutral-200 font-medium mb-2">성공 전략:</h4>
							<ul className="space-y-1 text-neutral-300">
								<li>• 핵심적인 요소부터 질문하기</li>
								<li>• 너무 구체적이지 않게 질문하기</li>
								<li>• 이전 답변을 바탕으로 다음 질문 계획하기</li>
								<li>• 정답이 확실할 때만 추측하기</li>
							</ul>
						</div>
					</div>
				</div>
			)
		},
	]

	if (activeId) {
		const item = faqs.find(f => f.id === activeId)
		return (
			<AnimatePresence mode="wait">
				<motion.div
					key={activeId}
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -16 }}
					transition={{ duration: 0.25 }}
					className="space-y-4"
				>
					<button onClick={() => setActiveId(null)} className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white">
						<ArrowLeft className="w-4 h-4" />
						뒤로가기
					</button>
					<h3 className="font-semibold text-white mb-2 flex items-center gap-2">
						<HelpCircle className="w-4 h-4" />
						{item?.title}
					</h3>
					<div>{item?.content}</div>
				</motion.div>
			</AnimatePresence>
		)
	}

	return (
		<div className="flex flex-col justify-between h-full">
			{/* 상단 고정: 확장된 게임 소개 */}
			<div className="flex flex-col gap-2">
				<h3 className="font-semibold text-white mb-1 flex items-center gap-2">
					<Target className="w-4 h-4" />
					게임 소개
				</h3>
				<div className="rounded-lg border border-white/10 bg-neutral-900/60 p-4 text-sm text-neutral-300 leading-relaxed">
					<p>바다거북스프는 짧은 시나리오를 단서로 사건의 전말을 유추하는 추리 게임입니다. 플레이어는 <strong className="text-purple-400">예/아니오</strong>로만 대답 가능한 질문을 던지며 퍼즐을 풀어갑니다. 혼자 또는 친구들과 가볍게 즐기기에 좋아요.</p>
					<p className="mt-3">이 프로젝트는 “사회자 없이도 언제든 즐길 수 있게”라는 취지에서 시작됐습니다. <strong className="text-purple-400">친구들과 바다거북스프를 정말 재밌게 즐겼는데, 문제를 아는 사회자가 없어도 AI가 사회자를 대신하면 어떨까?</strong> 하는 마음으로 만들었습니다.</p>
					<p className="mt-3">좌측 채팅창에서 질문을 입력해 보세요. 가끔 막히면 + 메뉴에서 힌트를 열어볼 수 있고, 포기하고 정답을 볼 수도 있습니다.</p>
				</div>
			</div>

			{/* 하단: FAQ 목록 */}
			<AnimatePresence mode="wait">
				<motion.div
					key="faq-list"
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 12 }}
					transition={{ duration: 0.2 }}
					className="flex flex-col gap-2"
				>
					<h4 className="font-semibold text-white/90 flex items-center gap-2"><HelpCircle className="w-4 h-4" />자주 묻는 질문</h4>
					<div className="divide-y divide-white/10 rounded-lg border border-white/10 overflow-hidden">
						{faqs.map((f) => (
							<button
								key={f.id}
								onClick={() => setActiveId(f.id)}
								className="w-full text-left px-3 py-3 hover:bg-white/5 focus:bg-white/5"
							>
								<p className="text-sm text-white/90">{f.title}</p>
							</button>
						))}
					</div>
				</motion.div>
			</AnimatePresence>
		</div>
	)
} 
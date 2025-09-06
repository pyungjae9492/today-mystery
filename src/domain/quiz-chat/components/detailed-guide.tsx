"use client"

import { HelpCircle, Lightbulb, Target, MessageSquare, CheckCircle, Eye, Zap } from "lucide-react"

export function DetailedGuide() {
	return (
		<div className="space-y-8">
			{/* 게임 소개 */}
			<div>
				<h3 className="font-semibold text-white mb-3 flex items-center gap-2">
					<Target className="w-4 h-4" />
					게임 소개
				</h3>
				<p className="text-sm text-neutral-300 leading-relaxed">
					바다거북스프는 추리 게임입니다. 주어진 시나리오를 바탕으로 <strong className="text-purple-400">예/아니오 질문만</strong>을 통해 사건의 전말을 파악하고 정답을 찾아내는 게임이에요.
				</p>
			</div>

			{/* 1. 질문하는 법 */}
			<div>
				<h3 className="font-semibold text-white mb-4 flex items-center gap-2">
					<MessageSquare className="w-4 h-4" />
					1. 질문하는 법
				</h3>
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
						<h4 className="text-purple-400 font-medium mb-3">💡 좋은 질문 예시</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
							<div>
								<p className="text-neutral-200 font-medium mb-2">사건 관련:</p>
								<ul className="space-y-1 text-neutral-300 ml-3">
									<li>• "사람이 죽었나요?"</li>
									<li>• "범인이 한 명인가요?"</li>
									<li>• "사건이 실내에서 일어났나요?"</li>
									<li>• "특별한 도구가 사용되었나요?"</li>
								</ul>
							</div>
							<div>
								<p className="text-neutral-200 font-medium mb-2">상황 관련:</p>
								<ul className="space-y-1 text-neutral-300 ml-3">
									<li>• "날씨가 영향을 주었나요?"</li>
									<li>• "시간이 중요한 요소인가요?"</li>
									<li>• "돈이 관련되어 있나요?"</li>
									<li>• "감정이 원인이었나요?"</li>
								</ul>
							</div>
						</div>
					</div>

					<div className="bg-red-950/30 border border-red-800/50 rounded-lg p-4">
						<h4 className="text-red-400 font-medium mb-3">❌ 피해야 할 질문</h4>
						<ul className="space-y-2 text-sm text-neutral-300">
							<li className="flex items-start gap-2">
								<span className="text-red-400 mt-0.5">•</span>
								<span>"왜 그랬을까요?" (이유 묻기)</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-red-400 mt-0.5">•</span>
								<span>"어디서 일어났나요?" (구체적 장소)</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-red-400 mt-0.5">•</span>
								<span>"누가 했나요?" (구체적 인물)</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-red-400 mt-0.5">•</span>
								<span>"어떻게 했나요?" (구체적 방법)</span>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* 2. 정답 맞추는 법 */}
			<div>
				<h3 className="font-semibold text-white mb-4 flex items-center gap-2">
					<CheckCircle className="w-4 h-4" />
					2. 정답 맞추는 법
				</h3>
				<div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
					<div className="space-y-3 text-sm text-neutral-300">
						<div className="flex items-start gap-2">
							<span className="text-green-400 mt-0.5">•</span>
							<span><strong>충분한 정보 수집:</strong> 핵심적인 요소들을 모두 파악했다고 생각될 때</span>
						</div>
						<div className="flex items-start gap-2">
							<span className="text-green-400 mt-0.5">•</span>
							<span><strong>정답 추측:</strong> "정답은 ~입니다" 형태로 직접 말해보세요</span>
						</div>
						<div className="flex items-start gap-2">
							<span className="text-green-400 mt-0.5">•</span>
							<span><strong>정답 확인:</strong> 맞으면 게임 완료, 틀리면 계속 질문 가능</span>
						</div>
					</div>
					
					<div className="mt-4 p-3 bg-green-950/30 border border-green-800/50 rounded">
						<p className="text-sm text-green-300">
							<strong>💡 팁:</strong> 너무 성급하게 추측하지 말고, 최소 5-10개의 질문을 통해 충분한 정보를 얻은 후 정답을 맞춰보세요.
						</p>
					</div>
				</div>
			</div>

			{/* 3. 힌트 받는 법 */}
			<div>
				<h3 className="font-semibold text-white mb-4 flex items-center gap-2">
					<Lightbulb className="w-4 h-4" />
					3. 힌트 받는 법
				</h3>
				<div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
					<div className="space-y-3 text-sm text-neutral-300">
						<div className="flex items-start gap-2">
							<span className="text-yellow-400 mt-0.5">•</span>
							<span><strong>메뉴 버튼 클릭:</strong> 입력창 옆의 + 버튼을 클릭하세요</span>
						</div>
						<div className="flex items-start gap-2">
							<span className="text-yellow-400 mt-0.5">•</span>
							<span><strong>힌트 해금:</strong> "힌트 N 해금하기" 버튼을 클릭하여 순차적으로 힌트를 받으세요</span>
						</div>
						<div className="flex items-start gap-2">
							<span className="text-yellow-400 mt-0.5">•</span>
							<span><strong>전략적 사용:</strong> 막혔을 때만 힌트를 사용하고, 너무 빨리 모든 힌트를 보지 마세요</span>
						</div>
					</div>
					
					<div className="mt-4 p-3 bg-yellow-950/30 border border-yellow-800/50 rounded">
						<p className="text-sm text-yellow-300">
							<strong>💡 팁:</strong> 힌트는 최후의 수단으로 사용하세요. 먼저 스스로 추리해보는 것이 더 재미있습니다!
						</p>
					</div>
				</div>
			</div>

			{/* 4. 포기하고 정답 보는 법 */}
			<div>
				<h3 className="font-semibold text-white mb-4 flex items-center gap-2">
					<Eye className="w-4 h-4" />
					4. 포기하고 정답 보는 법
				</h3>
				<div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
					<div className="space-y-3 text-sm text-neutral-300">
						<div className="flex items-start gap-2">
							<span className="text-red-400 mt-0.5">•</span>
							<span><strong>메뉴 버튼 클릭:</strong> 채팅창 우상단의 ⋮ 버튼을 클릭하세요</span>
						</div>
						<div className="flex items-start gap-2">
							<span className="text-red-400 mt-0.5">•</span>
							<span><strong>정답 확인:</strong> "정답 확인하기" 버튼을 클릭하세요</span>
						</div>
						<div className="flex items-start gap-2">
							<span className="text-red-400 mt-0.5">•</span>
							<span><strong>정답 확인 완료:</strong> 정답을 확인한 후 "정답 확인 완료" 버튼을 클릭하면 게임이 완료됩니다</span>
						</div>
					</div>
					
					<div className="mt-4 p-3 bg-red-950/30 border border-red-800/50 rounded">
						<p className="text-sm text-red-300">
							<strong>⚠️ 주의:</strong> 정답을 확인하면 게임이 완료되므로, 정말 포기할 때만 사용하세요. 다음 날까지 기다려야 새로운 퀴즈를 풀 수 있습니다.
						</p>
					</div>
				</div>
			</div>

			{/* 조작법 */}
			<div>
				<h3 className="font-semibold text-white mb-4 flex items-center gap-2">
					<Zap className="w-4 h-4" />
					조작법
				</h3>
				<div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
						<div>
							<h4 className="text-neutral-200 font-medium mb-2">키보드 단축키:</h4>
							<div className="space-y-2">
								<div className="flex items-center gap-3">
									<span className="bg-neutral-700 px-2 py-1 rounded font-mono text-xs">Enter</span>
									<span className="text-neutral-300">메시지 전송</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="bg-neutral-700 px-2 py-1 rounded font-mono text-xs">Shift + Enter</span>
									<span className="text-neutral-300">줄바꿈</span>
								</div>
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
			</div>
		</div>
	)
} 
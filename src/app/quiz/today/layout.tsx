import React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import Script from "next/script"

export const metadata: Metadata = {
	title: "오늘의 미스터리 | 바다거북스프 추리 게임",
	description: "바다거북스프 추리 게임 - 예/아니오 질문으로 오늘의 미스터리를 풀어보세요.",
	keywords: ["바다거북스프", "추리 게임", "오늘의 미스터리", "예/아니오 질문", "추리 퀴즈"],
	openGraph: {
		title: "오늘의 미스터리 | 바다거북스프 추리 게임",
		description: "바다거북스프 추리 게임 - 예/아니오 질문으로 오늘의 미스터리를 풀어보세요.",
		type: "website"
	},
	twitter: {
		card: "summary_large_image",
		title: "오늘의 미스터리 | 바다거북스프",
		description: "바다거북스프 추리 게임 - 예/아니오 질문으로 오늘의 미스터리를 풀어보세요."
	},
	alternates: {
		canonical: "/quiz/today",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-image-preview": "large",
			"max-snippet": -1,
			"max-video-preview": -1,
		}
	}
}

export default function ToadyLayout({ children }: { children: React.ReactNode }) {
	return (
		<section className="min-h-svh bg-black text-white">
			{/* JSON-LD: FAQPage */}
			<Script id="jsonld-faq" type="application/ld+json">
				{JSON.stringify({
					"@context": "https://schema.org",
					"@type": "FAQPage",
					"mainEntity": [
						{
							"@type": "Question",
							"name": "질문은 어떻게 해야 하나요?",
							"acceptedAnswer": { "@type": "Answer", "text": "예/아니오로 답할 수 있는 질문만 던지세요. 넓게 시작해 점차 범위를 좁혀가면 좋아요." }
						},
						{
							"@type": "Question",
							"name": "힌트는 어떻게 열 수 있나요?",
							"acceptedAnswer": { "@type": "Answer", "text": "입력창 좌측의 + 버튼을 누르면 순서대로 힌트를 해금할 수 있어요." }
						},
						{
							"@type": "Question",
							"name": "정답은 어디에서 확인하나요?",
							"acceptedAnswer": { "@type": "Answer", "text": "입력창 좌측의 + 버튼에서 ‘정답 확인하기’를 누르면 볼 수 있어요." }
						}
					]
				})}
			</Script>
			{/* JSON-LD: HowTo (게임 진행 방법) */}
			<Script id="jsonld-howto" type="application/ld+json">
				{JSON.stringify({
					"@context": "https://schema.org",
					"@type": "HowTo",
					"name": "바다거북스프 오늘의 미스터리 진행 방법",
					"step": [
						{ "@type": "HowToStep", "name": "시나리오 읽기", "text": "오늘의 미스터리 시나리오를 읽고 핵심 단서를 파악합니다." },
						{ "@type": "HowToStep", "name": "예/아니오 질문", "text": "예/아니오로 답할 수 있는 질문을 던지며 범위를 좁혀갑니다." },
						{ "@type": "HowToStep", "name": "힌트 사용", "text": "막히면 + 버튼을 눌러 순서대로 힌트를 엽니다." },
						{ "@type": "HowToStep", "name": "정답 확인", "text": "+ 버튼에서 ‘정답 확인하기’를 눌러 정답을 확인합니다." }
					]
				})}
			</Script>
			{children}
		</section>
	)
} 
"use client"

import * as Dialog from "@radix-ui/react-dialog"

interface GuideModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function GuideModal({ open, onOpenChange }: GuideModalProps) {
	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/70 md:hidden" />
				<Dialog.Content className="md:hidden fixed inset-x-4 bottom-8 rounded-lg border border-white/10 bg-neutral-950 p-4 shadow-2xl">
					<Dialog.Title className="text-sm font-semibold text-white">플레이 가이드</Dialog.Title>
					<div className="mt-2 text-sm text-neutral-300 leading-relaxed space-y-2">
						<p>예/아니오로 답할 수 있는 질문을 통해 사건의 전말을 추리하세요.</p>
						<p>@힌트, @정답, @포기 명령을 사용할 수 있어요.</p>
						<p>입력창에서 엔터로 전송, 쉬프트+엔터로 줄바꿈이 가능합니다.</p>
					</div>
					<div className="mt-3 flex justify-end">
						<Dialog.Close asChild>
							<button className="rounded-md bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-500">시작하기</button>
						</Dialog.Close>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
} 
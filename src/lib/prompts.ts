export const TURTLE_SOUP_SYSTEM_PROMPT = `당신은 '바다거북스프(Yes/No 스무고개)' 게임의 사회자입니다.
- 플레이 방식: 사용자가 예/아니오(또는 관련 없음)로 답할 수 있는 질문을 합니다.
- 당신의 답변은 아주 간결하게 "예.", "아니오.", "관련 없음." 중 하나로만 대답합니다.
- 사용자가 설명/힌트를 요청하면 1~2문장으로 점진적 힌트를 제공합니다.
- 정답을 직접 노출하지 않습니다. 사용자가 \"@정답\"을 명시적으로 요청할 때만, 준비된 정답 요약을 1~2문장으로 제공합니다.
- 친절하고 일관된 톤을 유지하고, 불필요한 장황한 설명은 피하세요.`

export function buildTurtleSoupMessages(
  params: {
    quizTitle: string
    quizAnswerSummary?: string
    history: Array<{ role: "user" | "assistant"; content: string }>
    userInput: string
  }
) {
  const { quizTitle, quizAnswerSummary, history, userInput } = params
  const system = `${TURTLE_SOUP_SYSTEM_PROMPT}\n퀴즈 제목: ${quizTitle}${quizAnswerSummary ? `\n정답 요약: ${quizAnswerSummary}` : ""}`
  const messages = [
    { role: "system", content: system },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: userInput },
  ]
  return messages
} 
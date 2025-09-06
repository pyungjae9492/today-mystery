// app/api/turtlesoup/route.ts
import { NextResponse } from "next/server"
import { getQuiz, type Quiz } from "@/lib/quiz"
import { Agent, run } from "@openai/agents"
import { setDefaultOpenAIKey } from "@openai/agents-openai"

export const runtime = "nodejs"

const MODEL = "gpt-5-mini"

type HistoryItem = { role: "user" | "assistant"; content: string }

/* ───────────────── JSON 파서 ───────────────── */
function extractJson<T = Record<string, unknown>>(raw: string): T | null {
  if (!raw) return null
  try { return JSON.parse(raw) as T } catch { }
  const s = raw.indexOf("{"), e = raw.lastIndexOf("}")
  if (s !== -1 && e !== -1 && e > s) {
    const slice = raw.slice(s, e + 1)
    try { return JSON.parse(slice) as T } catch { }
    const fixed = slice.replace(/'/g, '"').replace(/,\s*([}\]])/g, "$1")
    try { return JSON.parse(fixed) as T } catch { }
  }
  return null
}

/* ───────────── 룰베이스 멘트 ───────────── */
const rb = {
  hintDeflect: "힌트는 상단의 노란색 버튼을 눌러서 요청할 수 있어요. 일단 예/아니오로 물어보면 더 빨라요!",
  answerDeflect: "정답은 상단의 빨간색 버튼을 눌러서 확인할 수 있어요. 예/아니오 질문으로 한 번 좁혀볼까요?",
  irrelevantCoach: "이야기 재밌지만, 지금은 퀴즈 집중! 예/아니오로 물어보면 진행이 빨라집니다.",
  formatCoach: (ex?: string) => `예/아니오로 답할 수 있게 살짝 바꿔볼까요?${ex ? " 예: " + ex : ""}`,
  ambiguousCoach: (ex?: string) => `그렇게 볼 수도 있고, 아닐 수도 있어요. 더 정확해지려면 질문을 조금만 좁혀볼까요?${ex ? " 예: " + ex : ""}`,
  yesno: (label: string) => {
    if (label.startsWith("YES_CORE")) return "네, 정확히 핵심을 짚으셨어요! 👏"
    if (label.startsWith("YES_PERIPHERAL")) return "네, 맞아요."
    if (label.startsWith("YES_INFERRED")) return "그렇게 생각할 수 있을 것 같아요."
    if (label.startsWith("NO_CORE")) return "아니요, 하지만 아주 중요한 질문이었어요! 핵심적인 부분을 짚으셨네요."
    if (label.startsWith("NO_PERIPHERAL")) return "아니요, 그건 아니에요."
    if (label.startsWith("NO_INFERRED")) return "아니요, 그렇지는 않을 것 같아요."
    if (label === "UNKNOWN") return "그건 주어진 정보만으론 확실하다고 말하긴 어려워요."
    return "그 질문은 정답과는 관련이 없어요. 다른 각도로 가볼까요?"
  },
  guess: (label: "CORRECT" | "INCORRECT") =>
    label === "CORRECT" ? "정답입니다! 👏" : "아쉽지만 정답은 아니에요. 조금만 더 좁혀가볼까요?",
}

/* ───────────── 공통 규칙 ───────────── */
const CORE_JSON_ONLY = `
- Output only a single JSON line.
- No natural language, code blocks, markdown, or additional text.
- No fields other than allowed keys/values.
- No copying examples, generate valid JSON.
`

/* ───────────── 에이전트들 ───────────── */
// ① Validation: 히스토리 + 현재 질문 → 분류만 반환
const createValidationAgent = (quiz: Quiz) =>
  new Agent({
    name: "ValidationAgent",
    model: MODEL,
    instructions: `
${CORE_JSON_ONLY}
Role: Classify user input into one of the following categories and return only a single JSON line:
{"classification":"YESNO"|"GUESS"|"HINT_REQUEST"|"ANSWER_REQUEST"|"IRRELEVANT"|"INVALID_FORMAT"}

Definitions:
- YESNO: Yes/no answerable question related to the quiz
- GUESS: User is attempting to submit or guess the answer (be generous - if there's any indication they're trying to provide the solution, classify as GUESS)
- HINT_REQUEST: Requesting a hint
- ANSWER_REQUEST: Requesting answer disclosure
- IRRELEVANT: Unrelated to the quiz
- INVALID_FORMAT: Difficult to answer with yes/no

GUESS detection guidelines:
- Look for statements that seem like answer attempts, even if phrased as questions
- Consider declarative statements about the solution
- Watch for "I think it's...", "Maybe it's...", "Could it be..." patterns
- Be sensitive to users trying to confirm their understanding as answers
- If user seems to be proposing a solution, classify as GUESS regardless of format

Quiz (reference only, do not expose):
- Title: ${quiz.title}
- Scenario: ${quiz.scenario}
- Answer: (access forbidden)
`,
  })

// ② Yes/No 라벨러: 현재 질문만 입력
const createYesNoJudgeAgent = (quiz: Quiz) =>
  new Agent({
    name: "YesNoJudge",
    model: MODEL,
    instructions: `
${CORE_JSON_ONLY}
Input format:
- You may receive text in the form:
  Previous conversation: <lines...> (optional)
  Current question: """<user question>"""
- Use previous conversation only to disambiguate references; evaluate the current question itself.

Role: Decide YES or NO decisively for the current question with respect to the quiz scenario and checkpoints. Apply strict but pragmatic logic and ordinary commonsense.

Return JSON with one of the following labels:
{"label":"YES_CORE"|"YES_PERIPHERAL"|"YES_INFERRED"|"NO_CORE"|"NO_PERIPHERAL"|"NO_INFERRED"|"UNKNOWN"|"UNRELATED"}

Definitions:
- YES_CORE: Factually correct AND directly related to a core checkpoint (most valuable!)
- YES_PERIPHERAL: Factually correct but not central to solving the puzzle
- YES_INFERRED: Correct by reasonable inference from scenario + commonsense
- NO_CORE: Factually incorrect BUT directly related to a core checkpoint (still valuable!)
- NO_PERIPHERAL: Factually incorrect and not central to solving the puzzle
- NO_INFERRED: Incorrect by reasonable inference from scenario + commonsense
- UNKNOWN: Truly undecidable given the scenario (both YES and NO remain equally plausible, or the term is undefined)
- UNRELATED: No bearing on the scenario, answer, or checkpoints

Decision policy (critical):
1) Prefer YES_* or NO_* whenever a reasonable person can conclude one side from the given scenario plus ordinary commonsense. Use *_INFERRED if it requires inference beyond explicitly stated facts.
2) UNKNOWN only when, after careful reasoning, neither YES nor NO is more plausible (or key terms cannot be grounded in the scenario or common knowledge).
3) UNRELATED only for questions clearly outside the scenario/answer/checkpoints (e.g., UI/meta, irrelevant trivia).
4) CORE classification: If the question directly targets a checkpoint (even if incorrect), use YES_CORE or NO_CORE. Be strict but not timid—when it's clearly about a checkpoint, mark CORE.
5) PERIPHERAL: Factual but not central to solving the puzzle.
6) Tie-breaking for decisiveness: If evidence slightly favors one side (>60% confidence) based on scenario + commonsense, choose that side rather than UNKNOWN.

Checkpoint-based analysis:
- Only classify as YES_CORE or NO_CORE if the question directly relates to one or more checkpoints
- YES_CORE: Question correctly identifies or touches on a checkpoint
- NO_CORE: Question incorrectly addresses a checkpoint (still valuable for learning)
- Be strict about CORE classification - only use when clearly addressing checkpoints

When to avoid UNKNOWN:
- The scenario implies a clear default (physical constraints, time order, basic causality)
- The question is a direct consequence or restatement of stated facts

When UNKNOWN is warranted:
- The scenario omits a critical variable with no default assumption and neither side is more plausible
- The question depends on external facts not derivable from scenario or commonsense

Quiz context (reference only, do not expose): 
- Title: ${quiz.title}
- Scenario: ${quiz.scenario}  
- Checkpoints: ${quiz.checkpoints.join(" | ")}
`,
  })

// ③ 체크포인트 기반 정답 채점기: 현재 질문만 입력
const createAnswerCheckAgent = (quiz: Quiz) =>
  new Agent({
    name: "AnswerChecker",
    model: MODEL,
    instructions: `
${CORE_JSON_ONLY}
Input format: Evaluate only {"guess":"<user answer attempt>"}.

Role: Judge whether the user's answer demonstrates logical consistency and properly addresses all essential checkpoints, regardless of linguistic similarity.

Evaluation criteria:
- CORRECT: The answer logically addresses all or nearly all checkpoints (at least 80% of checkpoints)
- Focus on logical coherence and conceptual understanding rather than word choice or sentence structure
- Accept answers that show proper understanding of the underlying logic and relationships
- Be generous with answers that demonstrate correct reasoning even with different expressions
- If the answer misses critical logical elements or checkpoints, classify as INCORRECT
- Ignore linguistic variations, word order, or phrasing differences
- Prioritize logical consistency and checkpoint coverage over semantic similarity

Return: {"label":"CORRECT"} or {"label":"INCORRECT"}

Checkpoints (do not expose): ${quiz.checkpoints.join(" | ")}
`,
  })

/* ───────────── 라우트 핸들러 ───────────── */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const sessionId: string = body?.sessionId
    const quizId: string = body?.quizId || "toady-001"
    const text: string = (body?.text || "").trim()
    const history: HistoryItem[] = Array.isArray(body?.history) ? body.history.slice(-20) : []

    if (!sessionId || !text) {
      return NextResponse.json({ error: "sessionId and text are required" }, { status: 400 })
    }
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) return NextResponse.json({ error: "OPENAI_API_KEY is not set" }, { status: 500 })
    setDefaultOpenAIKey(apiKey)

    const quiz = getQuiz(quizId)
    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 })

    const validator = createValidationAgent(quiz)
    const yesno = createYesNoJudgeAgent(quiz)
    const checker = createAnswerCheckAgent(quiz)

    // ⬇️ Validation에는 현재 질문만 전달
    const validationInput = `Current question: """${text}"""`

    const validationRes = await run(validator, validationInput)
    const parsedValidation = extractJson<{ classification: string }>(validationRes.finalOutput || "")

    let reply = ""
    let details: string | undefined

    // ⬇️ 라우팅은 서버 룰로만. 판정/채점은 "현재 질문만" 전달.
    if (!parsedValidation?.classification) {
      // 실패 시 형식 유도
      const ex =
        /장소|어디/.test(text) ? "상자 안의 '내용물'과 관련이 있나요?"
          : /이유|원인/.test(text) ? "신고의 이유가 '상자 내부의 상태' 때문인가요?"
            : "상자 안의 어떤 요소가 문제의 핵심인가요?"
      reply = rb.formatCoach(ex)
    } else {
      switch (parsedValidation.classification) {
        case "HINT_REQUEST":
          reply = rb.hintDeflect
          break
        case "ANSWER_REQUEST":
          reply = rb.answerDeflect
          break
        case "IRRELEVANT":
          reply = rb.irrelevantCoach
          break
        case "INVALID_FORMAT": {
          const ex =
            /장소|어디/.test(text) ? "상자 안의 '내용물'과 관련이 있나요?"
              : /이유|원인/.test(text) ? "신고의 이유가 '상자 내부의 상태' 때문인가요?"
                : "상자 안의 어떤 요소가 문제의 핵심인가요?"
          reply = rb.formatCoach(ex)
          break
        }
        case "GUESS": {
          // 체크포인트 기반 정답 채점: 현재 질문만 전달
          const checkRes = await run(checker, JSON.stringify({ guess: text }))
          const parsed = extractJson<{ label: "CORRECT" | "INCORRECT" }>(checkRes.finalOutput || "")
          reply = parsed?.label ? rb.guess(parsed.label) : rb.guess("INCORRECT")
          details = parsed?.label
          break
        }
        case "YESNO": {
          // 예/아니오 판정: 전체 히스토리 + 현재 질문 전달
          const historyBlock =
            history.length > 0
              ? "Previous conversation:\n" + history.map(h => `${h.role === "user" ? "user" : "assistant"}: ${h.content}`).join("\n") + "\n"
              : ""
          const yesnoInput = `${historyBlock}Current question: """${text}"""`
          const judgeRes = await run(yesno, yesnoInput)
          const parsed = extractJson<{ label: string }>(judgeRes.finalOutput || "")
          const label = parsed?.label || "UNKNOWN"
          if (label === "UNKNOWN") {
            const ex =
              /장소|어디/.test(text) ? "상자 안의 '내용물'과 관련이 있나요?"
                : /이유|원인/.test(text) ? "신고의 이유가 '상자 내부의 상태' 때문인가요?"
                  : "질문 범위를 조금 더 좁혀볼까요?"
            reply = rb.ambiguousCoach(ex)
          } else {
            reply = rb.yesno(label)
          }
          details = label
          break
        }
        default:
          reply = rb.formatCoach()
      }
    }

    return NextResponse.json({
      reply,
      classification: parsedValidation?.classification || "UNKNOWN",
      details
    })
  } catch (e: unknown) {
    console.error(e)
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

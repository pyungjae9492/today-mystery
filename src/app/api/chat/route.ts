import { NextResponse } from "next/server"
import { getSupabaseAdmin, ChatLogInsert } from "@/lib/supabase"
import { buildTurtleSoupMessages } from "@/lib/prompts"

export const runtime = "nodejs"

type HistoryItem = { role: "user" | "assistant"; content: string }

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const sessionId: string = body?.sessionId
    const quizId: string = body?.quizId || "toady-001"
    const text: string = body?.text
    const history: HistoryItem[] = Array.isArray(body?.history) ? body.history.slice(-20) : []
    if (!sessionId || !text) {
      return NextResponse.json({ error: "sessionId and text are required" }, { status: 400 })
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini"
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not set" }, { status: 500 })
    }

    const messages = buildTurtleSoupMessages({
      quizTitle: "바다거북스프: 새벽 배달",
      quizAnswerSummary: "상자 안 드라이아이스의 연기를 화재로 오해하여 신고했다",
      history,
      userInput: text,
    })

    const completionRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.2,
        max_tokens: 120,
      })
    })

    if (!completionRes.ok) {
      const errText = await completionRes.text()
      return NextResponse.json({ error: "Upstream error", detail: errText }, { status: 502 })
    }

    const data = await completionRes.json()
    const reply: string = data?.choices?.[0]?.message?.content?.trim?.() || "관련 없음."

    try {
      const supabase = getSupabaseAdmin()
      const rows: ChatLogInsert[] = [
        { session_id: sessionId, quiz_id: quizId, role: "user", content: text },
        { session_id: sessionId, quiz_id: quizId, role: "assistant", content: reply },
      ]
      await supabase.from("chat_logs").insert(rows)
    } catch { }

    return NextResponse.json({ reply })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
} 
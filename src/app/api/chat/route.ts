import { NextResponse } from "next/server";
import { answerWithAutoMode } from "@/lib/rag/lumiKids";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message: string = body?.message ?? "";

    if (!message.trim()) {
      return NextResponse.json(
        {
          answer: "Oi! Eu sou o Vagalume Professor 🪲✨ Me pergunta algo!",
          sources: [],
        },
        { status: 200 }
      );
    }

    const result = await answerWithAutoMode(message);
    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Erro no chat", detail: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}

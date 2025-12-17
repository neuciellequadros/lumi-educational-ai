"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FireflyTeacher } from "@/components/lumi/FireflyTeacher";

type Source = { id: string; source: string; text: string };

export default function AulaPage() {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState(
    "Oi! Eu sou o Vagalume Professor 🪲✨ Me pergunta algo!"
  );
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);

  const quick = (t: string) => setMessage(t);

  async function send() {
    if (!message.trim()) return;
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    setAnswer(data.answer ?? "Oops… deu um errinho!");
    setSources(data.sources ?? []);
    setLoading(false);
  }

  return (
    <main className="p-4">
      <div className="mx-auto max-w-3xl space-y-4">
        <header className="flex items-center justify-between">
          <FireflyTeacher />
          <Link href="/" className="text-sm underline">
            ← voltar
          </Link>
        </header>

        <Card className="rounded-3xl bg-white/70 backdrop-blur border-white/60 shadow-sm">
          <CardContent className="p-5 space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                className="rounded-2xl"
                onClick={() => quick("Me explica multiplicação com exemplo")}
              >
                🧮 Matemática
              </Button>
              <Button
                variant="secondary"
                className="rounded-2xl"
                onClick={() =>
                  quick("Me faz 3 perguntas de mini quiz de matemática")
                }
              >
                📝 Mini Quiz
              </Button>
              <Button
                variant="secondary"
                className="rounded-2xl"
                onClick={() => quick("Me explica como se eu tivesse 8 anos")}
              >
                🧸 Bem fácil
              </Button>
            </div>

            <div className="flex gap-2">
              <Input
                className="rounded-2xl bg-white"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escreva sua dúvida aqui…"
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
              <Button className="rounded-2xl" onClick={send} disabled={loading}>
                {loading ? "Pensando…" : "Perguntar"}
              </Button>
            </div>

            <Separator />

            <div className="rounded-3xl bg-white p-4 border shadow-sm">
              <div className="font-semibold mb-2">
                🪲✨ Resposta do Vagalume
              </div>
              <p className="whitespace-pre-wrap leading-relaxed">{answer}</p>
            </div>

            {sources.length > 0 && (
              <div className="rounded-3xl bg-white p-4 border shadow-sm space-y-2">
                <div className="font-semibold">
                  📚 Eu usei esses pedacinhos da biblioteca:
                </div>
                <div className="grid gap-2">
                  {sources.map((s) => (
                    <div
                      key={s.id}
                      className="rounded-2xl border p-3 bg-gradient-to-r from-yellow-50 to-sky-50"
                    >
                      <div className="text-sm font-semibold">{s.source}</div>
                      <div className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">
                        {s.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

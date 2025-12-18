import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FireflyTeacher } from "@/components/lumi/FireflyTeacher";
import { FunBackground } from "@/components/lumi/FunBackground";

export default function Home() {
  return (
    <main className="relative min-h-screen p-4">
      <FunBackground />

      <div className="relative mx-auto max-w-3xl space-y-4">
        <header className="flex items-center justify-between">
          <FireflyTeacher />
          <div className="rounded-full bg-white/70 border px-3 py-1 text-sm shadow-sm">
            Offline • RAG • Crianças 7–11 ✨
          </div>
        </header>

        {/* stickers */}
        <div className="relative">
          <div className="absolute -left-2 -top-2 rotate-[-8deg] rounded-2xl bg-white/80 px-3 py-2 shadow-sm border">
            🌈 Vamos brincar de aprender!
          </div>
          <div className="absolute -right-1 top-6 rotate-[10deg] rounded-2xl bg-white/80 px-3 py-2 shadow-sm border">
            ⭐ Ganhe estrelinhas!
          </div>
        </div>

        <Card className="rounded-3xl bg-white/75 backdrop-blur border-white/60 shadow-sm">
          <CardContent className="p-6 space-y-3">
            <h1 className="text-3xl font-extrabold">
              Bem-vinda(o) ao Mundo do Vagalume!{" "}
              <span className="inline-block">🪲🟡</span>
            </h1>

            <p className="text-base text-muted-foreground">
              Escolha o que você quer fazer. Eu vou te ajudar com carinho ✨
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Link href="/aula">
                <Button className="w-full rounded-2xl text-lg py-6 shadow-sm">
                  📚 Começar uma aula
                </Button>
              </Link>

              <Link href="/quiz">
                <Button
                  variant="secondary"
                  className="w-full rounded-2xl text-lg py-6 bg-white/80 shadow-sm"
                >
                  📝 Mini Quiz
                </Button>
              </Link>

              <Link href="/biblioteca">
                <Button
                  variant="secondary"
                  className="w-full rounded-2xl text-lg py-6 bg-white/80 shadow-sm"
                >
                  📦 Biblioteca
                </Button>
              </Link>

              <Link href="/pais">
                <Button
                  variant="secondary"
                  className="w-full rounded-2xl text-lg py-6 bg-white/80 shadow-sm"
                >
                  👩‍🏫 Para pais/professores
                </Button>
              </Link>
            </div>

            {/* faixa divertida */}
            <div className="mt-2 rounded-2xl bg-gradient-to-r from-yellow-200/70 via-pink-200/60 to-sky-200/70 p-3 border shadow-sm">
              <p className="text-sm">
                Dica do Vagalume: pergunte assim —{" "}
                <b>“me explica com um exemplo”</b> 🪲✨
              </p>
            </div>
          </CardContent>
        </Card>

        <footer className="text-center text-xs text-muted-foreground">
          Feito com carinho 💜 Conteúdo vem dos arquivos em <b>/docs</b>.
        </footer>
      </div>
    </main>
  );
}

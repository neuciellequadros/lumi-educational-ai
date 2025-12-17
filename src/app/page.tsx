import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FireflyTeacher } from "@/components/lumi/FireflyTeacher";

export default function Home() {
  return (
    <main className="p-4">
      <div className="mx-auto max-w-3xl space-y-4">
        <header className="flex items-center justify-between">
          <FireflyTeacher />
          <div className="text-sm bg-white/70 border rounded-full px-3 py-1 shadow-sm">
            Offline • RAG • Crianças 7–11 ✨
          </div>
        </header>

        <Card className="rounded-3xl bg-white/70 backdrop-blur border-white/60 shadow-sm">
          <CardContent className="p-6 space-y-3">
            <h1 className="text-3xl font-extrabold">
              Bem-vinda(o) ao Mundo do Vagalume! 🌈
            </h1>
            <p className="text-base text-muted-foreground">
              Escolha o que você quer fazer. Eu vou te ajudar com carinho 🪲✨
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Link href="/aula">
                <Button className="w-full rounded-2xl text-lg py-6">
                  📚 Começar uma aula
                </Button>
              </Link>
              <Link href="/quiz">
                <Button
                  variant="secondary"
                  className="w-full rounded-2xl text-lg py-6"
                >
                  📝 Mini Quiz
                </Button>
              </Link>
              <Link href="/biblioteca">
                <Button
                  variant="secondary"
                  className="w-full rounded-2xl text-lg py-6"
                >
                  📦 Biblioteca
                </Button>
              </Link>
              <Link href="/pais">
                <Button
                  variant="secondary"
                  className="w-full rounded-2xl text-lg py-6"
                >
                  👩‍🏫 Para pais/professores
                </Button>
              </Link>
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

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FireflyTeacher } from "@/components/lumi/FireflyTeacher";

export default function QuizPage() {
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
          <CardContent className="p-6 space-y-3">
            <h1 className="text-2xl font-extrabold">Mini Quiz 📝</h1>
            <p className="text-muted-foreground">
              Na próxima etapa vamos fazer quiz com alternativas A/B/C e confete
              🎉
            </p>
            <Link href="/aula">
              <Button className="rounded-2xl">Ir para Aula</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

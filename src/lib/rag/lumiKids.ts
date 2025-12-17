import { searchTopK } from "./runtime";

export function kidsTemplateAnswer(question: string, chunksText: string) {
  const resumo = chunksText.trim() ? chunksText.trim().slice(0, 550) : "";

  if (!resumo) {
    return (
      "Humm… eu não achei isso na minha biblioteca ainda 🪲✨\n\n" +
      "1) Explicação: Eu não tenho certeza, mas posso te ajudar a procurar com um professor ou responsável.\n" +
      "2) Exemplo: Você pode perguntar: “Você pode me explicar isso com um exemplo?”\n" +
      "3) Sua vez: Qual matéria é? (Matemática, Português ou Ciências)"
    );
  }

  return (
    "Certo! Vamos aprender juntinhos 🪲✨\n\n" +
    "1) Explicação bem simples:\n" +
    resumo.split("\n").slice(0, 3).join("\n") +
    "\n\n2) Um exemplo bem fácil:\n" +
    (resumo.split("\n").find((l) => l.toLowerCase().includes("exemplo")) ??
      "Exemplo: vamos fazer um passo por vez!") +
    "\n\n3) Sua vez:\n" +
    "Você consegue me dizer com suas palavras o que entendeu?"
  );
}

export async function answerWithAutoMode(message: string) {
  const chunks = await searchTopK(message, 4);
  const contexto = chunks
    .map((c, i) => `Trecho ${i + 1} (${c.source})\n${c.text}`)
    .join("\n\n");

  // tenta Ollama (se existir). Se falhar, cai no rag-only.
  try {
    const { ChatOllama } = await import(
      "@langchain/community/chat_models/ollama"
    );
    const model = new ChatOllama({ model: "llama3.1", temperature: 0.4 });

    const prompt = `
Você é o Vagalume Professor 🪲✨ para crianças de 7 a 11 anos (1º ao 5º ano).
Fale em português do Brasil.
Responda SEMPRE em 3 partes:
1) Explicação simples (máx 4 linhas)
2) Exemplo fácil (máx 3 linhas)
3) Pergunta para a criança tentar (1 linha)
Se não estiver no contexto, diga com carinho que não tem certeza.

CONTEXTO (biblioteca):
${contexto}

PERGUNTA:
${message}
`.trim();

    const resp = await model.invoke(prompt);
    return { answer: String(resp.content ?? ""), sources: chunks };
  } catch {
    const answer = kidsTemplateAnswer(
      message,
      chunks.map((c) => c.text).join("\n\n")
    );
    return { answer, sources: chunks };
  }
}

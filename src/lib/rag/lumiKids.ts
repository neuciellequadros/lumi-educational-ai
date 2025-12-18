import { searchTopKEmbeddings } from "./embStore";

export function kidsTemplateAnswer(chunksText: string) {
  const resumo = chunksText.trim() ? chunksText.trim().slice(0, 600) : "";
  if (!resumo) {
    return (
      "Opa! Eu não achei isso na minha biblioteca ainda 🪲🟡✨\n\n" +
      "1) Explicação: Eu não tenho certeza… mas posso te ajudar a procurar com um adulto.\n" +
      "2) Exemplo: Tente me dizer qual matéria é (Matemática, Português ou Ciências).\n" +
      "3) Sua vez: Qual série você está? (1º ao 5º)"
    );
  }

  const exemploLinha =
    resumo.split("\n").find((l) => l.toLowerCase().includes("exemplo")) ??
    "Exemplo: vamos fazer juntinhos um passo por vez!";

  return (
    "Oba! Vamos aprender no Mundo do Vagalume 🪲🟡✨\n\n" +
    "1) Explicação bem simples:\n" +
    resumo.split("\n").slice(0, 3).join("\n") +
    "\n\n2) Um exemplo bem fácil:\n" +
    exemploLinha +
    "\n\n3) Sua vez:\n" +
    "Você quer tentar um exercício rapidinho?"
  );
}

export async function answerWithAutoMode(message: string) {
  const chunks = await searchTopKEmbeddings(message, 4);
  const contexto = chunks
    .map((c, i) => `Trecho ${i + 1} (${c.source})\n${c.text}`)
    .join("\n\n");

  try {
    const { ChatOllama } = await import(
      "@langchain/community/chat_models/ollama"
    );
    const model = new ChatOllama({
      model: process.env.OLLAMA_LLM_MODEL || "llama3.1",
      temperature: 0.4,
    });

    const prompt = `
Você é o Vagalume Professor 🪲🟡✨, para crianças de 7 a 11 anos (1º ao 5º ano).
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
    const answer = kidsTemplateAnswer(chunks.map((c) => c.text).join("\n\n"));
    return { answer, sources: chunks };
  }
}

import fs from "fs";
import path from "path";
import crypto from "crypto";

type Chunk = { id: string; source: string; text: string };

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://127.0.0.1:11434";
const EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text";

function walk(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const out: string[] = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function chunkText(text: string, size = 850, overlap = 130) {
  const clean = text.replace(/\r\n/g, "\n").trim();
  const chunks: string[] = [];
  let i = 0;
  while (i < clean.length) {
    const end = Math.min(i + size, clean.length);
    chunks.push(clean.slice(i, end));
    if (end === clean.length) break;
    i = end - overlap;
  }
  return chunks;
}

function hashId(input: string) {
  return crypto.createHash("sha1").update(input).digest("hex").slice(0, 16);
}

async function ollamaEmbed(prompt: string): Promise<number[]> {
  const res = await fetch(`${OLLAMA_HOST}/api/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: EMBED_MODEL, prompt }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ollama embeddings falhou: ${res.status} ${text}`);
  }

  const data = (await res.json()) as { embedding: number[] };
  if (!Array.isArray(data.embedding))
    throw new Error("Resposta inválida do Ollama embeddings.");
  return data.embedding;
}

async function main() {
  const docsDir = path.join(process.cwd(), "docs");
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const files = walk(docsDir).filter((f) => f.endsWith(".md"));
  const chunks: Chunk[] = [];

  for (const file of files) {
    const rel = path.relative(process.cwd(), file).replace(/\\/g, "/");
    const raw = fs.readFileSync(file, "utf-8");
    const pieces = chunkText(raw);

    pieces.forEach((p, idx) => {
      const id = hashId(`${rel}::${idx}::${p.slice(0, 40)}`);
      chunks.push({ id, source: rel, text: p });
    });
  }

  fs.writeFileSync(
    path.join(dataDir, "chunks.json"),
    JSON.stringify({ createdAt: new Date().toISOString(), chunks }, null, 2)
  );

  if (chunks.length === 0) {
    console.log(
      "⚠️ Nenhum chunk encontrado em /docs. Adicione .md e rode novamente."
    );
    return;
  }

  console.log(`🪲✨ Gerando embeddings com Ollama (${EMBED_MODEL})...`);
  const first = await ollamaEmbed(chunks[0].text);
  const dim = first.length;

  const all = new Float32Array(chunks.length * dim);
  all.set(Float32Array.from(first), 0);

  for (let i = 1; i < chunks.length; i++) {
    if (i % 10 === 0) console.log(`  ... ${i}/${chunks.length}`);
    const emb = await ollamaEmbed(chunks[i].text);
    if (emb.length !== dim)
      throw new Error(`Dimensão mudou: esperado ${dim}, veio ${emb.length}`);
    all.set(Float32Array.from(emb), i * dim);
  }

  fs.writeFileSync(
    path.join(dataDir, "embeddings.bin"),
    Buffer.from(all.buffer)
  );
  fs.writeFileSync(
    path.join(dataDir, "meta.json"),
    JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        count: chunks.length,
        dim,
        embedModel: EMBED_MODEL,
        ollamaHost: OLLAMA_HOST,
      },
      null,
      2
    )
  );

  console.log("✅ Pronto! Gerado:");
  console.log(" - data/chunks.json");
  console.log(" - data/embeddings.bin");
  console.log(" - data/meta.json");
}

main().catch((e) => {
  console.error("❌ ingest falhou:", e);
  process.exit(1);
});

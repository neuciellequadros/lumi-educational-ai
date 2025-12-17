import fs from "fs";
import path from "path";
import crypto from "crypto";
import natural from "natural";

type Chunk = { id: string; source: string; text: string };

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

  // TF-IDF index (offline, zero modelo)
  const TfIdf = natural.TfIdf;
  const tfidf = new TfIdf();
  chunks.forEach((c) => tfidf.addDocument(c.text));

  // Persistimos apenas o necessário: o texto já fica em chunks.json.
  // Aqui salvamos "N" para validar integridade e reuso.
  fs.writeFileSync(
    path.join(dataDir, "tfidf.json"),
    JSON.stringify(
      { createdAt: new Date().toISOString(), count: chunks.length },
      null,
      2
    )
  );

  console.log(`✅ chunks: ${chunks.length}`);
  console.log(`✅ gerado: data/chunks.json + data/tfidf.json`);
  console.log(
    `✨ Dica: se quiser modo IA offline completo, instale Ollama (opcional).`
  );
}

main().catch((e) => {
  console.error("❌ ingest falhou:", e);
  process.exit(1);
});

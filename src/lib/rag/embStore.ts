import fs from "fs";
import path from "path";

type Chunk = { id: string; source: string; text: string };

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://127.0.0.1:11434";
const EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text";

const CHUNKS_FILE = path.join(process.cwd(), "data", "chunks.json");
const META_FILE = path.join(process.cwd(), "data", "meta.json");
const EMB_FILE = path.join(process.cwd(), "data", "embeddings.bin");

type Store = {
  chunks: Chunk[];
  dim: number;
  embeddings: Float32Array;
  norms: Float32Array;
};

declare global {
  // eslint-disable-next-line no-var
  var __LUMI_EMB_STORE__: Promise<Store> | undefined;
}

function l2norm(vec: Float32Array) {
  let sum = 0;
  for (let i = 0; i < vec.length; i++) sum += vec[i] * vec[i];
  return Math.sqrt(sum) || 1;
}

async function ollamaEmbed(prompt: string): Promise<Float32Array> {
  const res = await fetch(`${OLLAMA_HOST}/api/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: EMBED_MODEL, prompt }),
  });
  if (!res.ok) throw new Error("Ollama embeddings indisponível.");
  const data = (await res.json()) as { embedding: number[] };
  return Float32Array.from(data.embedding);
}

async function buildStore(): Promise<Store> {
  if (
    !fs.existsSync(CHUNKS_FILE) ||
    !fs.existsSync(META_FILE) ||
    !fs.existsSync(EMB_FILE)
  ) {
    throw new Error("Base embeddings não encontrada. Rode: npm run ingest");
  }

  const chunksRaw = JSON.parse(fs.readFileSync(CHUNKS_FILE, "utf-8")) as {
    chunks: Chunk[];
  };
  const meta = JSON.parse(fs.readFileSync(META_FILE, "utf-8")) as {
    count: number;
    dim: number;
  };

  const buf = fs.readFileSync(EMB_FILE);
  const embeddings = new Float32Array(
    buf.buffer,
    buf.byteOffset,
    buf.byteLength / 4
  );

  if (chunksRaw.chunks.length !== meta.count) {
    throw new Error("Meta count != chunks. Rode ingest novamente.");
  }
  if (embeddings.length !== meta.count * meta.dim) {
    throw new Error("Tamanho embeddings.bin inválido. Rode ingest novamente.");
  }

  const norms = new Float32Array(meta.count);
  for (let i = 0; i < meta.count; i++) {
    const v = embeddings.subarray(i * meta.dim, (i + 1) * meta.dim);
    norms[i] = l2norm(v);
  }

  return { chunks: chunksRaw.chunks, dim: meta.dim, embeddings, norms };
}

export function getEmbStore(): Promise<Store> {
  if (!global.__LUMI_EMB_STORE__) global.__LUMI_EMB_STORE__ = buildStore();
  return global.__LUMI_EMB_STORE__;
}

export async function searchTopKEmbeddings(query: string, k = 4) {
  const store = await getEmbStore();
  const q = await ollamaEmbed(query);
  if (q.length !== store.dim)
    throw new Error("Dimensão do query embedding não bate.");

  const qn = l2norm(q);

  const scored: Array<{ i: number; score: number }> = [];
  for (let i = 0; i < store.chunks.length; i++) {
    const v = store.embeddings.subarray(i * store.dim, (i + 1) * store.dim);
    let dot = 0;
    for (let d = 0; d < store.dim; d++) dot += v[d] * q[d];
    const score = dot / (store.norms[i] * qn);
    scored.push({ i, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k).map((s) => store.chunks[s.i]);
}

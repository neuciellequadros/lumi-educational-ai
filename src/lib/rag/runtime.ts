import fs from "fs";
import path from "path";
import natural from "natural";

type Chunk = { id: string; source: string; text: string };
type Store = { chunks: Chunk[]; tfidf: any };

const CHUNKS = path.join(process.cwd(), "data", "chunks.json");

declare global {
  // eslint-disable-next-line no-var
  var __LUMI_STORE__: Promise<Store> | undefined;
}

async function buildStore(): Promise<Store> {
  if (!fs.existsSync(CHUNKS)) {
    throw new Error("Base não encontrada. Rode: npm run ingest");
  }

  const raw = JSON.parse(fs.readFileSync(CHUNKS, "utf-8")) as {
    chunks: Chunk[];
  };
  const TfIdf = natural.TfIdf;
  const tfidf = new TfIdf();
  raw.chunks.forEach((c) => tfidf.addDocument(c.text));

  return { chunks: raw.chunks, tfidf };
}

export function getStore(): Promise<Store> {
  if (!global.__LUMI_STORE__) global.__LUMI_STORE__ = buildStore();
  return global.__LUMI_STORE__;
}

export async function searchTopK(query: string, k = 4) {
  const store = await getStore();
  const scores: Array<{ i: number; score: number }> = [];

  store.tfidf.tfidfs(query, (i: number, measure: number) => {
    scores.push({ i, score: measure });
  });

  scores.sort((a, b) => b.score - a.score);
  const top = scores.slice(0, k).filter((x) => x.score > 0);

  return top.map(({ i }) => store.chunks[i]);
}

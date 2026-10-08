import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface FeedItem {
  id: string;
  category: string;
  title: string;
  summary: string;
  publishedAt: string;
}

export interface DigestItem {
  id: string;
  title: string;
  summary: string;
}

export interface DigestSection {
  category: string;
  items: DigestItem[];
}

export interface Digest {
  date: string;
  total: number;
  sections: DigestSection[];
}

const feedFile = fileURLToPath(new URL("../data/feed.json", import.meta.url));

function shorten(text: string, max = 120): string {
  const flat = text.trim().replace(/\s+/g, " ");
  const sentence = flat.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? flat;
  return sentence.length <= max ? sentence : `${sentence.slice(0, max - 3).trimEnd()}...`;
}

export function buildDigest(date: string): Digest {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`date must be YYYY-MM-DD, got "${date}"`);
  }
  const feed: FeedItem[] = JSON.parse(readFileSync(feedFile, "utf8"));
  const dayItems = feed
    .filter((item) => item.publishedAt.startsWith(date))
    .sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
  const byCategory = new Map<string, DigestItem[]>();
  for (const item of dayItems) {
    const items = byCategory.get(item.category) ?? [];
    items.push({ id: item.id, title: item.title, summary: shorten(item.summary) });
    byCategory.set(item.category, items);
  }
  const sections = [...byCategory.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, items]) => ({ category, items }));
  return { date, total: dayItems.length, sections };
}

const isMain =
  process.argv[1] !== undefined && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const date = process.argv[2] ?? new Date().toISOString().slice(0, 10);
  console.log(JSON.stringify(buildDigest(date), null, 2));
}

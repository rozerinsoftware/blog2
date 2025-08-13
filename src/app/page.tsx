import type { Metadata } from "next";
import Link from "next/link";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";

function Separator({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700 ${className}`}
    />
  );
}

// Yazılar veritabanından okunur

export const metadata: Metadata = {
  title: "Blog Yazıları",
  description: "Son yazılar ve güncellemeler",
};

function formatDate(isoDateString: string): string {
  try {
    return new Date(isoDateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  } catch {
    return isoDateString;
  }
}

function safeImageSrc(input: string | null | undefined): string {
  const placeholder = "https://placehold.co/1280x720.png?text=No+Image";
  if (!input) return placeholder;
  try {
    const url = new URL(input);
    const allowedHosts = new Set([
      "images.unsplash.com",
      "picsum.photos",
      "placehold.co",
      "perspektifyazilim.com",
    ]);
    if (!allowedHosts.has(url.hostname)) return placeholder;
    return url.toString();
  } catch {
    return placeholder;
  }
}

type DbPost = {
  id: number;
  title: string;
  description: string;
  coverUrl: string | null;
  date: string | null;
};

export default async function Home() {
  const [rows] = await pool.query(
    "SELECT id, title, description, coverUrl, date FROM posts ORDER BY id DESC"
  );
  const blogPosts = Array.isArray(rows) ? (rows as DbPost[]) : [];
  const imgPlaceholder = "https://placehold.co/1280x720?text=No+Image";
  return (
    <main className="mx-auto max-w-3xl p-6 md:p-10">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Blog Yazıları</h1>
          <p className="mt-2 text-gray-600">En son yazılar, ipuçları ve duyurular.</p>
        </div>
      </header>
      <Separator className="mb-6" />

      {blogPosts.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">Henüz bir yazı eklenmemiş.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-slate-900"
            >
              <div className="aspect-[4/3] w-full overflow-hidden rounded-t-2xl">
                <img
                  src={safeImageSrc(post.coverUrl)}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6 md:p-8 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-700 dark:bg-white/10 dark:text-gray-300">
                    {post.date ? formatDate(String(post.date)) : "Tarih yok"}
                  </span>
                </div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  <Link
                    href={`/posts/${post.id}`}
                    className="hover:underline"
                    aria-label={`${post.title} yazısını oku`}
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-slate-700 dark:text-gray-300">{post.description}</p>
                <div className="pt-2">
                  <Link
                    href={`/posts/${post.id}`}
                    className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    aria-label={`${post.title} yazısının detaylarına git`}
                  >
                    Oku <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

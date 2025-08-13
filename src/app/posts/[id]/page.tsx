import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import pool from "@/lib/db";

function Separator({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700 ${className}`}
    />
  );
}
import { notFound } from "next/navigation";

type DbPost = {
  id: number;
  title: string;
  description: string;
  content: string;
  coverUrl: string | null;
  date: string | Date | null;
};

async function getPostById(idParam: string): Promise<DbPost | null> {
  const [rows] = await pool.query(
    "SELECT id, title, description, content, coverUrl, date FROM posts WHERE id = ? LIMIT 1",
    [idParam]
  );
  const post = Array.isArray(rows) && rows.length > 0 ? (rows[0] as DbPost) : null;
  return post;
}

export async function generateStaticParams() {
  const [rows] = await pool.query("SELECT id FROM posts ORDER BY id DESC LIMIT 50");
  const ids = Array.isArray(rows) ? rows.map((r: any) => ({ id: String(r.id) })) : [];
  return ids;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) return { title: "Yazı Bulunamadı" };
  return {
    title: `${post.title} | Blog`,
    description: post.description,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) return notFound();

  function formatDate(value: string | Date | null): string {
    if (!value) return "";
    try {
      const d = value instanceof Date ? value : new Date(value);
      return d.toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "2-digit" });
    } catch {
      return String(value);
    }
  }

  return (
    <main className="p-8 space-y-6">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Ana sayfaya dön
      </Link>

      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10">
        <Image
          src={post.coverUrl && (post.coverUrl.includes('images.unsplash.com') || post.coverUrl.includes('picsum.photos') || post.coverUrl.includes('placehold.co')) ? post.coverUrl : "https://placehold.co/1280x720.png?text=No+Image"}
          alt={post.title}
          width={1280}
          height={720}
          className="h-auto w-full object-cover"
          priority
        />
      </div>

      <article className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 dark:border-white/10 dark:bg-slate-900">
        <header className="mb-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{post.title}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{formatDate(post.date)}</p>
          <p className="mt-2 text-slate-700 dark:text-gray-300">{post.description}</p>
        </header>
        <Separator className="my-6" />

        <section className="mt-6 space-y-4 leading-7 text-slate-800 dark:text-gray-200">
          <p>{post.content}</p>
        </section>
      </article>
    </main>
  );
}


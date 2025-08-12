import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Post = {
  id: number;
  title: string;
  description: string;
  date: string;
  content: string;
};

// Basit örnek veri; gerçekte bir API ya da veri kaynağından gelebilir
const posts: Post[] = [
  {
    id: 1,
    title: "İlk Blog Yazım",
    description: "Bu, blog projemizin ilk yazısıdır.",
    date: "2025-08-11",
    content:
      "Bu yazıda blog projemizin hedeflerini, teknolojik tercihleri ve sonraki adımları özetliyorum. Next.js App Router, TypeScript ve TailwindCSS kullanıyoruz.",
  },
  {
    id: 2,
    title: "Next.js ile Proje Geliştirme",
    description: "Next.js kullanarak blog nasıl yapılır anlattım.",
    date: "2025-08-12",
    content:
      "Bu yazıda Next.js ile sayfa yapısı, dinamik rotalar ve metadata üretimi gibi konulara değiniyorum. Ayrıca dosya tabanlı yönlendirme örnekleri mevcut.",
  },
];

function getPostById(idParam: string): Post | undefined {
  return posts.find((post) => String(post.id) === idParam);
}

export async function generateStaticParams() {
  return posts.map((post) => ({ id: String(post.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const post = getPostById(params.id);
  if (!post) return { title: "Yazı Bulunamadı" };
  return {
    title: `${post.title} | Blog`,
    description: post.description,
  };
}

export default function PostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = getPostById(params.id);
  if (!post) return notFound();

  return (
    <main className="p-8 space-y-6">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Ana sayfaya dön
      </Link>

      <article className="prose prose-slate max-w-none">
        <header className="mb-4">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <p className="text-gray-500 text-sm mt-1">{post.date}</p>
          <p className="text-gray-700 mt-2">{post.description}</p>
        </header>

        <section className="mt-6 leading-7 text-gray-800">
          <p>{post.content}</p>
        </section>
      </article>
    </main>
  );
}


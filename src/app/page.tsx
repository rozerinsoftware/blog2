import type { Metadata } from "next";
import Link from "next/link";

type PostSummary = {
  id: number;
  title: string;
  description: string;
  date: string; // ISO tarih
};

export const metadata: Metadata = {
  title: "Blog Yazıları",
  description: "Son yazılar ve güncellemeler",
};

const blogPosts: PostSummary[] = [
  {
    id: 1,
    title: "İlk Blog Yazım",
    description: "Bu, blog projemizin ilk yazısıdır.",
    date: "2025-08-11",
  },
  {
    id: 2,
    title: "Next.js ile Proje Geliştirme",
    description: "Next.js kullanarak blog nasıl yapılır anlattım.",
    date: "2025-08-12",
  },
];

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

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-6 md:p-10">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Blog Yazıları</h1>
        <p className="mt-2 text-gray-600">En son yazılar, ipuçları ve duyurular.</p>
      </header>

      {blogPosts.length === 0 ? (
        <p className="text-gray-500">Henüz bir yazı eklenmemiş.</p>
      ) : (
        <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
          {blogPosts.map((post) => (
            <li key={post.id} className="p-5 hover:bg-gray-50 transition-colors">
              <article className="space-y-2">
                <h2 className="text-xl md:text-2xl font-semibold">
                  <Link
                    href={`/posts/${post.id}`}
                    className="hover:underline"
                    aria-label={`${post.title} yazısını oku`}
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-700">{post.description}</p>
                <div className="text-sm text-gray-500">{formatDate(post.date)}</div>
                <div>
                  <Link
                    href={`/posts/${post.id}`}
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                    aria-label={`${post.title} yazısının detaylarına git`}
                  >
                    Devamını oku <span aria-hidden>→</span>
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

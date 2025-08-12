import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

type PostSummary = {
  id: number;
  title: string;
  description: string;
  date: string; // ISO tarih
  coverUrl: string;
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
    coverUrl:
      "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Next.js ile Proje Geliştirme",
    description: "Next.js kullanarak blog nasıl yapılır anlattım.",
    date: "2025-08-12",
    coverUrl:
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1400&auto=format&fit=crop",
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
        <p className="text-gray-600 dark:text-gray-300">Henüz bir yazı eklenmemiş.</p>
      ) : (
        <div className="grid gap-6 md:gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-slate-900"
            >
              <div className="aspect-[16/9] w-full overflow-hidden rounded-t-2xl">
                <Image
                  src={post.coverUrl}
                  alt={post.title}
                  width={1280}
                  height={720}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              <div className="p-6 md:p-8 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-700 dark:bg-white/10 dark:text-gray-300">
                    {formatDate(post.date)}
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

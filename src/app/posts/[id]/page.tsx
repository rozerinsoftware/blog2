import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

type Post = {
  id: number;
  title: string;
  description: string;
  date: string;
  content: string[];
  highlights?: string[];
  coverUrl: string;
};

// Basit örnek veri; gerçekte bir API ya da veri kaynağından gelebilir
const posts: Post[] = [
  {
    id: 1,
    title: "İlk Blog Yazım",
    description: "Bu, blog projemizin ilk yazısıdır.",
    date: "2025-08-11",
    content: [
      "Bu yazıda blog projemizin hedeflerini, teknolojik tercihleri ve sonraki adımları detaylı bir şekilde paylaşıyorum. Amacımız hızlı, erişilebilir ve keyifli bir okuma deneyimi sunmak.",
      "Başlangıçta basit bir veri modeli ile ilerliyoruz. Zamanla kategori, etiket ve arama gibi özellikler ekleyerek içeriği daha keşfedilebilir hale getireceğiz.",
      "Performans tarafında önceliğimiz; statik ön-oluşturma, resim optimizasyonu ve tarayıcı önbelleğinin verimli kullanımı olacak.",
    ],
    highlights: [
      "Next.js 15 App Router ile dosya-tabanlı yönlendirme",
      "TypeScript ile güçlü tip güvenliği",
      "TailwindCSS ile hızlı ve tutarlı stil geliştirme",
      "Next/Image ile otomatik görsel optimizasyonu",
    ],
    coverUrl:
      "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Next.js ile Proje Geliştirme",
    description: "Next.js kullanarak blog nasıl yapılır anlattım.",
    date: "2025-08-12",
    content: [
      "Bu yazıda Next.js ile sayfa yapısı, dinamik rotalar ve metadata üretimi gibi konulara daha derinlemesine bakıyoruz. App Router'ın sunduğu yeni sözleşmeler projeyi ölçeklenebilir kılıyor.",
      "Dinamik segmentler (örn. [id]) sayesinde tek bir şablonla çok sayıda içeriği kolayca oluşturabiliyoruz. Ayrıca `generateStaticParams` ile ön-oluşturma yaparak performansı artırıyoruz.",
      "Geliştirme deneyimini iyileştirmek için dosya organizasyonu, tip tanımları ve yeniden kullanılabilir bileşenler üzerine odaklanacağız.",
    ],
    highlights: [
      "`generateMetadata` ile SEO uyumlu başlık/açıklama",
      "ISR stratejisi ile hızlı yayınlama",
      "Daha iyi UX için tutarlı tipografi ve boşluk kullanımı",
    ],
    coverUrl:
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1400&auto=format&fit=crop",
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
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = getPostById(id);
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
  const post = getPostById(id);
  if (!post) return notFound();

  return (
    <main className="p-8 space-y-6">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Ana sayfaya dön
      </Link>

      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10">
        <Image
          src={post.coverUrl}
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
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{post.date}</p>
          <p className="mt-2 text-slate-700 dark:text-gray-300">{post.description}</p>
        </header>

        <section className="mt-6 space-y-4 leading-7 text-slate-800 dark:text-gray-200">
          {post.content.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}

          {post.highlights && post.highlights.length > 0 && (
            <ul className="list-disc pl-6 marker:text-slate-500 dark:marker:text-gray-400">
              {post.highlights.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      </article>
    </main>
  );
}


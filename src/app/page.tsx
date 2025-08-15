// src/app/page.tsx
import { supabase } from "@/lib/supabaseClient";
// import MotionFadeIn from "@/components/MotionFadeIn";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog Yazıları",
  description: "Son yazılar ve güncellemeler",
};

export type DbPost = {
  id: number;
  title: string;
  description: string;
  content: string;
  coverUrl: string | null;
  date: string | null;
  created_at: string | null;
  updated_at: string | null;
};

function Separator({ className = "" }: { className?: string }) {
  return <div className={`h-px w-full bg-gray-300 dark:bg-gray-700 ${className}`} />;
}

function safeImageSrc(input: string | null | undefined): string {
  return input || "https://placehold.co/1280x720.png?text=No+Image";
}

function formatDate(date: string | null): string {
  if (!date) return "Tarih yok";
  return new Date(date).toLocaleDateString("tr-TR");
}

export default async function BlogPage() {
  console.log("🔍 Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("🔍 Supabase Key exists:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  let blogPosts: DbPost[] = [];
  let error: string | null = null;

  try {
    console.log("📡 Supabase'den veri çekiliyor...");
    
    const { data, error: supabaseError } = await supabase
      .from("posts")
      .select("id, title, description, content, coverUrl, date, created_at, updated_at")
      .order("id", { ascending: false });

    if (supabaseError) {
      console.error("❌ Supabase Error:", supabaseError);
      error = supabaseError.message || "Supabase hatası";
    } else {
      console.log("✅ Supabase'den gelen data:", data);
      blogPosts = (data as DbPost[]) || [];
      console.log("📊 Post sayısı:", blogPosts.length);
    }
  } catch (err) {
    console.error("❌ Catch Error:", err);
    error = err instanceof Error ? err.message : "Bilinmeyen hata";
  }

  return (
    <main className="mx-auto max-w-7xl p-6 md:p-10">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Blog Yazıları</h1>
        <p className="mt-2 text-gray-600">En son yazılar ve duyurular</p>
      </header>

      <Separator className="mb-6" />

      {/* Debug Bilgileri */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg text-sm">
        <h3 className="font-bold mb-2">🔧 Debug Bilgileri:</h3>
        <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || "❌ Tanımlanmamış"}</p>
        <p>Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Tanımlanmış" : "❌ Tanımlanmamış"}</p>
        <p>Error: {error ? String(JSON.stringify(error, null, 2)) : "Yok"}</p>
        <p>Post Sayısı: {blogPosts.length}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded">
          <p className="text-red-700">
            <strong>Hata:</strong> {error}
          </p>
        </div>
      )}

      {blogPosts.length === 0 && !error ? (
        <p>Henüz bir yazı eklenmemiş.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {blogPosts.map((post) => (
            <article key={post.id} className="flex flex-col border p-4 rounded-lg shadow-sm">
              <img
                src={safeImageSrc(post.coverUrl)}
                alt={post.title}
                className="h-48 w-full object-cover rounded"
              />
              <h2 className="text-xl font-semibold mt-2">
                <Link href={`/posts/${post.id}`}>{post.title}</Link>
              </h2>
              <p className="mt-1 text-gray-700">{post.description}</p>
              <span className="mt-2 text-sm text-gray-500">
                {formatDate(post.date || post.created_at)}
              </span>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
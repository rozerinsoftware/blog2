// src/app/page.tsx
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";

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
  cover_url: string | null;
  date: string | null;
  created_at: string | null;
  updated_at: string | null;
};

function formatDate(date: string | null): string {
  if (!date) return "Tarih yok";
  return new Date(date).toLocaleDateString("tr-TR", {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default async function BlogPage() {
  let blogPosts: DbPost[] = [];
  let error: string | null = null;

  try {
    const { data, error: supabaseError } = await supabase
      .from("posts")
      .select("id, title, description, content, cover_url, date, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (supabaseError) {
      error = supabaseError.message || "Veri yüklenirken hata oluştu";
    } else {
      blogPosts = (data as DbPost[]) || [];
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "Bilinmeyen hata";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Blog Yazıları
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            En son yazılar, güncellemeler ve ilham verici içerikler
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 text-center">
              <strong>Hata:</strong> {error}
            </p>
          </div>
        )}

        {blogPosts.length === 0 && !error ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">Henüz yazı yok</h3>
            <p className="text-gray-500">İlk blog yazısı yakında eklenecek!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {blogPosts.map((post) => (
              <article 
                key={post.id}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200"
              >
                {/* Cover Image */}
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={post.cover_url || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                      {formatDate(post.date || post.created_at)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    <Link href={`/posts/${post.id}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h2>
                  
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {post.description}
                  </p>
                  
                  <Link 
                    href={`/posts/${post.id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group-hover:translate-x-1 transition-transform"
                  >
                    Devamını Oku
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Newsletter Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Güncel Kalın</h3>
          <p className="text-blue-100 mb-6">Yeni yazılarımızdan haberdar olmak için abone olun</p>
          <div className="flex max-w-md mx-auto gap-3">
            <input 
              type="email" 
              placeholder="E-posta adresiniz"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Abone Ol
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
// src/app/posts/[id]/page.tsx
import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";

type Post = {
  id: number;
  title: string;
  description: string;
  content: string;
  coverUrl?: string;
  date?: string;
  created_at?: string;
  updated_at?: string;
};

// ✅ Static params oluşturma
export async function generateStaticParams() {
  const { data, error } = await supabase
    .from("posts")
    .select("id")
    .order("id", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Supabase error in generateStaticParams:", error);
    return [];
  }

  return (data || []).map((post) => ({
    id: String(post.id),
  }));
}

// ✅ Tek bir post verisini çekme
async function getPostById(id: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Supabase error in getPostById:", error);
    return null;
  }

  return data as Post;
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);

  if (!post) {
    return notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <article>
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        {post.coverUrl && (
          <img
            src={post.coverUrl}
            alt={post.title}
            className="w-full max-h-[400px] object-cover mb-4"
          />
        )}
        <p className="text-gray-600 mb-4">{post.description}</p>
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <p className="text-sm text-gray-500 mt-6">
          {post.date || post.created_at
            ? new Date(post.date || post.created_at!).toLocaleDateString("tr-TR")
            : ""}
        </p>
      </article>
    </main>
  );
}

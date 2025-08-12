"use client";
import { useEffect, useState } from "react";

type PostRow = {
  id: number;
  title: string;
  description: string;
  coverUrl?: string;
  date?: string | null;
};

export default function AdminPostsPanel() {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Listeleme hatası");
        setPosts(data.posts || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, content, coverUrl, date }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Oluşturma hatası");
      // Basit yenileme
      location.reload();
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p className="text-red-600">Hata: {error}</p>;

  return (
    <div className="grid gap-8">
      <section>
        <h2 className="mb-3 text-xl font-semibold">Yazılar</h2>
        {posts.length === 0 ? (
          <p className="text-gray-600">Henüz yazı yok.</p>
        ) : (
          <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200">
            {posts.map((p) => (
              <li key={p.id} className="p-4">
                <div className="font-medium">{p.title}</div>
                <div className="text-sm text-gray-600">{p.description}</div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Yeni Yazı Oluştur</h2>
        <form onSubmit={handleCreate} className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4">
          <input
            placeholder="Başlık"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
            required
          />
          <input
            placeholder="Açıklama"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
            required
          />
          <textarea
            placeholder="İçerik"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
            required
          />
          <input
            placeholder="Kapak Görseli URL (opsiyonel)"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
          />
          <input
            type="date"
            placeholder="Tarih (opsiyonel)"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
          />
          <button className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500" type="submit">
            Oluştur
          </button>
        </form>
      </section>
    </div>
  );
}



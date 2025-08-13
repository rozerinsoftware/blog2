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

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCoverUrl, setEditCoverUrl] = useState("");
  const [editDate, setEditDate] = useState("");

  async function fetchPostsList() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Listeleme hatası");
      setPosts(data.posts || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPostsList();
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
      // Listeyi tazele ve formu temizle
      setTitle("");
      setDescription("");
      setContent("");
      setCoverUrl("");
      setDate("");
      await fetchPostsList();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    }
  }

  async function handleEditClick(id: number) {
    setError(null);
    try {
      const res = await fetch(`/api/posts/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Detay okunamadı");
      const p = data.post as { title: string; description: string; content: string; coverUrl?: string | null; date?: string | null };
      setEditTitle(p.title || "");
      setEditDescription(p.description || "");
      setEditContent(p.content || "");
      setEditCoverUrl(p.coverUrl || "");
      setEditDate(p.date || "");
      setEditingId(id);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setError(null);
    try {
      const res = await fetch(`/api/posts/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          content: editContent,
          coverUrl: editCoverUrl,
          date: editDate || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Güncelleme hatası");
      setEditingId(null);
      await fetchPostsList();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    }
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function handleDelete(id: number) {
    setError(null);
    const ok = typeof window !== "undefined" ? window.confirm("Bu yazıyı silmek istediğinize emin misiniz?") : true;
    if (!ok) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Silme hatası");
      await fetchPostsList();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
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
                {editingId === p.id ? (
                  <form onSubmit={handleUpdate} className="grid gap-3">
                    <input
                      placeholder="Başlık"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                      required
                    />
                    <input
                      placeholder="Açıklama"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                      required
                    />
                    <textarea
                      placeholder="İçerik"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[100px] w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                      required
                    />
                    <input
                      placeholder="Kapak Görseli URL (opsiyonel)"
                      value={editCoverUrl}
                      onChange={(e) => setEditCoverUrl(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                    />
                    <input
                      type="date"
                      placeholder="Tarih (opsiyonel)"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <button className="rounded-md bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-500" type="submit">
                        Kaydet
                      </button>
                      <button type="button" onClick={cancelEdit} className="rounded-md bg-gray-200 px-3 py-2 text-gray-800 hover:bg-gray-300">
                        İptal
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium">{p.title}</div>
                      <div className="text-sm text-gray-600">{p.description}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditClick(p.id)} className="rounded-md bg-yellow-500 px-3 py-1.5 text-white hover:bg-yellow-400">
                        Düzenle
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="rounded-md bg-red-600 px-3 py-1.5 text-white hover:bg-red-500">
                        Sil
                      </button>
                    </div>
                  </div>
                )}
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



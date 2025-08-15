"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Post = {
  id: number;
  title: string;
  description: string;
  content: string;
  coverUrl?: string | null;
  date?: string | null;
};

type User = {
  id: string;
  email: string;
  role?: string;
};

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error("Giriş yapmalısınız");

        const role = (user.user_metadata as any)?.role || "user";
        if (role !== "admin") throw new Error("Yetkisiz erişim");

        setCurrentUser({ id: user.id, email: user.email!, role });

        // Posts çek
        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select("*")
          .order("id", { ascending: false });
        if (postsError) throw postsError;
        setPosts(postsData || []);

        // Users çek
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("*")
          .order("created_at", { ascending: false });
        if (usersError) throw usersError;
        setUsers(usersData || []);
      } catch (err: any) {
        setError(err.message || "Bilinmeyen hata");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <main className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Paneli</h1>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Çıkış Yap
        </button>
      </div>

      {/* Posts Listesi */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Posts</h2>
        <ul className="list-disc list-inside">
          {posts.map((p) => (
            <li key={p.id}>{p.title}</li>
          ))}
        </ul>
      </section>

      {/* Users Listesi */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Users</h2>
        <ul className="list-disc list-inside">
          {users.map((u) => (
            <li key={u.id}>
              {u.email} - {u.role || "user"}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

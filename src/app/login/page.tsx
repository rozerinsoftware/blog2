"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!password) {
        // şifresiz giriş: guest-login
        const guestRes = await fetch("/api/guest-login", { method: "POST" });
        const guestData = await guestRes.json();
        if (!guestRes.ok) throw new Error(guestData?.message || "Misafir giriş başarısız");
        const role = guestData?.user?.role;
        if (role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
        return;
      }
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Giriş başarısız");
      const role = data?.user?.role;
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGuestLogin() {
    setError(null);
    setLoading(true);
    try {
      const guestRes = await fetch("/api/guest-login", { method: "POST" });
      const guestData = await guestRes.json();
      if (!guestRes.ok) throw new Error(guestData?.message || "Misafir giriş başarısız");
      const role = guestData?.user?.role;
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md p-6 md:p-10">
      <h1 className="mb-6 text-2xl font-bold">Giriş Yap</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
        <div>
          <label className="mb-1 block text-sm text-gray-700">E-posta</label>
          <input
            type="email"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-700">Şifre</label>
          <input
            type="password"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="mt-1 text-xs text-gray-500">Şifren yoksa boş bırakabilir veya Misafir Giriş'i kullanabilirsin.</p>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Gönderiliyor..." : "Giriş Yap"}
          </button>
          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={loading}
            className="inline-flex items-center rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
          >
            Misafir Giriş
          </button>
        </div>
        <div className="text-sm text-gray-600">
          Hesabın yok mu? <Link className="text-indigo-600 hover:underline" href="/signup">Kayıt ol</Link>
        </div>
      </form>
    </main>
  );
}



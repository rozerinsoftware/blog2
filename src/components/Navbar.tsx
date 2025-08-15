"use client";

import { useEffect, useState } from "react";
import AuthMenu from "./AuthMenu";

type User = { id: string; email: string; role: string } | null;

export default function Navbar() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function load() {
      try {
        const res = await fetch("/api/me", {
          cache: "no-store",
          credentials: "include",
        });
        const data = await res.json();
        setUser(data?.user ?? null);
      } catch (error) {
        setUser(null);
      }
    }
    load();
  }, []);

  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <div className="flex items-center gap-6">
          <a
            href="/"
            className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Blog
          </a>
          <div className="hidden md:flex items-center gap-4">
            <a
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Anasayfa
            </a>
            {/* Admin butonu anasayfanın yanında */}
            {mounted && user?.role === "admin" && (
              <a
                className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 transition-all text-sm font-medium"
                href="/admin"
              >
                🛠️ Admin Paneli
              </a>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Giriş yapılmışsa sadece çıkış butonu, yapılmamışsa giriş/kayıt butonları */}
          <AuthMenu />
        </div>
      </nav>
    </header>
  );
}

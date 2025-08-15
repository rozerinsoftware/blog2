"use client";

import { useEffect, useState } from "react";
import LogoutButton from "./LogoutButton";

type User = { id: string; email: string; role: string } | null;

export default function AuthMenu() {
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

  if (!mounted) {
    return <div className="h-6 w-20 animate-pulse rounded bg-gray-100" />;
  }

  if (user === undefined) {
    return <div className="h-6 w-20 animate-pulse rounded bg-gray-100" />;
  }

  // Giriş yapılmamışsa - giriş/kayıt butonları
  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <a
          href="/login"
          className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          Giriş Yap
        </a>
        <a
          href="/signup"
          className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
        >
          Kayıt Ol
        </a>
      </div>
    );
  }

  // Giriş yapılmışsa - sadece çıkış butonu
  return (
    <div className="flex items-center gap-4">
      <LogoutButton />
    </div>
  );
}




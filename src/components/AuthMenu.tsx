"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

type User = { id: number; email: string; role: string } | null;

export default function AuthMenu() {
  const [user, setUser] = useState<User | undefined>(undefined);

  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/me", { cache: "no-store", credentials: "include" });
        const data = await res.json();
        if (!cancelled) setUser(data?.user ?? null);
      } catch {
        if (!cancelled) setUser(null);
      }
    }
    load();
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    const i = setInterval(load, 30000);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", onFocus);
      clearInterval(i);
    };
  }, [pathname]);

  if (user === undefined) {
    return <div className="h-6 w-20 animate-pulse rounded bg-gray-100" />;
  }

  if (!user) {
    return (
      <>
        <Link className="text-gray-700 hover:underline" href="/login" prefetch={false}>Giriş</Link>
        <Link className="rounded-md bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-500" href="/signup" prefetch={false}>Kayıt ol</Link>
      </>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {user.role === "admin" && (
        <Link className="text-gray-700 hover:underline" href="/admin" prefetch={false}>Admin</Link>
      )}
      <LogoutButton />
    </div>
  );
}



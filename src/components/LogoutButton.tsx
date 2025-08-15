"use client";

import { useState } from "react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (loading) return;
    setLoading(true);
    
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Çıkış başarılı - doğrudan login sayfasına yönlendir
        window.location.href = "/login";
      } else {
        console.error("Çıkış başarısız:", response.status);
        // Hata olsa bile login sayfasına yönlendir
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Çıkış hatası:", error);
      // Hata olsa bile login sayfasına yönlendir
      window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors border border-red-200 hover:border-red-300"
    >
      {loading ? "Çıkış yapılıyor..." : "Çıkış Yap"}
    </button>
  );
}



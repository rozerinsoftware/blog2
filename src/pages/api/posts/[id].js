// src/pages/api/posts/index.ts
import { supabase } from "../../../lib/supabaseClient";
import { getTokenFromRequest, verifyAuthToken } from "../../../lib/auth";

export default async function handler(req, res) {
  function isValidDateString(value) {
    if (!value) return true;
    if (typeof value !== "string") return false;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [y, m, d] = value.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    return (
      dt.getUTCFullYear() === y &&
      dt.getUTCMonth() === m - 1 &&
      dt.getUTCDate() === d
    );
  }

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("id", { ascending: false });

    if (error) return res.status(500).json({ success: false, message: "Sunucu hatası" });

    return res.status(200).json({ success: true, posts: data });
  }

  if (req.method === "POST") {
    const token = getTokenFromRequest(req);
    const payload = token ? verifyAuthToken(token) : null;
    if (!payload || payload.role !== "admin") {
      return res.status(401).json({ success: false, message: "Yetkisiz" });
    }

    const { title, description, content, coverUrl, date } = req.body || {};
    if (!title || !description || !content) {
      return res.status(400).json({ success: false, message: "Eksik alanlar" });
    }
    if (!isValidDateString(date)) {
      return res.status(400).json({ success: false, message: "Geçersiz tarih formatı. YYYY-MM-DD girin." });
    }

    const { data, error } = await supabase.from("posts").insert([
      { title, description, content, coverUrl: coverUrl || "", date: date || null },
    ]);

    if (error) return res.status(500).json({ success: false, message: "Sunucu hatası" });

    return res.status(201).json({ success: true, id: data[0].id });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ success: false, message: "Method Not Allowed" });
}

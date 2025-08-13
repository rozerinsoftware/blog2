import pool, { ensureDatabaseAndSchema } from "../../../lib/db";
import { getTokenFromRequest, verifyAuthToken } from "../../../lib/auth";

export default async function handler(req, res) {
  const { id } = req.query;
  function isValidDateString(value) {
    if (value == null || value === "") return true; // boş tarih kabul
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
    try {
      await ensureDatabaseAndSchema();
      const [rows] = await pool.query(
        "SELECT id, title, description, content, coverUrl, date, created_at, updated_at FROM posts WHERE id = ? LIMIT 1",
        [id]
      );
      const post = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
      if (!post) return res.status(404).json({ success: false, message: "Bulunamadı" });
      return res.status(200).json({ success: true, post });
    } catch (error) {
      console.error("GET /api/posts/[id] error:", error);
      const message =
        process.env.NODE_ENV !== "production" && error instanceof Error
          ? error.message
          : "Sunucu hatası";
      return res.status(500).json({ success: false, message });
    }
  }

  // Auth gerekli
  const token = getTokenFromRequest(req);
  const payload = token ? verifyAuthToken(token) : null;
  if (!payload || payload.role !== 'admin') {
    return res.status(401).json({ success: false, message: "Yetkisiz" });
  }

  if (req.method === "PATCH") {
    try {
      await ensureDatabaseAndSchema();
      const { title, description, content, coverUrl, date } = req.body || {};
      if (!isValidDateString(date)) {
        return res.status(400).json({ success: false, message: "Geçersiz tarih formatı. Lütfen YYYY-MM-DD girin." });
      }
      const [result] = await pool.query(
        "UPDATE posts SET title = COALESCE(?, title), description = COALESCE(?, description), content = COALESCE(?, content), coverUrl = COALESCE(?, coverUrl), date = COALESCE(?, date), updated_at = NOW() WHERE id = ?",
        [title, description, content, coverUrl, date, id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Bulunamadı" });
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("PATCH /api/posts/[id] error:", error);
      const message =
        process.env.NODE_ENV !== "production" && error instanceof Error
          ? error.message
          : "Sunucu hatası";
      return res.status(500).json({ success: false, message });
    }
  }

  if (req.method === "DELETE") {
    try {
      await ensureDatabaseAndSchema();
      const [result] = await pool.query("DELETE FROM posts WHERE id = ?", [id]);
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Bulunamadı" });
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("DELETE /api/posts/[id] error:", error);
      const message =
        process.env.NODE_ENV !== "production" && error instanceof Error
          ? error.message
          : "Sunucu hatası";
      return res.status(500).json({ success: false, message });
    }
  }

  res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
  return res.status(405).json({ success: false, message: "Method Not Allowed" });
}



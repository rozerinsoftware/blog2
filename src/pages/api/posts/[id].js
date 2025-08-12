import pool from "../../../lib/db";
import { getTokenFromRequest, verifyAuthToken } from "../../../lib/auth";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const [rows] = await pool.query(
        "SELECT id, title, description, content, coverUrl, date, created_at, updated_at FROM posts WHERE id = ? LIMIT 1",
        [id]
      );
      const post = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
      if (!post) return res.status(404).json({ success: false, message: "Bulunamadı" });
      return res.status(200).json({ success: true, post });
    } catch (error) {
      console.error("GET /api/posts/[id] error:", error);
      return res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
  }

  // Auth gerekli
  const token = getTokenFromRequest(req);
  const payload = token ? verifyAuthToken(token) : null;
  if (!payload) {
    return res.status(401).json({ success: false, message: "Yetkisiz" });
  }

  if (req.method === "PATCH") {
    try {
      const { title, description, content, coverUrl, date } = req.body || {};
      const [result] = await pool.query(
        "UPDATE posts SET title = COALESCE(?, title), description = COALESCE(?, description), content = COALESCE(?, content), coverUrl = COALESCE(?, coverUrl), date = COALESCE(?, date), updated_at = NOW() WHERE id = ?",
        [title, description, content, coverUrl, date, id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Bulunamadı" });
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("PATCH /api/posts/[id] error:", error);
      return res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const [result] = await pool.query("DELETE FROM posts WHERE id = ?", [id]);
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Bulunamadı" });
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("DELETE /api/posts/[id] error:", error);
      return res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
  }

  res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
  return res.status(405).json({ success: false, message: "Method Not Allowed" });
}



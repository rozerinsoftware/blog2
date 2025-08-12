import pool from "../../../lib/db";
import { getTokenFromRequest, verifyAuthToken } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Public listeleme
    try {
      const [rows] = await pool.query(
        "SELECT id, title, description, coverUrl, date, created_at, updated_at FROM posts ORDER BY id DESC"
      );
      return res.status(200).json({ success: true, posts: rows });
    } catch (error) {
      console.error("GET /api/posts error:", error);
      return res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
  }

  if (req.method === "POST") {
    // Auth kontrol
    const token = getTokenFromRequest(req);
    const payload = token ? verifyAuthToken(token) : null;
    if (!payload) {
      return res.status(401).json({ success: false, message: "Yetkisiz" });
    }

    try {
      const { title, description, content, coverUrl, date } = req.body || {};
      if (!title || !description || !content) {
        return res.status(400).json({ success: false, message: "Eksik alanlar" });
      }

      const [result] = await pool.query(
        "INSERT INTO posts (title, description, content, coverUrl, date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
        [title, description, content, coverUrl || "", date || null]
      );

      return res
        .status(201)
        .json({ success: true, id: result.insertId });
    } catch (error) {
      console.error("POST /api/posts error:", error);
      return res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ success: false, message: "Method Not Allowed" });
}



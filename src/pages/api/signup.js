import pool, { ensureDatabaseAndSchema } from "../../lib/db";
import bcrypt from "bcryptjs";
import { signAuthToken, setAuthCookie } from "../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    await ensureDatabaseAndSchema();
    const { email, password } = req.body || {};

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ success: false, message: "Geçersiz giriş verisi" });
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || password.length < 6) {
      return res.status(400).json({ success: false, message: "Email geçerli olmalı ve şifre en az 6 karakter olmalı" });
    }

    // Kullanıcı var mı?
    const [existingRows] = await pool.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [trimmedEmail]
    );
    if (Array.isArray(existingRows) && existingRows.length > 0) {
      return res.status(409).json({ success: false, message: "Bu e-posta zaten kayıtlı" });
    }

    // Şifre hashle
    const hashed = await bcrypt.hash(password, 10);

    // Kaydet
    const [result] = await pool.query(
      "INSERT INTO users (email, password, role) VALUES (?, ?, 'user')",
      [trimmedEmail, hashed]
    );

    const userId = result?.insertId;
    const token = signAuthToken({ id: userId, email: trimmedEmail, role: 'user' });
    setAuthCookie(res, token);

    return res.status(201).json({ success: true, user: { id: userId, email: trimmedEmail } });
  } catch (error) {
    console.error("/api/signup error:", error);
    const message =
      process.env.NODE_ENV !== "production" && error instanceof Error
        ? error.message
        : "Sunucu hatası";
    return res.status(500).json({ success: false, message });
  }
}



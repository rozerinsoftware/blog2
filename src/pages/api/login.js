import pool from "../../lib/db";
import bcrypt from "bcryptjs";
import { signAuthToken, setAuthCookie } from "../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const { email, password } = req.body || {};

    if (typeof email !== "string" || typeof password !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz giriş verisi" });
    }

    const [rows] = await pool.query(
      "SELECT id, email, password FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    const user = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "E-posta veya şifre hatalı" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res
        .status(401)
        .json({ success: false, message: "E-posta veya şifre hatalı" });
    }

    const token = signAuthToken({ id: user.id, email: user.email });
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("/api/login error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Sunucu hatası" });
  }
}



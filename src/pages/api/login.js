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
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz giriş verisi" });
    }

    const [rows] = await pool.query(
      "SELECT id, email, password, role FROM users WHERE email = ? LIMIT 1",
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

    const token = signAuthToken({ id: user.id, email: user.email, role: user.role });
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("/api/login error:", error);
    const message =
      process.env.NODE_ENV !== "production" && error instanceof Error
        ? error.message
        : "Sunucu hatası";
    return res.status(500).json({ success: false, message });
  }
}



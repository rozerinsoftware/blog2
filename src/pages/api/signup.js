import { supabase } from "../../lib/supabaseClient";
import { signAuthToken, setAuthCookie } from "../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const { email, password } = req.body || {};

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ success: false, message: "Geçersiz giriş verisi" });
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || password.length < 6) {
      return res.status(400).json({ success: false, message: "Email geçerli olmalı ve şifre en az 6 karakter olmalı" });
    }

    // Supabase ile kullanıcı oluştur
    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password: password,
      options: {
        data: {
          role: 'user'
        }
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        return res.status(409).json({ success: false, message: "Bu e-posta zaten kayıtlı" });
      }
      return res.status(400).json({ success: false, message: error.message });
    }

    if (!data.user) {
      return res.status(500).json({ success: false, message: "Kullanıcı oluşturulamadı" });
    }

    const token = signAuthToken({ 
      id: data.user.id, 
      email: data.user.email, 
      role: 'user' 
    });
    setAuthCookie(res, token);

    return res.status(201).json({ 
      success: true, 
      user: { 
        id: data.user.id, 
        email: data.user.email,
        role: 'user'
      } 
    });
  } catch (error) {
    console.error("/api/signup error:", error);
    const message =
      process.env.NODE_ENV !== "production" && error instanceof Error
        ? error.message
        : "Sunucu hatası";
    return res.status(500).json({ success: false, message });
  }
}



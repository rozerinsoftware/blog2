import { supabase } from "../../lib/supabaseClient";
import { signAuthToken, setAuthCookie } from "../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email ve şifre gerekli" });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email: email.trim().toLowerCase(), 
      password 
    });

    if (error) {
      console.error("Login error:", error);
      
      if (error.message.includes("Invalid login credentials")) {
        return res.status(401).json({ message: "Geçersiz email veya şifre" });
      }
      
      if (error.message.includes("Email not confirmed")) {
        return res.status(401).json({ message: "Email adresinizi doğrulayın" });
      }
      
      return res.status(401).json({ message: error.message });
    }

    if (!data.user) {
      return res.status(401).json({ message: "Kullanıcı bulunamadı" });
    }

    // admin@example.com için otomatik admin rolü
    let role = data.user?.raw_user_meta_data?.role || "user";
    if (email === "admin@example.com") {
      role = "admin";
    }

    const token = signAuthToken({
      id: data.user.id,
      email: data.user.email,
      role,
    });

    setAuthCookie(res, token);

    return res.status(200).json({ user: { id: data.user.id, email: data.user.email, role } });
  } catch (err) {
    console.error("Login server error:", err);
    return res.status(500).json({ message: err.message || "Sunucu hatası" });
  }
}

import { supabase } from "../../lib/supabaseClient";
import { signAuthToken, setAuthCookie } from "../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return res.status(401).json({ message: error.message });

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
    return res.status(500).json({ message: err.message || "Sunucu hatası" });
  }
}

import { supabase } from "../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email ve şifre gereklidir" });
    }

    // Önce kullanıcıyı oluştur
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'admin'
        }
      }
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(200).json({ 
      message: "Admin kullanıcısı oluşturuldu", 
      user: { 
        id: data.user.id, 
        email: data.user.email,
        role: 'admin'
      } 
    });
  } catch (error) {
    console.error("Admin setup error:", error);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
}

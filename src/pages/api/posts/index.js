import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.status(200).json({ posts: data || [] });
    } catch (error) {
      console.error("Posts fetch error:", error);
      return res.status(500).json({ message: "Yazılar yüklenirken hata oluştu" });
    }
  }

  if (req.method === "POST") {
    try {
      const { title, description, content, cover_url, date } = req.body;

      if (!title || !description || !content) {
        return res.status(400).json({ message: "Başlık, açıklama ve içerik gereklidir" });
      }

      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title,
            description,
            content,
            cover_url: cover_url || null,
            date: date || null,
          }
        ])
        .select();

      if (error) throw error;

      return res.status(201).json({ post: data[0] });
    } catch (error) {
      console.error("Post create error:", error);
      return res.status(500).json({ message: "Yazı oluşturulurken hata oluştu" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}

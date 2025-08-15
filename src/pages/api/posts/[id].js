import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ message: "Yazı bulunamadı" });
        }
        throw error;
      }

      return res.status(200).json({ post: data });
    } catch (error) {
      console.error("Post fetch error:", error);
      return res.status(500).json({ message: "Yazı yüklenirken hata oluştu" });
    }
  }

  if (req.method === "PATCH") {
    try {
      const { title, description, content, cover_url, date } = req.body;

      if (!title || !description || !content) {
        return res.status(400).json({ message: "Başlık, açıklama ve içerik gereklidir" });
      }

      const { data, error } = await supabase
        .from('posts')
        .update({
          title,
          description,
          content,
          cover_url: cover_url || null,
          date: date || null,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ message: "Yazı bulunamadı" });
        }
        throw error;
      }

      return res.status(200).json({ post: data });
    } catch (error) {
      console.error("Post update error:", error);
      return res.status(500).json({ message: "Yazı güncellenirken hata oluştu" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ message: "Yazı bulunamadı" });
        }
        throw error;
      }

      return res.status(200).json({ message: "Yazı silindi" });
    } catch (error) {
      console.error("Post delete error:", error);
      return res.status(500).json({ message: "Yazı silinirken hata oluştu" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}

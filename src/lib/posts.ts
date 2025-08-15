import { supabase } from "./supabaseClient";

export type Post = {
  id: number;
  title: string;
  description: string;
  content: string;
  cover_url: string;
  date: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export async function getPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  return data || [];
}

export async function getPost(id: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching post:", error);
    return null;
  }

  return data;
}

export async function createPost(post: Omit<Post, "id" | "created_at" | "updated_at">): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .insert([post])
    .select()
    .single();

  if (error) {
    console.error("Error creating post:", error);
    return null;
  }

  return data;
}

export async function updatePost(id: string, post: Partial<Post>): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .update(post)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating post:", error);
    return null;
  }

  return data;
}

export async function deletePost(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting post:", error);
    return false;
  }

  return true;
}

export function formatPostsForDisplay(posts: Post[]) {
  return posts.map(({ id, title, description, date, cover_url }) => ({
    id,
    title,
    description,
    date,
    cover_url,
  }));
}



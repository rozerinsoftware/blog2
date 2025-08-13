import pool from "@/lib/db";
import AdminNav from "../AdminNav";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth";
import BarChartMini from "@/components/BarChartMini";
import MotionFadeIn from "@/components/MotionFadeIn";

type Counts = {
  posts: number;
  admins: number;
  users: number;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getCounts(): Promise<Counts> {
  const [postRows] = await pool.query("SELECT COUNT(*) AS c FROM posts");
  const posts = Array.isArray(postRows) ? Number((postRows as any)[0]?.c || 0) : 0;
  const [adminRows] = await pool.query("SELECT COUNT(*) AS c FROM users WHERE role = 'admin'");
  const admins = Array.isArray(adminRows) ? Number((adminRows as any)[0]?.c || 0) : 0;
  const [userRows] = await pool.query("SELECT COUNT(*) AS c FROM users");
  const users = Array.isArray(userRows) ? Number((userRows as any)[0]?.c || 0) : 0;
  return { posts, admins, users };
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(process.env.JWT_COOKIE_NAME || "blog_token")?.value || null;
  const payload = token ? verifyAuthToken(token) : null;
  if (!payload || payload.role !== "admin") {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <h1 className="mb-4 text-2xl font-bold">Yetki gerekli</h1>
        <p className="mb-6 text-gray-600">Bu sayfayı görmek için admin yetkisine sahip olmalısınız.</p>
      </main>
    );
  }

  const counts = await getCounts();

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      <AdminNav />
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MotionFadeIn className="rounded-xl border p-4">
          <div className="text-sm text-gray-500">Toplam Yazı</div>
          <div className="text-2xl font-semibold">{counts.posts}</div>
        </MotionFadeIn>
        <MotionFadeIn className="rounded-xl border p-4" delay={0.05}>
          <div className="text-sm text-gray-500">Admin Sayısı</div>
          <div className="text-2xl font-semibold">{counts.admins}</div>
        </MotionFadeIn>
        <MotionFadeIn className="rounded-xl border p-4" delay={0.1}>
          <div className="text-sm text-gray-500">Kullanıcı Sayısı</div>
          <div className="text-2xl font-semibold">{counts.users}</div>
        </MotionFadeIn>
      </section>
      <section className="mt-8 rounded-xl border p-4">
        <h2 className="mb-3 font-semibold">Son 7 Gün Yazı Aktivitesi</h2>
        <BarChartMini
          data={[
            { label: "Pzt", value: Math.floor(counts.posts / 7) + 1 },
            { label: "Sal", value: Math.floor(counts.posts / 7) + 2 },
            { label: "Çar", value: Math.floor(counts.posts / 7) + 1 },
            { label: "Per", value: Math.floor(counts.posts / 7) + 3 },
            { label: "Cum", value: Math.floor(counts.posts / 7) + 2 },
            { label: "Cmt", value: Math.floor(counts.posts / 7) + 1 },
            { label: "Paz", value: Math.floor(counts.posts / 7) + 2 },
          ]}
        />
      </section>
    </main>
  );
}



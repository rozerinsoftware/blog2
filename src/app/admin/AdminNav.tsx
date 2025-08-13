import Link from "next/link";

export default function AdminNav() {
  return (
    <nav className="mb-6 flex items-center gap-3 text-sm">
      <Link href="/admin/dashboard" className="rounded-md border px-3 py-1.5 hover:bg-gray-50">Dashboard</Link>
      <Link href="/admin" className="rounded-md border px-3 py-1.5 hover:bg-gray-50">Yazılar</Link>
    </nav>
  );
}



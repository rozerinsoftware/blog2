"use client";

import dynamic from "next/dynamic";

const AdminPostsPanel = dynamic(() => import("./posts-panel"), {
  ssr: false,
});

export default function AdminPostsPanelWrapper() {
  return <AdminPostsPanel />;
}

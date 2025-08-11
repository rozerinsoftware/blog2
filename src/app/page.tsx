export default function Home() {
  const blogPosts = [
    {
      id: 1,
      title: "İlk Blog Yazım",
      description: "Bu, blog projemizin ilk yazısıdır.",
      date: "2025-08-11",
    },
    {
      id: 2,
      title: "Next.js ile Proje Geliştirme",
      description: "Next.js kullanarak blog nasıl yapılır anlattım.",
      date: "2025-08-12",
    },
  ];

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Blog Yazıları</h1>
      <ul>
        {blogPosts.map((post) => (
          <li key={post.id} className="mb-4 border-b pb-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-600">{post.description}</p>
            <p className="text-sm text-gray-400">{post.date}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

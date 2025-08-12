export type PostSummary = {
  id: number;
  title: string;
  description: string;
  date: string;
  coverUrl: string;
};

export type PostDetail = PostSummary & {
  content: string[];
  highlights?: string[];
};

const posts: PostDetail[] = [
  {
    id: 1,
    title: "İlk Blog Yazım",
    description: "Bu, blog projemizin ilk yazısıdır.",
    date: "2025-08-11",
    coverUrl:
      "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1400&auto=format&fit=crop",
    content: [
      "Bu yazıda blog projemizin hedeflerini, teknolojik tercihleri ve sonraki adımları detaylı bir şekilde paylaşıyorum. Amacımız hızlı, erişilebilir ve keyifli bir okuma deneyimi sunmak.",
      "Başlangıçta basit bir veri modeli ile ilerliyoruz. Zamanla kategori, etiket ve arama gibi özellikler ekleyerek içeriği daha keşfedilebilir hale getireceğiz.",
      "Performans tarafında önceliğimiz; statik ön-oluşturma, resim optimizasyonu ve tarayıcı önbelleğinin verimli kullanımı olacak.",
    ],
    highlights: [
      "Next.js 15 App Router ile dosya-tabanlı yönlendirme",
      "TypeScript ile güçlü tip güvenliği",
      "TailwindCSS ile hızlı ve tutarlı stil geliştirme",
      "Next/Image ile otomatik görsel optimizasyonu",
    ],
  },
  {
    id: 2,
    title: "Next.js ile Proje Geliştirme",
    description: "Next.js kullanarak blog nasıl yapılır anlattım.",
    date: "2025-08-12",
    coverUrl:
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1400&auto=format&fit=crop",
    content: [
      "Bu yazıda Next.js ile sayfa yapısı, dinamik rotalar ve metadata üretimi gibi konulara daha derinlemesine bakıyoruz. App Router'ın sunduğu yeni sözleşmeler projeyi ölçeklenebilir kılıyor.",
      "Dinamik segmentler (örn. [id]) sayesinde tek bir şablonla çok sayıda içeriği kolayca oluşturabiliyoruz. Ayrıca `generateStaticParams` ile ön-oluşturma yaparak performansı artırıyoruz.",
      "Geliştirme deneyimini iyileştirmek için dosya organizasyonu, tip tanımları ve yeniden kullanılabilir bileşenler üzerine odaklanacağız.",
    ],
    highlights: [
      "`generateMetadata` ile SEO uyumlu başlık/açıklama",
      "ISR stratejisi ile hızlı yayınlama",
      "Daha iyi UX için tutarlı tipografi ve boşluk kullanımı",
    ],
  },
];

export function listPostSummaries(): PostSummary[] {
  return posts.map(({ id, title, description, date, coverUrl }) => ({
    id,
    title,
    description,
    date,
    coverUrl,
  }));
}

export function getPostById(idParam: string | number): PostDetail | undefined {
  return posts.find((post) => String(post.id) === String(idParam));
}

export function listStaticParams() {
  return posts.map((post) => ({ id: String(post.id) }));
}



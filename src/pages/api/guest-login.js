import { signAuthToken, setAuthCookie } from "../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Misafir kullanıcı için rastgele ID oluştur
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Misafir kullanıcı için JWT token oluştur
    const token = signAuthToken({
      id: guestId,
      email: `guest_${guestId}@example.com`,
      role: 'guest'
    });

    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      user: {
        id: guestId,
        email: `guest_${guestId}@example.com`,
        role: 'guest'
      }
    });
  } catch (error) {
    console.error("Guest login error:", error);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
}

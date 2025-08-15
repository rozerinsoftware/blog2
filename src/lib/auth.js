import jwt from "jsonwebtoken";
import { serialize, parse } from "cookie";

const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || "blog_token";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"; // örn. 7d, 12h

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  // Development fallback to avoid 500s if env is missing
  if (process.env.NODE_ENV !== "production") {
    console.warn("[auth] JWT_SECRET bulunamadı, geliştirme için geçici bir anahtar kullanılıyor. .env.local dosyasını oluşturun.");
    return "dev_secret_change_me";
  }
  throw new Error("JWT_SECRET env değişkeni tanımlı değil");
}

export function signAuthToken(payload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
}

export function verifyAuthToken(token) {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch {
    return null;
  }
}

export function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";
  const serialized = serialize(JWT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    // MaxAge: jwt expires ile paralel olması için yaklaşık 7 gün
    maxAge: 60 * 60 * 24 * 7,
  });
  res.setHeader("Set-Cookie", serialized);
}

export function clearAuthCookie(res) {
  const isProd = process.env.NODE_ENV === "production";
  const serialized = serialize(JWT_COOKIE_NAME, "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
  res.setHeader("Set-Cookie", serialized);
}

export function getTokenFromRequest(req) {
  const header = req.headers?.cookie;
  if (!header) return null;
  const parsed = parse(header);
  return parsed[JWT_COOKIE_NAME] || null;
}



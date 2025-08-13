import cookie from "cookie";

const GUEST_ID_COOKIE = "guest_id";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const header = req.headers?.cookie || "";
  const parsed = cookie.parse(header);
  let guestId = parsed[GUEST_ID_COOKIE] ? Number(parsed[GUEST_ID_COOKIE]) : null;
  if (!guestId || guestId < 1 || guestId > 4) {
    guestId = Math.floor(Math.random() * 4) + 1;
    res.setHeader(
      "Set-Cookie",
      cookie.serialize(GUEST_ID_COOKIE, String(guestId), {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
    );
  }

  return res.status(200).json({ success: true, guestId });
}



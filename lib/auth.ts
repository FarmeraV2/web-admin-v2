import { getIronSession, IronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData } from "./types";
import { COOKIE_NAME } from "./constants";

const sessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: COOKIE_NAME,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function setSession(data: SessionData): Promise<void> {
  const session = await getSession();
  session.accessToken = data.accessToken;
  session.role = data.role;
  session.userId = data.userId;
  session.email = data.email;
  await session.save();
}

export async function clearSession(): Promise<void> {
  const session = await getSession();
  session.destroy();
}

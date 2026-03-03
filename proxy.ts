import { NextRequest, NextResponse } from "next/server";
import { unsealData } from "iron-session";
import { SessionData } from "@/lib/types";
import { COOKIE_NAME } from "@/lib/constants";

const SESSION_SECRET = process.env.SESSION_SECRET as string;

// Routes that don't require authentication
const PUBLIC_PATHS = ["/login"];

// Routes only accessible to ADMIN
const ADMIN_PATHS = [
  "/dashboard",
  "/users",
  "/farms",
  "/certificates",
  "/products",
  "/orders",
  "/auditors",
  "/config",
  "/notifications",
];

// Routes only accessible to AUDITOR
const AUDITOR_PATHS = ["/verification"];

async function getSessionFromRequest(req: NextRequest): Promise<SessionData | null> {
  const cookieValue = req.cookies.get(COOKIE_NAME)?.value;
  if (!cookieValue) return null;

  try {
    const session = await unsealData<SessionData>(cookieValue, {
      password: SESSION_SECRET,
    });
    return session.accessToken ? session : null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const session = await getSessionFromRequest(request);
  const isAuthenticated = !!session;

  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = session.role;

  // AUDITOR visiting ADMIN routes → redirect to /verification
  if (role === "AUDITOR" && ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/verification", request.url));
  }

  // ADMIN visiting AUDITOR routes → redirect to /dashboard
  if (role === "ADMIN" && AUDITOR_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Root redirect by role
  if (pathname === "/") {
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (role === "AUDITOR") {
      return NextResponse.redirect(new URL("/verification", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

"use server";

import { redirect } from "next/navigation";
import { setSession, clearSession } from "@/lib/auth";
import { JWTPayload } from "@/lib/types";
import { API_URL } from "@/lib/constants";

function decodeJWT(token: string): JWTPayload | null {
  try {
    const payload = token.split(".")[1];
    const decoded = Buffer.from(payload, "base64url").toString("utf-8");
    return JSON.parse(decoded) as JWTPayload;
  } catch {
    return null;
  }
}

export async function loginAction(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  let accessToken: string;

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { error: body.message ?? "Invalid credentials." };
    }

    // Response shape: { statusCode, message, data: { access_token, refresh_token, user } }
    const body = await res.json();
    accessToken = body?.data?.access_token;
    if (!accessToken) {
      return { error: "Invalid response from server." };
    }
  } catch {
    return { error: "Could not reach the server. Please try again." };
  }

  const payload = decodeJWT(accessToken);
  if (!payload) {
    return { error: "Invalid token received from server." };
  }

  const role = payload.role;

  if (role !== "ADMIN" && role !== "AUDITOR") {
    return { error: "Access denied. Admin or Auditor accounts only." };
  }

  await setSession({
    accessToken,
    role,
    userId: payload.uuid,
    email: payload.email,
  });

  if (role === "ADMIN") {
    redirect("/dashboard");
  } else {
    redirect("/verification");
  }
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/login");
}

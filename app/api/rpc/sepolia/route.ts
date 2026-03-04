import { NextRequest, NextResponse } from "next/server";

const RPC_URL = process.env.SEPOLIA_RPC_URL;

export async function POST(req: NextRequest) {
  if (!RPC_URL) {
    return NextResponse.json({ error: "RPC not configured" }, { status: 500 });
  }

  const body = await req.text();
  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

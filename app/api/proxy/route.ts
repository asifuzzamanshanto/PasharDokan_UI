import { NextResponse } from "next/server";

const API_BASE = "https://pashardokan-api.onrender.com";

export async function POST(request: Request) {
  const { pathname } = new URL(request.url);
  const endpoint = pathname.replace("/api/proxy", "");
  
  const body = await request.json();
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return NextResponse.json(await response.json(), { status: response.status });
}

export async function GET(request: Request) {
  const { pathname, search } = new URL(request.url);
  const endpoint = pathname.replace("/api/proxy", "") + search;
  
  const response = await fetch(`${API_BASE}${endpoint}`);
  return NextResponse.json(await response.json(), { status: response.status });
}

export async function PUT(request: Request) {
  const { pathname } = new URL(request.url);
  const endpoint = pathname.replace("/api/proxy", "");
  
  const body = await request.json();
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return NextResponse.json(await response.json(), { status: response.status });
}

export async function DELETE(request: Request) {
  const { pathname } = new URL(request.url);
  const endpoint = pathname.replace("/api/proxy", "");
  
  const response = await fetch(`${API_BASE}${endpoint}`, { method: "DELETE" });
  return NextResponse.json(await response.json(), { status: response.status });
}

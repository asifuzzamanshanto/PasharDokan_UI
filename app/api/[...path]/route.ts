import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://pashardokan-api.onrender.com/api";

export async function POST(request: Request) {
  const { pathname } = new URL(request.url);
  const endpoint = pathname;
  
  const body = await request.json();
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function GET(request: Request) {
  const { pathname, search } = new URL(request.url);
  const endpoint = pathname + search;
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function PUT(request: Request) {
  const { pathname } = new URL(request.url);
  const endpoint = pathname;
  
  const body = await request.json();
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(request: Request) {
  const { pathname } = new URL(request.url);
  const endpoint = pathname;
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

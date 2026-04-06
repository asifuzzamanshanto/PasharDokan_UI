import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://pashardokan-api.onrender.com";

export async function POST(request: Request) {
  const { pathname } = new URL(request.url);
  const endpoint = pathname;
  
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
  
  console.log(`[API Proxy] POST ${endpoint}`, body);
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  console.log(`[API Proxy] Response:`, response.status, data);
  return NextResponse.json(data, { status: response.status });
}

export async function GET(request: Request) {
  const { pathname, search } = new URL(request.url);
  const endpoint = pathname + search;
  
  console.log(`[API Proxy] GET ${endpoint}`);
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  console.log(`[API Proxy] Response:`, response.status, data);
  return NextResponse.json(data, { status: response.status });
}

export async function PUT(request: Request) {
  const { pathname } = new URL(request.url);
  const endpoint = pathname;
  
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
  
  console.log(`[API Proxy] PUT ${endpoint}`, body);
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  console.log(`[API Proxy] Response:`, response.status, data);
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(request: Request) {
  const { pathname } = new URL(request.url);
  const endpoint = pathname;
  
  console.log(`[API Proxy] DELETE ${endpoint}`);
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  console.log(`[API Proxy] Response:`, response.status, data);
  return NextResponse.json(data, { status: response.status });
}

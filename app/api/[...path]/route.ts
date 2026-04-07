import { NextResponse } from "next/server";

const API_BASE = "https://pashardokan-api.onrender.com";

export async function POST(request: Request) {
  const { pathname } = new URL(request.url);
  const endpoint = pathname;
  
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }
  
  let response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.error("Proxy fetch error:", error);
    return NextResponse.json({ message: "Backend unavailable" }, { status: 502 });
  }

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function GET(request: Request) {
  const { pathname, search } = new URL(request.url);
  const endpoint = pathname + search;
  
  let response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`);
  } catch (error) {
    console.error("Proxy fetch error:", error);
    return NextResponse.json({ message: "Backend unavailable" }, { status: 502 });
  }
  
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function PUT(request: Request) {
  const { pathname } = new URL(request.url);
  const endpoint = pathname;
  
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }
  
  let response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.error("Proxy fetch error:", error);
    return NextResponse.json({ message: "Backend unavailable" }, { status: 502 });
  }

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(request: Request) {
  const { pathname } = new URL(request.url);
  const endpoint = pathname;
  
  let response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, { method: "DELETE" });
  } catch (error) {
    console.error("Proxy fetch error:", error);
    return NextResponse.json({ message: "Backend unavailable" }, { status: 502 });
  }
  
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

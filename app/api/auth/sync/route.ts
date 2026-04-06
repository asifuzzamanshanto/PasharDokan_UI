import { NextResponse } from "next/server";

export async function POST() {
  const session = typeof window !== "undefined" ? localStorage.getItem("pashar_dokan_session") : null;
  
  const response = NextResponse.json({ success: true });
  
  if (session) {
    response.cookies.set("pashar_dokan_session", session, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
  }
  
  return response;
}
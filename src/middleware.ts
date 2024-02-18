import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "./actions/auth";

export async function middleware(request: NextRequest) {
  if (!isAuthenticated()) {
    const absoluteURL = new URL("/", request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}

export const config = {
  matcher: [],
};

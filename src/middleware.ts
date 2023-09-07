import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { verifyJWT } from "./lib/auth";
import { User, userRepo } from "./schema/users";
import getCorrectPath from "./lib/getCorrectPath";

export async function middleware(req: NextRequest) {
  if (!req.cookies.has("jwtToken")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const token = req.cookies.get("jwtToken");
    const tokenData = await verifyJWT(token?.value!);

    if (!tokenData.success) return NextResponse.redirect(new URL("/", req.url));

    const res = await fetch(`http://${req.nextUrl.host}/api/user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: tokenData.userId,
        groupNum: tokenData.groupNum,
      }),
    });

    if (!req.nextUrl.pathname.startsWith("/api")) {
      const { st }: User = (await res.json()).user;
      const correctPath = getCorrectPath(req.nextUrl.pathname, st);

      if (correctPath !== req.nextUrl.pathname) {
        return NextResponse.redirect(new URL(correctPath, req.url));
      }
    }
  } catch (e) {
    console.error(e);
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/survey", "/level/:path*", "/feedback", "/results", "/api/:path*"],
};

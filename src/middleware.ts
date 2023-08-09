import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { verifyJWT } from "./lib/auth";

export async function middleware(req: NextRequest) {
  if (!req.cookies.has("jwtToken"))
    return NextResponse.redirect(new URL("/", req.url));

  try {
    const token = req.cookies.get("jwtToken");
    const userData = await verifyJWT(token?.value!);

    if (!userData.success) return NextResponse.redirect(new URL("/", req.url));

    await fetch(`${process.env.BASE_URL}/api/check-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userData.userId,
        groupNum: userData.groupNum,
      }),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/survey", "/level/:path*"],
};

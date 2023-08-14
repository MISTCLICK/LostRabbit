import { promises as fs } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth";
import { type User, userRepo } from "@/schema/users";

interface LevelReqParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: LevelReqParams) {
  const data = JSON.parse(
    await fs.readFile(`${process.cwd()}/public/maps/${params.id}.json`, "utf8")
  );

  return NextResponse.json({ success: true, level: data });
}

export async function POST(request: NextRequest) {
  try {
    if (!request.cookies.has("jwtToken")) {
      return NextResponse.json(
        { success: false, message: "401 Unauthorized" },
        { status: 401 }
      );
    }

    const req = await request.json();
    const { success, userId } = await verifyJWT(
      request.cookies.get("jwtToken")!.value
    );

    if (!success || !req.currentTime) {
      return NextResponse.json(
        { success: false, message: "400 Bad Request" },
        { status: 400 }
      );
    }

    //@ts-expect-error
    const user: User = await userRepo.fetch(userId);
    user.mazeResults.push(req.currentTime);

    await userRepo.save(user);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: "500 Internal Server Error" },
      { status: 500 }
    );
  }
}

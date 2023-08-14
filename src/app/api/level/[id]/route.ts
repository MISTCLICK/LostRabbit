import { promises as fs } from "fs";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest, { params }: LevelReqParams) {
  if (!request.cookies.has("jwtToken"))
    return NextResponse.json(
      { success: false, message: "401 Unauthorized" },
      { status: 401 }
    );

  return NextResponse.json({ success: true });
}

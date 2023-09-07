import redis from "@/lib/redis";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await redis.ping(), {
    status: 200,
  });
}

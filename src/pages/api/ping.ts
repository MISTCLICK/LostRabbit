import type { NextApiRequest, NextApiResponse } from "next";
import redis from "@/lib/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).send(await redis.ping());
}

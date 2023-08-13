import redis from "@/lib/redis";
import { userRepo } from "@/schema/users";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.body.userId || !req.body.groupNum || req.method !== "POST") {
    return res.status(400).json({ success: false, message: "400 Bad Request" });
  }

  try {
    if (!(await redis.exists(`user:${req.body.userId}`))) {
      await userRepo.save(req.body.userId, {
        userId: req.body.userId,
        groupNum: req.body.groupNum,
        mazeResults: [],
        surveyAnswers: "",
        feedbackAnswers: "",
        iss: Date.now(),
      });
    }

    res.status(200).json({ success: true });
  } catch {
    console.log("test");
    res.status(500).json({ success: false });
  }
}

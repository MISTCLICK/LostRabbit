import redis from "@/lib/redis";
import { userRepo } from "@/schema/users";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

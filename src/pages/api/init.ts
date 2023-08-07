import { setCookie } from "@/app/utils/cookies";
import { genUserToken, verifyJWT } from "@/lib/auth";
import redis from "@/lib/redis";
import { userRepo } from "@/schema/users";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.cookies.jwtToken) {
      const currentToken = req.cookies.jwtToken;
      const { success, groupName, groupNum, userId } = await verifyJWT(
        currentToken ?? " "
      );
      if (success) {
        setCookie(res, "jwtToken", currentToken, { maxAge: 86400 });

        res.status(200).json({ success, groupName, groupNum, userId });
        if (!(await redis.exists(`user:${userId}`))) {
          userRepo.save(userId, {
            userId,
            groupNum,
            mazeResults: [],
            questionAnswers: [],
          });
        }
      }
    } else {
      const { token, groupName, groupNum, userId } = await genUserToken(
        uuidv4()
      );
      setCookie(res, "jwtToken", token, { maxAge: 86400 });
      res.status(200).json({ success: true, groupName, groupNum, userId });
      userRepo.save(userId, {
        userId,
        groupNum,
        mazeResults: [],
        questionAnswers: [],
      });
    }
  } catch {
    res.status(500).json({ succes: false });
  }
}

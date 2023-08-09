import { SurveyAnswers } from "@/app/types/types";
import { verifyJWT } from "@/lib/auth";
import { userRepo } from "@/schema/users";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const answers: SurveyAnswers = req.body.answers;
  const token = req.cookies.jwtToken!;

  try {
    const userData = await verifyJWT(token);

    if (!userData.success) return res.status(500).json({ success: false });

    const user = await userRepo.fetch(userData.userId);
    user.surveyAnswers = JSON.stringify(answers);

    await userRepo.save(user);

    res.status(200).json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
}

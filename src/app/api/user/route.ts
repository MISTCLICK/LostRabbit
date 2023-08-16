import { NextRequest, NextResponse } from "next/server";
import { userRepo } from "@/schema/users";
import redis from "@/lib/redis";

export async function PATCH(request: NextRequest) {
  const req = await request.json();

  if (!req.userId || typeof req.groupNum !== "number") {
    return NextResponse.json(
      {
        success: false,
        message: "400 Bad Request",
      },
      { status: 400 }
    );
  }

  try {
    if (!(await redis.exists(`user:${req.userId}`))) {
      await userRepo.save(req.userId, {
        userId: req.userId,
        groupNum: req.groupNum,
        mazeResults: [],
        surveyAnswers: "",
        feedbackAnswers: "",
        iss: Date.now(),
        st: "default",
      });
    }

    return NextResponse.json(
      {
        success: true,
        user: await userRepo.fetch(req.userId),
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "500 Internal Server Error" },
      { status: 500 }
    );
  }
}

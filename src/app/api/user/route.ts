import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { userRepo } from "@/schema/users";
import { genUserToken, verifyJWT } from "@/lib/auth";
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
      });
    }

    return NextResponse.json(
      {
        success: true,
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

export async function POST(request: NextRequest) {
  if (request.cookies.has("jwtToken")) {
    const currentToken = request.cookies.get("jwtToken")!.value;
    const { success, groupName, groupNum, userId } = await verifyJWT(
      currentToken
    );

    if (success) {
      if (!(await redis.exists(`user:${userId}`))) {
        userRepo.save(userId, {
          userId,
          groupNum,
          mazeResults: [],
          surveyAnswers: "",
          feedbackAnswers: "",
          iss: Date.now(),
        });
      }

      const initData = {
        success: true,
        groupName,
        groupNum,
        userId,
      };

      return NextResponse.json(initData, {
        status: 200,
        headers: {
          "Set-Cookie": `jwtToken=${currentToken}`,
        },
      });
    }
  }

  const { token, groupName, groupNum, userId } = await genUserToken(uuidv4());
  userRepo.save(userId, {
    userId,
    groupNum,
    mazeResults: [],
    surveyAnswers: "",
    feedbackAnswers: "",
    iss: Date.now(),
  });

  const initData = {
    success: true,
    groupName,
    groupNum,
    userId,
  };

  return NextResponse.json(initData, {
    status: 200,
    headers: {
      "Set-Cookie": `jwtToken=${token}; Max-Age=${86400 * 7}`,
    },
  });
}

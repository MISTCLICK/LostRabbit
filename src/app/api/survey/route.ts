import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SurveyAnswers } from "@/app/types/types";
import { verifyJWT } from "@/lib/auth";
import { userRepo } from "@/schema/users";

export async function POST(request: NextRequest) {
  const req = await request.json();
  const cookieStore = cookies();

  const answers: SurveyAnswers = req.answers;
  const type: "feedback" | "survey" = req.type;
  const token = cookieStore.get("jwtToken")?.value;

  if (!answers || !token || !type) {
    return NextResponse.json(
      {
        success: false,
        message: "400 Bad Request",
      },
      { status: 400 }
    );
  }

  try {
    const userData = await verifyJWT(token);

    if (!userData.success)
      return NextResponse.json(
        { success: false, message: "400 Bad Request" },
        { status: 400 }
      );

    const user = await userRepo.fetch(userData.userId);
    if (type === "survey") {
      user.surveyAnswers = JSON.stringify(answers);
      user.st = "/level/1";
    } else {
      user.feedbackAnswers = JSON.stringify(answers);
      user.st = "/results";
    }
    await userRepo.save(user);

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

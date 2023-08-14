import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SurveyAnswers } from "@/app/types/types";
import { verifyJWT } from "@/lib/auth";
import { userRepo } from "@/schema/users";

export async function POST(request: NextRequest) {
  const req = await request.json();
  const cookieStore = cookies();

  const answers: SurveyAnswers = req.answers;
  const token = cookieStore.get("jwtToken")?.value;

  if (!answers || !token) {
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
    user.surveyAnswers = JSON.stringify(answers);

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

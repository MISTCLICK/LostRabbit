import { cookies } from "next/headers";
import NotFound from "../not-found";
import Nav from "@/components/nav";
import DataTable from "@/components/resultsTable";
import FinalCard from "@/components/finalCard";
import { User, userRepo } from "@/schema/users";
import { verifyJWT } from "@/lib/auth";
import formatTime from "@/lib/formatTime";
import "@/styles/results.scss";

async function getUserData() {
  try {
    const tokenData = await verifyJWT(cookies().get("jwtToken")!.value);

    //@ts-expect-error
    const userData: User = await userRepo.fetch(tokenData.userId!);

    userData.surveyAnswers = JSON.parse(userData.surveyAnswers);
    userData.feedbackAnswers = JSON.parse(userData.feedbackAnswers);

    //@ts-expect-error
    delete userData.st;

    return { ...userData };
  } catch {
    return null;
  }
}

export default async function ResultsPage() {
  const userData = await getUserData();

  if (userData === null) return <NotFound />;

  const tableData = {
    columns: ["Līmenis", "Laiks"],
    data: userData.mazeResults.map((val, idx) => [
      `${idx + 1}.`,
      val !== 0 ? formatTime(val) : "Līmenis netika pabeigts",
    ]),
  };

  return (
    <main>
      <Nav activeStep={3} />
      <div className="resultsPageFlexBox">
        <DataTable
          title="Jūsu labirintu spēles rezultāti"
          tableData={tableData}
          titleImage="/images/rubb.png"
        />
        <FinalCard userData={userData} />
      </div>
    </main>
  );
}

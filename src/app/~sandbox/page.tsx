import { cookies } from "next/headers";
import { promises as fs } from "fs";
import FrameSandbox from "@/components/frameSandbox";
import { verifyJWT } from "@/lib/auth";
import { User, userRepo } from "@/schema/users";
// import "@/styles/globals.scss";
import "@/styles/level.scss";

async function getLevel() {
  try {
    const data = JSON.parse(
      await fs.readFile(`${process.cwd()}/public/maps/_7.json`, "utf8")
    );

    const tokenData = await verifyJWT(cookies().get("jwtToken")!.value);
    //@ts-expect-error
    const userData: User = await userRepo.fetch(tokenData.userId!);

    return {
      level: data,
      levelNum: "1",
      groupNum: tokenData.groupNum!,
      st: userData.st,
    };
  } catch {
    return {
      level: { divisions: 0 },
      levelNum: "1",
      groupNum: -1,
      st: "default",
    };
  }
}

export default async function SandBoxPage() {
  const { level } = await getLevel();

  if (level.divisions === 0) throw "ERROR LOADING LEVEL.";

  return (
    <main>
      <FrameSandbox level={level} />
    </main>
  );
}

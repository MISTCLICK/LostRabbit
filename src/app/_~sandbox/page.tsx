import { cookies } from "next/headers";
import { promises as fs } from "fs";
import FrameSandbox from "@/components/frameSandbox";
import { verifyJWT } from "@/lib/auth";
import { User, userRepo } from "@/schema/users";
import Maze from "@/logic/Maze";
import Point from "@/logic/Point";
// import "@/styles/globals.scss";
import "@/styles/level.scss";
// import { QBrain } from "@/logic/Brain";

//! DEPRECATED STATIC LEVEL LOADING;
async function getLevel() {
  try {
    const data = JSON.parse(
      await fs.readFile(`${process.cwd()}/level_backup/_10.json`, "utf8")
    );

    const tokenData = await verifyJWT(cookies().get("jwtToken")!.value);
    //@ts-expect-error
    const userData: User = await userRepo.fetch(tokenData.userId!);

    return {
      level: data,
      levelNum: "10",
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

  // const maze = new Maze({
  //   size: new Point(10, 10),
  //   start: new Point(0, 0),
  //   // targetPosition: new Point(19, 10),
  // });

  return (
    <main>
      <FrameSandbox level={level} />
    </main>
  );
}

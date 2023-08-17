import { cookies } from "next/headers";
import { promises as fs } from "fs";
import Nav from "@/components/nav";
import LevelGroup from "@/components/levelGroup";
import NotFound from "@/app/not-found";
import { User, userRepo } from "@/schema/users";
import { verifyJWT } from "@/lib/auth";
import { Level } from "@/app/types/types";
import "@/styles/globals.scss";
import "@/styles/level.scss";

interface LevelPageParams {
  id: string;
}

interface LevelPageProps {
  params: LevelPageParams;
}

export async function generateStaticParams() {
  const levels = await fs.readdir(`${process.cwd()}/public/maps/`);

  return levels.map((fileName) => ({ id: fileName.charAt(0) }));
}

async function getLevel(params: LevelPageParams) {
  try {
    const data = JSON.parse(
      await fs.readFile(
        `${process.cwd()}/public/maps/${params.id}.json`,
        "utf8"
      )
    );

    const tokenData = await verifyJWT(cookies().get("jwtToken")!.value);
    //@ts-expect-error
    const userData: User = await userRepo.fetch(tokenData.userId!);

    return {
      level: data,
      levelNum: params.id,
      groupNum: tokenData.groupNum!,
      st: userData.st,
    };
  } catch {
    return {
      level: { divisions: 0 },
      levelNum: params.id,
      groupNum: -1,
      st: "default",
    };
  }
}

export default async function Level({ params }: LevelPageProps) {
  const { level, levelNum, groupNum, st } = await getLevel(params);

  if (level.divisions === 0) return <NotFound />;

  return (
    <main>
      <div className="levelFlexBox">
        <Nav activeStep={1} />
        <div className="frameFlexBox">
          <LevelGroup
            level={level}
            levelNum={levelNum}
            groupNum={groupNum}
            st={st}
          />
        </div>
      </div>
    </main>
  );
}

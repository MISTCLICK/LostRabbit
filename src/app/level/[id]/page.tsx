import { cookies } from "next/headers";
import Nav from "@/components/nav";
import LevelGroup from "@/components/levelGroup";
import { User, userRepo } from "@/schema/users";
import { verifyJWT } from "@/lib/auth";
import Maze from "@/logic/Maze";
import Point from "@/logic/Point";
import { maps } from "./maps.json";
import "@/styles/frame.scss";
import "@/styles/level.scss";

export const dynamic = "force-dynamic";

interface LevelPageParams {
  id: string;
}

interface LevelPageProps {
  params: LevelPageParams;
}

interface LevelData {
  start: number[];
  finish: number[];
  size: number[];
  divisions: number;
}

export async function generateStaticParams() {
  return maps.map((_level, idx) => ({ id: idx.toString() }));
}

export default async function Level({ params }: LevelPageProps) {
  const maze = new Maze({
    size: new Point(
      maps[parseInt(params.id) - 1].size[0],
      maps[parseInt(params.id) - 1].size[1]
    ),
    start: new Point(
      maps[parseInt(params.id) - 1].start[0],
      maps[parseInt(params.id) - 1].start[1]
    ),
    targetPosition: new Point(
      maps[parseInt(params.id) - 1].finish[0],
      maps[parseInt(params.id) - 1].finish[1]
    ),
  });

  const level = maze.generate();

  const tokenData = await verifyJWT(cookies().get("jwtToken")!.value);
  //@ts-expect-error
  const userData: User = await userRepo.fetch(tokenData.userId!);

  return (
    <main>
      <div className="levelFlexBox">
        <Nav activeStep={1} />
        <div className="frameFlexBox">
          <LevelGroup
            level={level}
            levelNum={params.id}
            groupNum={tokenData.groupNum!}
          />
        </div>
      </div>
    </main>
  );
}

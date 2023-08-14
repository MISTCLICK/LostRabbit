import { promises as fs } from "fs";
import Nav from "@/components/nav";
import LevelGroup from "@/components/levelGroup";
import NotFound from "@/app/not-found";
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
  const levels = await fs.readdir("@../../public/maps/");

  return levels.map((fileName) => ({ id: fileName.charAt(0) }));
}

async function getLevel(params: LevelPageParams) {
  try {
    const data = JSON.parse(
      await fs.readFile(`@../../public/maps/${params.id}.json`, "utf8")
    );

    return { level: data, levelNum: params.id };
  } catch {
    return { level: { divisions: 0 }, levelNum: params.id };
  }
}

export default async function Level({ params }: LevelPageProps) {
  const { level, levelNum } = await getLevel(params);

  if (level.divisions === 0) return <NotFound />;

  return (
    <main>
      <div className="levelFlexBox">
        <Nav activeStep={1} />
        <div className="frameFlexBox">
          <LevelGroup level={level} levelNum={levelNum} />
        </div>
      </div>
    </main>
  );
}

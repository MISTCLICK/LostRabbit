import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";
import { promises as fs } from "fs";
import Nav from "@/components/nav";
import Frame from "@/components/frame";
import LevelInfoCard from "@/components/levelInfoCard";
import NotFound from "@/app/not-found";
import { Level } from "@/app/types/types";
import "@/app/globals.css";
import "@/styles/level.scss";

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<{
  level: Level;
  levelNum?: string | string[];
}> = async (ctx) => {
  try {
    const data = JSON.parse(
      await fs.readFile(`@../../public/maps/${ctx.params!.id}.json`, "utf8")
    );

    return { props: { level: data, levelNum: ctx.params!.id } };
  } catch {
    return { props: { level: { divisions: 0 }, levelNum: ctx.params!.id } };
  }
};

export default function Level({
  level,
  levelNum,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (level.divisions === 0) return <NotFound />;

  return (
    <main>
      <div className="levelFlexBox">
        <Nav activeStep={1} />
        <div className="frameFlexBox">
          <LevelInfoCard className="" levelNum={levelNum} />
          <Frame level={level} width={700} height={700} />
        </div>
      </div>
    </main>
  );
}

import Image from "next/image";
import localFont from "next/font/local";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Montserrat } from "next/font/google";
import Divider from "@mui/material/Divider";
import { setCookie } from "nookies";
import { v4 as uuidv4 } from "uuid";
import redis from "@/lib/redis";
import Terms from "@/components/terms";
import StartButton from "@/components/startBtn";
import { genUserToken, verifyJWT } from "@/lib/auth";
import { InitData } from "@/app/types/types";
import { userRepo } from "@/schema/users";
import Rubb from "@/../../public/rubb.png";
import "@/app/globals.css";
import "@/styles/index.scss";

const neon = localFont({
  src: "../../public/fonts/neon.ttf",
});

const montserrat = Montserrat({ subsets: ["latin"], weight: "400" });

export const getServerSideProps: GetServerSideProps<InitData> = async (ctx) => {
  if (ctx.req.cookies.jwtToken) {
    const currentToken = ctx.req.cookies.jwtToken;
    const { success, groupName, groupNum, userId } = await verifyJWT(
      currentToken ?? " "
    );

    if (success) {
      setCookie(ctx, "jwtToken", currentToken, { maxAge: 86400 * 7 });

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

      const initData: InitData = {
        success: true,
        groupName,
        groupNum,
        userId,
      };

      return { props: initData };
    }
  }

  const { token, groupName, groupNum, userId } = await genUserToken(uuidv4());
  setCookie(ctx, "jwtToken", token, { maxAge: 86400 * 7 });
  userRepo.save(userId, {
    userId,
    groupNum,
    mazeResults: [],
    surveyAnswers: "",
    feedbackAnswers: "",
    iss: Date.now(),
  });

  const initData: InitData = {
    success: true,
    groupName,
    groupNum,
    userId,
  };

  return { props: initData };
};

export default function Main({
  groupName,
  userId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main>
      <div className="mainBox">
        <Image src={Rubb} alt="Logo" width={500} height={500} />
        <Divider orientation="vertical" />
        <div className="descriptionBox">
          <div className={`title ${neon.className}`}>THE LOST RABBIT</div>
          <div className={`description ${montserrat.className}`}>
            Laipni lūgti Rīgas 80. vidusskolas 12.b klases pētnieciskā darba
            eksperimentā programmēšanas jomā. Jūs esat <b>{groupName}</b>{" "}
            eksperimenta grupā. Jūsu individuālais dalībnieka numurs ir{" "}
            <b>{userId}</b>.<br></br> Piedaloties experimentā, Jums jāseko
            dažiem nosacījumiem:
            <div className="ruleList">
              <li>
                Eksperimenta laikā nedrīkst sazināties ar citiem dalībniekiem.
              </li>
              <li>
                Eksperimenta laikā nedrīkst atklāt citiem dalībniekiem savu
                grupas numuru vai individuālo dalībnieka numuru.
              </li>
              <li>
                Eksperimenta laikā jāatbild uz visiem jautājumiem taisnīgi.
              </li>
            </div>
            Šis eksperiments sastāv no aptaujas un labirinta spēles. <br></br>{" "}
            Piedaloties eksperimentā, Jūs piekrītat <Terms />
          </div>
          <StartButton />
        </div>
      </div>
    </main>
  );
}

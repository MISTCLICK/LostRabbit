import Image from "next/image";
import { cookies } from "next/headers";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import Divider from "@mui/material/Divider";
import { v4 as uuidv4 } from "uuid";
import Terms from "@/components/terms";
import StartButton from "@/components/startBtn";
import { userRepo } from "@/schema/users";
import { genUserToken, verifyJWT } from "@/lib/auth";
import redis from "@/lib/redis";
import "@/styles/globals.scss";
import "@/styles/index.scss";

const neon = localFont({
  src: "./neon.ttf",
});

const montserrat = Montserrat({ subsets: ["latin-ext"], weight: "400" });

async function getUserData() {
  const cookieStore = cookies();

  if (cookieStore.get("jwtToken")) {
    const currentToken = cookieStore.get("jwtToken")!.value;
    const { success, groupName, groupNum, userId } = await verifyJWT(
      currentToken
    );

    if (success) {
      const inDb = await redis.exists(`user:${userId}`);

      if (!inDb) {
        await userRepo.save(userId, {
          userId,
          groupNum,
          mazeResults: new Array(20).fill(0),
          surveyAnswers: "",
          feedbackAnswers: "",
          iss: Date.now(),
          st: "default",
        });
      }

      const initData = {
        success: true,
        groupName,
        groupNum,
        userId,
        token: currentToken,
        st: inDb ? (await userRepo.fetch(userId)).st : "default",
      };

      return initData;
    }
  }

  const { token, groupName, groupNum, userId } = await genUserToken(uuidv4());
  await userRepo.save(userId, {
    userId,
    groupNum,
    mazeResults: new Array(20).fill(0),
    surveyAnswers: "",
    feedbackAnswers: "",
    iss: Date.now(),
    st: "default",
  });

  const initData = {
    success: true,
    groupName,
    groupNum,
    userId,
    token,
    st: "default",
  };

  return initData;
}

export default async function Main() {
  const { userId, groupName, token, st } = await getUserData();

  return (
    <main>
      <div className="mainBox">
        <Image
          src="/images/rubb.png"
          alt="Logo"
          width={500}
          height={500}
          priority
          placeholder="empty"
        />
        <Divider orientation="vertical" />
        <div className="descriptionBox">
          <div className={`title ${neon.className}`}>THE LOST RABBIT</div>
          <div className={`description ${montserrat.className}`}>
            Laipni lūgti Rīgas 80. vidusskolas 12.b klases pētnieciskā darba
            eksperimentā programmēšanas jomā. Jūs esat <b>{groupName}</b>{" "}
            eksperimenta grupā. Jūsu individuālais dalībnieka numurs ir{" "}
            <b>{userId}</b>.<br></br> Piedaloties experimentā, Jums jāizpilda
            daži nosacījumi:
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
            Šis eksperiments sastāv no aptaujas un labirintu spēles. <br></br>{" "}
            Piedaloties eksperimentā, Jūs piekrītat{" "}
            <Terms chipText="mūsu privātuma un datu apstrādes politikai." />
          </div>
          {/*@ts-expect-error */}
          <StartButton token={token} st={st} />
        </div>
      </div>
    </main>
  );
}

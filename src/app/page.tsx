import Image from "next/image";
import { cookies } from "next/headers";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import Divider from "@mui/material/Divider";
import CookieParser from "cookie";
import Terms from "@/components/terms";
import StartButton from "@/components/startBtn";
import "@/styles/globals.scss";
import "@/styles/index.scss";

const neon = localFont({
  src: "./neon.ttf",
});

const montserrat = Montserrat({ subsets: ["latin"], weight: "400" });

async function getUserData() {
  const res = await fetch(`${process.env.BASE_URL}/api/user`, {
    method: "POST",
    cache: "no-store",
    headers: {
      Cookie: `jwtToken=${cookies().get("jwtToken")?.value}`,
      referer: `${process.env.BASE_URL}`,
    },
  });

  const { userId, groupName } = await res.json();
  return {
    userId,
    groupName,
    tokenData: CookieParser.parse(res.headers.get("Set-Cookie")!),
  };
}

export default async function Main() {
  const { userId, groupName, tokenData } = await getUserData();

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
          <StartButton tokenData={tokenData} />
        </div>
      </div>
    </main>
  );
}

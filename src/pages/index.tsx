import Image from "next/image";
import { parseCookies, setCookie } from "nookies";
import localFont from "next/font/local";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Montserrat } from "next/font/google";
import { useState } from "react";
import {
  Divider,
  Chip,
  Backdrop,
  Card,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Rubb from "@/../../public/rubb.png";
import "@/app/globals.css";
import "@/styles/index.scss";

const neon = localFont({
  src: "../../public/fonts/neon.ttf",
});

const montserrat = Montserrat({ subsets: ["latin"], weight: "400" });

export const getServerSideProps: GetServerSideProps<InitData> = async (ctx) => {
  const cookies = parseCookies(ctx);

  const init = await fetch(`${process.env.BASE_URL}/api/init`, {
    credentials: "same-origin",
    headers: {
      Cookie: JSON.stringify(cookies)
        .replace("{", "")
        .replace("}", "")
        .replaceAll(`"`, "")
        .replace(":", "="),
    },
  });

  const authHead = init.headers.get("set-cookie");
  if (!authHead) throw new Error("Ir notikusi kļūda!");

  if (authHead != cookies.jwtToken)
    setCookie(ctx, "jwtToken", authHead.split("=")[1].split(";")[0], {
      maxAge: 60 * 60 * 24,
    });

  const initData = await init.json();
  return { props: initData };
};

export default function Main({
  groupName,
  userId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isPrivacyOpen, setPrivacyOpen] = useState<boolean>(false);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);

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
                Eksperimenta laikā nedrīks atklāt citiem dalībniekiem savu
                grupas numuru vai individuālo dalībnieka numuru.
              </li>
              <li>
                Eksperimenta laikā jāatbild uz visiem jautājumiem taisnīgi.
              </li>
            </div>
            Šis eksperiments sastāv no aptaujas un labirinta spēles. <br></br>{" "}
            Piedaloties eksperimentā, Jūs piekrītat{" "}
            <Chip
              label="mūsu privātuma un datu apstrādes politikai."
              onClick={() => setPrivacyOpen(true)}
              sx={{ fontSize: "90%" }}
              className={`${montserrat.className}`}
            />
            <Backdrop
              open={isPrivacyOpen}
              onClick={() => setPrivacyOpen(false)}
            >
              <Card>privacy policy here</Card>
            </Backdrop>
          </div>
          <div className="bottomButtonGroup">
            <FormControlLabel
              required
              control={
                <Checkbox
                  checked={agreedToTerms}
                  onChange={() => setAgreedToTerms(!agreedToTerms)}
                />
              }
              className={`${montserrat.className}`}
              label="Es piekrītu visiem eksperimenta nosacījumiem"
            />
            <Button variant="outlined" disabled={!agreedToTerms} href="/survey">
              Piedalīties eksperimentā
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

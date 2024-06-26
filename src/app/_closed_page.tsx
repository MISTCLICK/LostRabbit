import Image from "next/image";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import Divider from "@mui/material/Divider";
import Terms from "@/components/terms";
import "@/styles/globals.scss";
import "@/styles/index.scss";

const neon = localFont({
  src: "./neon.ttf",
});

const montserrat = Montserrat({ subsets: ["latin"], weight: "400" });

export default async function Main() {
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
            eksperimentā programmēšanas jomā. <br />
            <br />
            Diemžēl, eksperiments bija pieejams tikai periodā no 11.09.2023.
            līdz 11.12.2023. un jau ir beidzies. Paldies visiem{" "}
            <b>359 dalībniekiem</b>, kas piedalījās eksperimentā.
            <br />
            <br />
            Šis pētnieciskais darbs tiks pabeigts līdz 2024. gada februārim.
            Atgādinam, ka visi iegūtie dati tiks izmantoti atbilstoši
            <Terms chipText="mūsu privātuma un datu apstrādes politikai." />
            <br />
            <i>Efektīvā redakcija no 17.01.2024.</i>
            <br />
            <br />
            Pētniecības komanda izsaka savu pateicību{" "}
            <b>
              Nataljai Kučerenko, Jekaterīnai Kazimirskai un Anitai Āriņai
            </b>{" "}
            par palīdzību un atbalstu pētnieciska darba izstrādāšanas procesā.
            <br />
            <br />
            💖
          </div>
        </div>
      </div>
    </main>
  );
}

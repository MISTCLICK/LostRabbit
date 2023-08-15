import Image from "next/image";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Terms from "./terms";
import { User } from "@/schema/users";

const montserrat = Montserrat({ subsets: ["latin-ext"], weight: "400" });

const neon = localFont({
  src: "../app/neon.ttf",
});

export default async function FinalCard({ userData }: { userData: User }) {
  return (
    <Card
      variant="outlined"
      className={`resultsFlexBoxMember ${montserrat.className}`}
      sx={{
        borderRadius: "20px",
      }}
    >
      <div className="cardBody">
        <div
          className={`title ${neon.className}`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          THE LOST RABBIT{" "}
          <Image
            src="/images/rubb.png"
            alt="the pink rabbit"
            width={100}
            height={100}
          />
        </div>
        <Divider />
        <div className="description">
          <p>
            Paldies par piedalīšanos eksperimentā!
            <br />
            Jūsu dalība ļoti palīdzēs šim pētnieciskajam darbam!
          </p>
          <p>
            Lūdzu atceraties, ka eksperimenta gaitā savākti dati tiks izmantoti
            atbilstoši{" "}
            <Terms chipText="mūsu privātuma un datu apstrādes politikai" />
          </p>
          <p>
            Eksperimenta organizatori novēl Jums veiksmi gan studijās, gan
            vispārīgi. <br />
            Visu labu un vēlreiz paldies!
          </p>
        </div>
      </div>
    </Card>
  );
}

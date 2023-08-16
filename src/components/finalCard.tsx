import Image from "next/image";
import { Montserrat, Space_Mono } from "next/font/google";
import localFont from "next/font/local";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import CopyButton from "./copyButton";
import Terms from "./terms";
import { User } from "@/schema/users";

const montserrat = Montserrat({ subsets: ["latin-ext"], weight: "400" });
const monospace = Space_Mono({ subsets: ["latin-ext"], weight: "400" });

const neon = localFont({
  src: "../app/neon.ttf",
});

export default async function FinalCard({ userData }: { userData: User }) {
  const formattedUserData = JSON.stringify(userData, null, 2);

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
          <div className="descriptionParagraph">
            Paldies par piedalīšanos eksperimentā!
            <br />
            Jūsu dalība ļoti palīdzēs šim pētnieciskajam darbam!
          </div>
          <div className="descriptionParagraph">
            Lūdzu atceraties, ka eksperimenta gaitā savākti dati tiks izmantoti
            atbilstoši{" "}
            <Terms chipText="mūsu privātuma un datu apstrādes politikai" />
          </div>
          <div className="descriptionParagraph">
            Eksperimenta organizatori novēl Jums veiksmi gan studijās, gan
            vispārīgi. <br />
            Visu labu un vēlreiz paldies!
          </div>
          <div className="descriptionParagraph">
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  Atvēriet šo aploksni, lai redzētu visus datus, kas tika
                  savākti eksperimenta gaitā.{" "}
                  <CopyButton
                    defText="Kopēt datus"
                    textOnCopy="Veiksmīgi kopēts!"
                    data={formattedUserData}
                  />
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <pre
                  className={monospace.className}
                  style={{
                    fontSize: "80%",
                    wordWrap: "break-word",
                    wordBreak: "break-word",
                  }}
                >
                  {formattedUserData}
                </pre>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>
    </Card>
  );
}

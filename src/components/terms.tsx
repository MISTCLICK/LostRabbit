"use client";

import Chip from "@mui/material/Chip";
import Backdrop from "@mui/material/Backdrop";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { useState } from "react";
import "@/styles/privacy.scss";

const montserrat = Montserrat({ subsets: ["latin-ext"], weight: "400" });

export default function Terms({ chipText }: { chipText: string }) {
  const [isPrivacyOpen, setPrivacyOpen] = useState<boolean>(false);

  return (
    <>
      {" "}
      <Chip
        label={chipText}
        onClick={() => setPrivacyOpen(true)}
        sx={{ fontSize: "90%" }}
        className={`${montserrat.className}`}
      />
      <Backdrop open={isPrivacyOpen} sx={{ zIndex: "1" }}>
        <Card sx={{ width: "80rem", display: "flex", flexWrap: "wrap" }}>
          <div className="privacyTextBlock">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2>1. Vispārīgi noteikumi</h2>{" "}
              <IconButton
                aria-label="close"
                sx={{ marginTop: "-2.2%", marginRight: "-1.9%" }}
                size="large"
                onClick={() => setPrivacyOpen(false)}
              >
                <HighlightOffIcon fontSize="inherit" />
              </IconButton>
            </div>
            <p>
              1.1. Šajā privātuma un datu apstrādes politikā tiek apskatīti datu
              aizsardzības jautājumi, kas saistīti ar Rīgas 80. vidusskolas
              zinātniski pētnieciskā darba „MĀKSLĪGĀ INTELEKTA PALĪDZĪBAS
              IETEKME UZ PROBLĒMRISINĀŠANAS PRODUKTIVITĀTI UN EFEKTIVITĀTI”
              eksperimentu programmēšanas jomā.
            </p>
            <br />
            <p>
              1.2. Zinātniski pētnieciskā darba autori turpmāk tiek nosaukti par
              eksperimenta organizatoriem. Viņi ir atbildīgi par datu drošību un
              apstrādi.
            </p>
            <br />
            <p>
              1.3. Eksperimenta subjekts (turpmāk, eksperimenta dalībnieks vai
              dalībnieks), piedaloties eksperimentā, piekrīt viņa datu iegūšanai
              un apstrādei atbilstoši šai privātuma un datu apstrādes politikai.
            </p>
          </div>
          <div className="privacyTextBlock shiftUp">
            <h2>2. Dati, kas tiek iegūti</h2>
            <p>
              2.1. Eksperimenta laikā tiek iegūti{" "}
              <i>
                eksperimenta dalībnieka vecums, eksperimenta dalībnieka pirmās
                piekļuves laiks šai tīmekļa vietnei
              </i>{" "}
              un{" "}
              <i>
                laiks, ko eksperimenta dalībnieks pavadījis, piedaloties
                eksperimentā
              </i>
              . Eksperimenta dalībnieku autorizācijai tiek izmantotas sīkdatnes
              (cookies).
            </p>
            <br />

            <p>
              2.2. Eksperimentā ir divas aptaujas un labirintu spēle.
              Piedaloties eksperimentā, dalībnieks piekrīt patiesi atbildēt uz
              visiem abu aptauju jautājumiem.
            </p>
            <br />

            <p>
              2.3. Eksperimenta organizatoriem ir piekļuve visiem datiem, kas
              iegūti atbilstoši 2.1. un 2.2. punktam.
            </p>
          </div>
          <div className="privacyTextBlock shiftUp">
            <h2>3. Datu izmantošana un eksperimenta organizatoru tiesības</h2>
            <p>
              3.1. Dati, kas iegūti atbilstoši 2.1. un 2.2. punktam, tiks
              izmantoti vienīgi 1.1. punktā minētā zinātniski pētnieciskā darba
              izstrādāšanas procesā. Dati tiks izmantoti analītiski, lai
              pieradītu vai noliegtu zinātniski pētnieciskā darba hipotēzi.
            </p>
            <br />
            <p>
              3.2. Dati netiks publicēti nekādā veidā ārpus 1.1. punkta minētā
              zinātniski pētnieciskā darba. Eksperimenta organizatori garantē
              eksperimenta dalībnieku identifikācijas neiespējamību.
            </p>
          </div>
          <div className="privacyTextBlock shiftUp">
            <h2>4. Eksperimenta dalībnieka tiesības un datu glabāšana</h2>
            <p>
              4.1. Eksperimenta dalībniekam ir pilnas piekļuves tiesības
              iegūtiem personas datiem. Visi iegūtie dati būs pieejami
              eksperimenta dalībniekam pēc eksperimenta beigām.
            </p>
            <br />
            <p>
              4.2. Zinātniski pētnieciskā darba izstrādāšanas iemeslu dēļ, visi
              dati bez izņēmuma tiks glabāti eksperimenta organizatoru datu bāzē
              līdz zinātniski pētnieciskā darba izstrādāšanas beigām.
            </p>
            <br />
            <p>
              4.3. Pēc zinātniski pētnieciskā darba izstrādāšanas beigām visi
              iegūtie dati no visiem eksperimenta dalībniekiem tiks
              neatgriezeniski dzēsti.
            </p>
            <br />
            <p>
              4.4. Eksperimenta dalībniekam ir tiesības uzdot jautājumus un
              pieprasīt plašāku informāciju no eksperimenta organizatoriem. To
              var izdarīt pa e-pastu:{" "}
              <Link href="mailto:mistclick.a@gmail.com">ari@mistclick.me</Link>
            </p>
            <br />
          </div>
        </Card>
      </Backdrop>
    </>
  );
}

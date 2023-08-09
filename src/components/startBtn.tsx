import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Montserrat } from "next/font/google";
import { useState } from "react";

const montserrat = Montserrat({ subsets: ["latin"], weight: "400" });

export default function StartButton() {
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  return (
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
  );
}

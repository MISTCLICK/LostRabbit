"use client";

import { setCookie } from "@/lib/setCookie";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Montserrat } from "next/font/google";
import { useEffect, useState } from "react";

const montserrat = Montserrat({ subsets: ["latin-ext"], weight: "400" });

interface StartButtonProps {
  token: string;
}

export default function StartButton({ token }: StartButtonProps) {
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);

  useEffect(() => {
    if (token) {
      setCookie("jwtToken", token, {
        maxAge: 604800,
      });
    }
  }, [token]);

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

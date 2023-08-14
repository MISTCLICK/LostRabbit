"use client";

import { setCookie } from "@/lib/setCookie";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Montserrat } from "next/font/google";
import { useEffect, useState } from "react";

const montserrat = Montserrat({ subsets: ["latin"], weight: "400" });

interface StartButtonProps {
  tokenData: Record<string, string>;
}

export default function StartButton({ tokenData }: StartButtonProps) {
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);

  useEffect(() => {
    setCookie("jwtToken", tokenData.jwtToken, {
      maxAge: 604800,
    });
  }, [tokenData.jwtToken]);

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

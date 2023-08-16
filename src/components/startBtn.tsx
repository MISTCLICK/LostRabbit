"use client";

import { setCookie } from "@/lib/setCookie";
import getCorrectPath from "@/lib/getCorrectPath";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useRouter } from "next/navigation";
import { Montserrat } from "next/font/google";
import { useEffect, useState } from "react";

const montserrat = Montserrat({ subsets: ["latin-ext"], weight: "400" });

interface StartButtonProps {
  token: string;
  st: string;
}

export default function StartButton({ token, st }: StartButtonProps) {
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      setCookie("jwtToken", token, {
        maxAge: 604800,
      });
    }

    router.prefetch(st === "default" ? "/survey" : st);
  }, [router, st, token]);

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

      <Button
        variant="outlined"
        disabled={!agreedToTerms}
        onClick={() => router.replace(st === "default" ? "/survey" : st)}
      >
        Piedalīties eksperimentā
      </Button>
    </div>
  );
}

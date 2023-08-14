"use client";

import { Chip, Backdrop, Card } from "@mui/material";
import { Montserrat } from "next/font/google";
import { useState } from "react";

const montserrat = Montserrat({ subsets: ["latin"], weight: "400" });

export default function Terms() {
  const [isPrivacyOpen, setPrivacyOpen] = useState<boolean>(false);

  return (
    <>
      {" "}
      <Chip
        label="mūsu privātuma un datu apstrādes politikai."
        onClick={() => setPrivacyOpen(true)}
        sx={{ fontSize: "90%" }}
        className={`${montserrat.className}`}
      />
      <Backdrop open={isPrivacyOpen} onClick={() => setPrivacyOpen(false)}>
        <Card>privacy policy here</Card>
      </Backdrop>
    </>
  );
}

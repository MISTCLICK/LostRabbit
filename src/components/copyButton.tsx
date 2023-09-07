"use client";

import { useState } from "react";
import { Montserrat } from "next/font/google";
import Button from "@mui/material/Button";
import DoneIcon from "@mui/icons-material/Done";

interface CopyButtonProps {
  defText: string;
  textOnCopy: string;
  data: any;
}

const montserrat = Montserrat({ subsets: ["latin-ext"], weight: "400" });

export default function CopyButton({
  defText,
  textOnCopy,
  data,
}: CopyButtonProps) {
  const [buttonPressed, setButtonPressed] = useState<boolean>(false);

  return (
    <Button
      sx={
        buttonPressed
          ? {
              height: "4ch",
              width: "30ch",

              backgroundColor: "green",
              ":hover": {
                backgroundColor: "DarkGreen",
              },
            }
          : {
              height: "4ch",
              width: "30ch",
            }
      }
      variant="contained"
      className={montserrat.className}
      onClick={() => {
        navigator.clipboard.writeText(data);
        setButtonPressed(true);
      }}
    >
      {buttonPressed ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          <DoneIcon sx={{ marginRight: 1 }} />
          {textOnCopy}
        </div>
      ) : (
        defText
      )}
    </Button>
  );
}

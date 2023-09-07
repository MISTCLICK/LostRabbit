import { useState } from "react";
import { Montserrat } from "next/font/google";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";

const montserrat = Montserrat({ subsets: ["latin-ext"], weight: "400" });

export default function SurveyInput({ q }: { q: SurveyQuestion }) {
  const [textAreaValue, setTextAreaValue] = useState<string>("");

  return (
    <>
      <TextField
        fullWidth
        multiline
        variant="outlined"
        sx={montserrat.style}
        type="text"
        name={q.name}
        maxRows={10}
        value={textAreaValue}
        onChange={(e) =>
          e.target.value.length <= 700 && setTextAreaValue(e.target.value)
        }
      />
      {textAreaValue.length === 700 && (
        <FormHelperText error>
          Maksimālais ieraksta garums ir 700 simboli.
        </FormHelperText>
      )}{" "}
    </>
  );
}

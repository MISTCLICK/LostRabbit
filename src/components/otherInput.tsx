import { useState } from "react";
import { Montserrat } from "next/font/google";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";

const montserrat = Montserrat({ subsets: ["latin-ext"], weight: "400" });

export default function OtherInput({
  q,
  opt,
}: {
  q: SurveyQuestion;
  opt: string;
}) {
  const [otherSelected, setOtherSelected] = useState<boolean>(false);
  const [textAreaValue, setTextAreaValue] = useState<string>("");

  return (
    <>
      <div key={opt} style={{ display: "flex" }}>
        <FormControlLabel
          label="Cits:"
          control={
            <Checkbox
              onChange={() => setOtherSelected((prev) => !prev)}
              disabled={!!textAreaValue}
            />
          }
        />
        <TextField
          fullWidth
          multiline
          variant="standard"
          sx={montserrat.style}
          className={montserrat.className}
          type="text"
          name={q.name}
          disabled={!otherSelected}
          value={textAreaValue}
          onChange={(e) =>
            e.target.value.length <= 500 && setTextAreaValue(e.target.value)
          }
          maxRows={5}
        />
      </div>
      {!otherSelected && textAreaValue && (
        <FormHelperText error>
          Uzmanību! Jūs aizpildījāt {`"`}Cits{`"`} ierakstu, bet atslēdzāt to.
          Jūsu atbilde tajā ierakstā netiks ieskaitīta.
        </FormHelperText>
      )}
      {textAreaValue.length === 500 && (
        <FormHelperText error>
          Maksimālais ieraksta garums ir 500 simboli.
        </FormHelperText>
      )}
    </>
  );
}

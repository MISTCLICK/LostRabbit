import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import OtherInput from "./otherInput";

export default function SurveyRadio({
  q,
  radioHelperText,
}: {
  q: SurveyQuestion;
  radioHelperText: string;
}) {
  return (
    <>
      <RadioGroup name={q.question}>
        {q.options.map((opt) => {
          if (opt === "$OTHER") {
            return <OtherInput q={q} opt={opt} key={opt} />;
          }
          return (
            <FormControlLabel
              key={opt}
              value={opt}
              control={<Radio />}
              label={opt}
              name={q.name}
            />
          );
        })}
      </RadioGroup>
      <FormHelperText error>{radioHelperText}</FormHelperText>
    </>
  );
}

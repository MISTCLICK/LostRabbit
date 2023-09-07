import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import OtherInput from "./otherInput";

export default function SurveyCheckboxes({ q }: { q: SurveyQuestion }) {
  return (
    <FormGroup>
      {q.options.map((opt) => {
        if (opt === "$OTHER") {
          return <OtherInput q={q} opt={opt} key={opt} />;
        }

        return (
          <div key={opt}>
            <FormControlLabel
              control={<Checkbox value={opt} name={q.name} />}
              label={opt}
            />
            <br></br>
          </div>
        );
      })}
    </FormGroup>
  );
}

import { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export default function SurveyDropdown({ q }: { q: SurveyQuestion }) {
  const [selectValue, setSelectValue] = useState<string>("");

  return (
    <Select
      value={selectValue}
      onChange={(e) => {
        setSelectValue(e.target.value);
      }}
      sx={{ minWidth: 150 }}
      name={q.name}
      required
    >
      {q.options.map((opt) => {
        return (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        );
      })}
    </Select>
  );
}

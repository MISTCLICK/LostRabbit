import { useState } from "react";
import { Montserrat } from "next/font/google";
import {
  Box,
  FormControlLabel,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  Button,
  Checkbox,
} from "@mui/material";
import CopyrightIcon from "@mui/icons-material/Copyright";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";
import Nav from "@/components/nav";
import "@/styles/survey.scss";

const surveyQuestions = [
  {
    question: "Kāds ir Jūsu vecums?",
    options: [
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30+",
    ],
    type: "dropdown",
  },
  {
    question:
      "Vai Jums ir jebkāda pieredze ar mākslīgā intelekta (AI) izmantošanu?",
    options: ["Jā", "Nē"],
    type: "radio",
  },
  {
    question: "Ar kādiem AI algoritmiem Jums ir pieredze?",
    options: [
      "LLM (Large Language Models)",
      "Mašīnmācīšanās (Machine learning)",
      "AI bez mācību modeles",
      "ADP / Adaptive ADP",
    ],
    type: "checkbox",
  },
  {
    question: "jautājums4??",
    options: ["0", "1", "2", "3", "4", "5"],
    type: "radio",
  },
  {
    question: "jautājums5??",
    options: ["0", "1", "2", "3", "4", "5"],
    type: "radio",
  },
];

const montserrat = Montserrat({ subsets: ["latin"], weight: "400" });

export default function Survey() {
  const [age, setAge] = useState<string>("");

  return (
    <main>
      <div className="topSurveyComponents">
        <Nav activeStep={0} />
        <Box
          sx={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "3ch",
            marginRight: "6ch",
          }}
        >
          <>
            {surveyQuestions.map((q) => {
              return (
                <Box
                  key={q.question}
                  sx={{
                    border: "1px dashed grey",
                    borderRadius: "10px",
                    width: "75ch",
                    margin: "1.5ch",
                  }}
                >
                  <div className={`${montserrat.className} q-box`}>
                    <div className="question">{q.question}</div>
                    <div className="options">
                      {q.type == "radio" ? (
                        <>
                          <RadioGroup>
                            {q.options.map((opt) => {
                              return (
                                <>
                                  <FormControlLabel
                                    value={opt}
                                    control={<Radio />}
                                    label={opt}
                                  />
                                </>
                              );
                            })}
                          </RadioGroup>
                        </>
                      ) : q.type == "dropdown" ? (
                        <>
                          <Select
                            value={age}
                            onChange={(e) => {
                              setAge(e.target.value);
                            }}
                            sx={{ minWidth: 150 }}
                          >
                            {q.options.map((opt) => {
                              return (
                                <MenuItem key={opt} value={opt}>
                                  {opt}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </>
                      ) : (
                        <>
                          {q.options.map((opt) => {
                            return (
                              <>
                                <FormControlLabel
                                  key={opt}
                                  control={<Checkbox />}
                                  label={opt}
                                />
                                <br></br>
                              </>
                            );
                          })}
                        </>
                      )}
                    </div>
                  </div>
                </Box>
              );
            })}
          </>
        </Box>
      </div>
      <footer className={`surveyFoot ${montserrat.className}`}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CopyrightIcon sx={{ m: 1 }} /> <p>Rīgas 80. vidusskola, 2023.</p>{" "}
        </div>
        <div>
          <Button variant="outlined">Turpināt</Button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p>Pētnieciskais darbs programmēšanas jomā</p>
          <SettingsEthernetIcon sx={{ m: 1 }} />
        </div>
      </footer>
    </main>
  );
}

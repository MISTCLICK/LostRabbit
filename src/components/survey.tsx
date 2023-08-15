"use client";

import { Suspense, useState } from "react";
import { Montserrat } from "next/font/google";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import CopyrightIcon from "@mui/icons-material/Copyright";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";
import type { SurveyAnswers, SurveySubmitEvent } from "@/app/types/types";
import FormHelperText from "@mui/material/FormHelperText";
import Loading from "@/app/loading";
import "@/styles/survey.scss";

const montserrat = Montserrat({ subsets: ["latin-ext"], weight: "400" });

interface surveyQuestionObj {
  question: string;
  options: string[];
  type: string;
  name: string;
}

interface SurveyProps {
  surveyQuestions: surveyQuestionObj[];
  type: "survey" | "feedback";
}

export default function Survey({ surveyQuestions, type }: SurveyProps) {
  const [selectValue, setSelectValue] = useState<string>("");
  const [radioHelperText, setRadioHelperText] = useState<string>("");

  const router = useRouter();

  return (
    <Suspense fallback={<Loading />}>
      <form
        className="surveyFormBody"
        //@ts-expect-error
        onSubmit={async (e: SurveySubmitEvent) => {
          e.preventDefault();

          let answers: SurveyAnswers = [];

          for (const questionObj of surveyQuestions) {
            switch (questionObj.type) {
              case "checkbox":
                let checkedBoxes: string[] = [];
                //@ts-expect-error
                e.target[questionObj.name].forEach((element) => {
                  if (element.checked) checkedBoxes.push(element.value);
                });

                if (checkedBoxes.length === 0) checkedBoxes.push("NULL");
                answers.push({
                  question: questionObj.question,
                  answer: checkedBoxes,
                });
                break;
              default:
                //@ts-expect-error
                if (e.target[questionObj.name].value === "") {
                  setRadioHelperText("Atbilde šim jautājumam ir obligāta!");
                  return;
                }

                answers.push({
                  question: questionObj.question,
                  //@ts-expect-error
                  answer: e.target[questionObj.name].value,
                });
                break;
            }
          }

          const res = await fetch("/api/survey", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              answers,
              type,
            }),
          });

          if (res.status !== 200) {
            return router.push("/");
          }
          type === "survey" ? router.push("/level/1") : router.push("/results");
          return;
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
                    {q.type === "radio" ? (
                      <>
                        <RadioGroup name={q.question}>
                          {q.options.map((opt) => {
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
                    ) : q.type === "dropdown" ? (
                      <>
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
                      </>
                    ) : (
                      <FormGroup>
                        {q.options.map((opt) => {
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
                    )}
                  </div>
                </div>
              </Box>
            );
          })}
        </>
        <footer className={`surveyFoot ${montserrat.className}`}>
          <div>
            <CopyrightIcon sx={{ m: 1 }} /> <p>Rīgas 80. vidusskola, 2023.</p>{" "}
          </div>
          <div>
            <Button type="submit" variant="outlined">
              {type === "survey" ? "Turpināt" : "Pabeigt eksperimentu"}
            </Button>
          </div>
          <div>
            <p>Pētnieciskais darbs programmēšanas jomā</p>
            <SettingsEthernetIcon sx={{ m: 1 }} />
          </div>
        </footer>
      </form>
    </Suspense>
  );
}

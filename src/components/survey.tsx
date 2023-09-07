"use client";

import { type FormEvent, Suspense, useState } from "react";
import { Montserrat } from "next/font/google";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CopyrightIcon from "@mui/icons-material/Copyright";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";
import Loading from "@/app/loading";
import SurveyRadio from "./surveyRadio";
import SurveyInput from "./surveyInput";
import SurveyCheckboxes from "./surveyCheckboxes";
import SurveyDropdown from "./surveyDropdown";
import "@/styles/survey.scss";

const montserrat = Montserrat({ subsets: ["latin-ext"], weight: "400" });

interface SurveyProps {
  surveyQuestions: SurveyQuestion[];
  type: "survey" | "feedback";
}

//@ts-expect-error
interface SurveySubmitEvent extends FormEvent<HTMLFormElement> {
  target: {
    [name: string]: HTMLAnswerValue | HTMLCheckboxesValues[];
  };
}

export default function Survey({ surveyQuestions, type }: SurveyProps) {
  const [radioHelperText, setRadioHelperText] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

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
                  if (element.checked && element.type === "checkbox")
                    checkedBoxes.push(element.value);
                  if (
                    element.type === "textarea" &&
                    element.value &&
                    !element.disabled
                  )
                    checkedBoxes.push(element.value);
                });

                if (checkedBoxes.length === 0) checkedBoxes.push("NULL");
                answers.push({
                  question: questionObj.question,
                  answer: checkedBoxes,
                });
                break;
              default:
                if (
                  //@ts-expect-error
                  e.target[questionObj.name].value === "" &&
                  questionObj.type !== "input"
                ) {
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

          setSubmitted(true);

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

          if (!res.ok) {
            return router.replace("/");
          }

          type === "survey"
            ? router.replace("/level/1")
            : router.replace("/results");
          return;
        }}
      >
        <div>
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
                      <SurveyRadio q={q} radioHelperText={radioHelperText} />
                    ) : q.type === "dropdown" ? (
                      <SurveyDropdown q={q} />
                    ) : q.type === "checkbox" ? (
                      <SurveyCheckboxes q={q} />
                    ) : (
                      <SurveyInput q={q} />
                    )}
                  </div>
                </div>
              </Box>
            );
          })}
        </div>
        <footer className={`surveyFoot ${montserrat.className}`}>
          <div>
            <CopyrightIcon sx={{ m: 1 }} /> <p>Rīgas 80. vidusskola, 2023.</p>{" "}
          </div>
          <div>
            <Button type="submit" variant="outlined" disabled={submitted}>
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

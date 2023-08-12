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
import Nav from "@/components/nav";
import type { SurveyAnswers, SurveySubmitEvent } from "@/app/types/types";
import "@/styles/survey.scss";
import FormHelperText from "@mui/material/FormHelperText";
import Loading from "@/app/loading";

const surveyQuestions = [
  {
    question: "Kāds ir Jūsu vecums?",
    options: [
      "6",
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
    name: "ageQuestion",
  },
  {
    question:
      "Vai Jums ir jebkāda pieredze ar mākslīgā intelekta (AI) izmantošanu?",
    options: ["Jā", "Nē"],
    type: "radio",
    name: "aiUseQuestion",
  },
  {
    question: "Ar kādiem AI algoritmiem Jums ir pieredze?",
    options: [
      "LLM (Large Language Models)",
      "Mašīnmācīšanās (Machine learning)",
      "AI bez mācību datiem",
      "ADP / Adaptive ADP",
      "Ar nekādiem no minētajiem",
    ],
    type: "checkbox",
    name: "aiTypesQuestion",
  },
  {
    question: "jautājums4??",
    options: ["0", "1", "2", "3", "4", "5"],
    type: "radio",
    name: "aiQuestion4",
  },
  {
    question: "jautājums5??",
    options: ["0", "1", "2", "3", "4", "5"],
    type: "radio",
    name: "aiQuestion5",
  },
];

const montserrat = Montserrat({ subsets: ["latin"], weight: "400" });

export default function Survey() {
  const [age, setAge] = useState<string>("");
  const [radioHelperText, setRadioHelperText] = useState<string>("");

  const router = useRouter();

  return (
    <Suspense fallback={<Loading />}>
      <main>
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
              }),
            });

            if (res.status !== 200) {
              return router.push("/");
            }

            return router.push("/level/1");
          }}
        >
          <div className="topSurveyComponents">
            <Nav activeStep={0} />
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "3ch",
              }}
            >
              <>
                {surveyQuestions.map((q) => {
                  return (
                    <>
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
                                      <>
                                        <FormControlLabel
                                          key={opt}
                                          value={opt}
                                          control={<Radio />}
                                          label={opt}
                                          name={q.name}
                                        />
                                      </>
                                    );
                                  })}
                                </RadioGroup>
                                <FormHelperText error>
                                  {radioHelperText}
                                </FormHelperText>
                              </>
                            ) : q.type === "dropdown" ? (
                              <>
                                <Select
                                  value={age}
                                  onChange={(e) => {
                                    setAge(e.target.value);
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
                                    <>
                                      <FormControlLabel
                                        control={
                                          <Checkbox value={opt} name={q.name} />
                                        }
                                        label={opt}
                                      />
                                      <br></br>
                                    </>
                                  );
                                })}
                              </FormGroup>
                            )}
                          </div>
                        </div>
                      </Box>
                    </>
                  );
                })}
              </>
            </Box>
          </div>
          <footer className={`surveyFoot ${montserrat.className}`}>
            <div>
              <CopyrightIcon sx={{ m: 1 }} /> <p>Rīgas 80. vidusskola, 2023.</p>{" "}
            </div>
            <div>
              <Button type="submit" variant="outlined">
                Turpināt
              </Button>
            </div>
            <div>
              <p>Pētnieciskais darbs programmēšanas jomā</p>
              <SettingsEthernetIcon sx={{ m: 1 }} />
            </div>
          </footer>
        </form>
      </main>
    </Suspense>
  );
}

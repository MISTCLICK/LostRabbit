import { Montserrat } from "next/font/google";
import Box from "@mui/material/Box";
import Nav from "@/components/nav";
import Survey from "@/components/survey";
import "@/styles/survey.scss";

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
      "LLM (Large Language Models) / NLP (Natural Language Processing) (piem. ChatGPT, c.ai, Siri, Ok Google u.c.)",
      "Mašīnmācīšanās (Machine learning) / Dziļā mācīšanās (Deep Learning) (piem. TensorFlow u.c.)",
      "ADP / Adaptive ADP (piem. Tesla Autopilot u.c.)",
      "Ar nekādiem no minētajiem",
    ],
    type: "checkbox",
    name: "aiTypesQuestion",
  },
  {
    question: "Vai Jūs izmantojāt AI palīdzību ikdienā?",
    options: ["Jā", "Nē"],
    type: "radio",
    name: "aiEverydayUseQuestion",
  },
  {
    question: "Vai Jūs uzskatāt, ka AI var izmantot kā palīgu jebkādam darbam?",
    options: ["Jā", "Nē"],
    type: "radio",
    name: "aiHelpQuestion",
  },
  {
    question: "Kādiem mērķiem Jums noderēja AI palīdzība?",
    options: [
      "Gudrās mājas automatizācija",
      "Darba pienākumu / mājas darbu pildīšana",
      "Informācijas meklēšana",
      "Programmēšana",
      "Atpūta (jebkāda)",
      "$OTHER",
    ],
    type: "checkbox",
    name: "aiAimsQuestion",
  },
  {
    question:
      "Vai Jūs uzskatāt, ka AI ir tehnoloģija, kas ir būtiska cilvēcības tehnoloģiskajai attīstībai?",
    options: ["Jā", "Nē"],
    type: "radio",
    name: "aiFutureQuestion",
  },
  {
    question:
      "Vai Jūs uzskatāt, ka AI ir spējīgs aizvietot kādas no šīm profesijām?",
    options: [
      "Skolotājs (-ja)",
      "Programmētājs (-ja)",
      "Sabiedriskā transporta vadītājs (-ja)",
      "Mākslinieks (-ce)",
      "Tiesnesis (-se) / Advokāts (-e)",
      "Uzņēmuma valdes loceklis (-e)",
      "$OTHER",
    ],
    type: "checkbox",
    name: "aiProfessionsQuestion",
  },
  {
    question:
      "Vai Jūs uzskatāt, ka AI ir tehnoloģija, kas var kaut kā draudēt cilvēcībai?",
    options: ["Jā", "Nē"],
    type: "radio",
    name: "aiDangerQuestion",
  },
];

const montserrat = Montserrat({ subsets: ["latin-ext"], weight: "400" });

export default function SurveyPage() {
  return (
    <main className="surveyPage">
      <Nav activeStep={0} />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "3ch",
        }}
      >
        <Box
          sx={{
            border: "5px double grey",
            borderRadius: "10px",
            width: "75ch",
          }}
        >
          <div className={`${montserrat.className} q-box`}>
            <div className="question">
              Aptauja par mākslīgā intelekta izmantošanu
            </div>
            <div className="options">
              Šajā eksperimenta daļā jums ir jāaizpilda īsa aptauja.
            </div>
          </div>
        </Box>
        <Survey surveyQuestions={surveyQuestions} type="survey" />
      </Box>
    </main>
  );
}

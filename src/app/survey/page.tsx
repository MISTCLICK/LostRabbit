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

import { Montserrat } from "next/font/google";
import Box from "@mui/material/Box";
import Nav from "@/components/nav";
import Survey from "@/components/survey";
import "@/styles/survey.scss";

const montserrat = Montserrat({ subsets: ["latin-ext"], weight: "400" });

const surveyQuestions = [
  {
    question: "jautājums1??",
    options: ["0", "1", "2", "3", "4", "5"],
    type: "dropdown",
    name: "aiQuestion1",
  },
  {
    question: "jautājums2??",
    options: ["0", "1", "2", "3", "4", "5"],
    type: "radio",
    name: "aiQuestion2",
  },
  {
    question: "jautājums3??",
    options: ["0", "1", "2", "3", "4", "5"],
    type: "checkbox",
    name: "aiQuestion3",
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
    type: "input",
    name: "aiQuestion5",
  },
];

export default function FeedbackPage() {
  return (
    <main className="surveyPage">
      <Nav activeStep={2} />
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
            <div className="question">Atgriezeniskās saites aptauja</div>
            <div className="options">
              Mums ir svarīgs jŭsu viedoklis par eksperimenta gaitu un citiem
              jautājumiem, kas saistīti ar AI.
            </div>
          </div>
        </Box>
        <Survey surveyQuestions={surveyQuestions} type="feedback" />
      </Box>
    </main>
  );
}

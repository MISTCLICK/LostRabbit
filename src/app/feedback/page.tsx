import { Montserrat } from "next/font/google";
import Box from "@mui/material/Box";
import Nav from "@/components/nav";
import Survey from "@/components/survey";
import "@/styles/survey.scss";

const montserrat = Montserrat({ subsets: ["latin-ext"], weight: "400" });

const surveyQuestions = [
  {
    question: "Novērtējiet spēles sarežģītumu!",
    options: ["Ļoti viegli", "Viegli", "Izaicinoši", "Grūti", "Ļoti grūti"],
    type: "radio",
    name: "feedbackComplexityQuestion",
  },
  {
    question: "Kuriem no šiem apgalvojumiem Jūs piekrītat?",
    options: [
      "Eksperimenta gaitā man bija nepieciešama ārēja palīdzība",
      "Eksperimenta gaita bija saprotama un vienkārša",
      "Eksperimenta vietnes saskarne man kā lietotājam bija viegli saprotama",
      "Es sapratu AI izmantošanas ideju problēmu risināšanai",
      "Man bija interesanti piedalīties eksperimentā",
    ],
    type: "checkbox",
    name: "feedbackStatementsQuestion",
  },
  {
    question:
      "Vai Jūs gribētu kaut ko piebilst? Jūsu viedoklis, kā arī priekšlikumi mums ir patiešām svarīgi!",
    options: [],
    type: "input",
    name: "feedbackFreeInputQuestion",
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
              Mums ir svarīgs jūsu viedoklis par eksperimenta gaitu un citiem
              jautājumiem, kas saistīti ar AI.
            </div>
          </div>
        </Box>
        <Survey surveyQuestions={surveyQuestions} type="feedback" />
      </Box>
    </main>
  );
}

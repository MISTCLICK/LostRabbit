import { Stepper, Step, StepLabel } from "@mui/material";

interface navProps {
  activeStep: 0 | 1 | 2 | 3;
}

export default function Nav({ activeStep }: navProps) {
  return (
    <nav>
      <Stepper activeStep={activeStep} alternativeLabel>
        <Step>
          <StepLabel>Aptauja</StepLabel>
        </Step>
        <Step>
          <StepLabel>Labirintu spēle</StepLabel>
        </Step>
        <Step>
          <StepLabel>Atgriezeniskā saite</StepLabel>
        </Step>
      </Stepper>
    </nav>
  );
}

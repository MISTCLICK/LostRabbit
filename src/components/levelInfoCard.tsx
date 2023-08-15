import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import { Montserrat } from "next/font/google";
import formatTime from "@/lib/formatTime";

interface LevelInfoCardProps {
  className: string;
  levelNum?: string | string[];
  currentTime: number;
}

const montserrat = Montserrat({ subsets: ["latin-ext"], weight: "400" });

export default function LevelInfoCard({
  className,
  levelNum,
  currentTime,
}: LevelInfoCardProps) {
  return (
    <div className={className}>
      <Card variant="outlined" className="levelInfoCard">
        <div className="cardMember">
          <h1 className={`${montserrat.className}`}>{levelNum}. LĪMENIS</h1>
        </div>
        <Divider sx={{ width: "100%" }} />
        <h2 className={`cardMember ${montserrat.className}`}>Jūsu laiks:</h2>
        <Card
          className="cardMember lowMargin"
          sx={{
            backgroundColor: "#0288D1", //"#2E7D32", //can use green if needed;
            width: "75%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <h1 className={`cardMember ${montserrat.className}`}>
            {formatTime(currentTime)}
          </h1>
        </Card>
      </Card>
    </div>
  );
}

import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import { Montserrat } from "next/font/google";
import Image from "next/image";

import w_generic from "@/../../public/images/w-generic.png";
import a_generic from "@/../../public/images/a-generic.png";
import s_generic from "@/../../public/images/s-generic.png";
import d_generic from "@/../../public/images/d-generic.png";

import up_generic from "@/../../public/images/up-generic.png";
import down_generic from "@/../../public/images/down-generic.png";
import left_generic from "@/../../public/images/left-generic.png";
import right_generic from "@/../../public/images/right-generic.png";

interface ControlInfoCardProps {
  className: string;
}

const montserrat = Montserrat({ subsets: ["latin-ext"], weight: "400" });

export default function ControlsInfoCard({ className }: ControlInfoCardProps) {
  return (
    <div className={className}>
      <Card variant="outlined" className="levelInfoCard">
        <div className="cardMember">
          <h1 className={`${montserrat.className}`}>Kontroles opcijas</h1>
        </div>
        <Divider sx={{ width: "100%" }} />
        <div className={`cardMember`}>
          <div className="keyCapsFlexBox">
            <div className="keysBox start">
              <div className="row1-smallshift">
                <Image
                  className="keyCapImage"
                  src={w_generic}
                  alt="W keyboard key generic"
                />
              </div>
              <div className="row2">
                <Image
                  className="keyCapImage"
                  src={a_generic}
                  alt="A keyboard key generic"
                />
                <Image
                  className="keyCapImage"
                  src={s_generic}
                  alt="S keyboard key generic"
                />
                <Image
                  className="keyCapImage"
                  src={d_generic}
                  alt="D keyboard key generic"
                />
              </div>
            </div>
            <div className="keysBox end">
              <div className="row1-bigshift">
                <Image
                  className="keyCapImage"
                  src={up_generic}
                  alt="W keyboard key generic"
                />
              </div>
              <div className="row2">
                <Image
                  className="keyCapImage"
                  src={left_generic}
                  alt="A keyboard key generic"
                />
                <Image
                  className="keyCapImage"
                  src={down_generic}
                  alt="S keyboard key generic"
                />
                <Image
                  className="keyCapImage"
                  src={right_generic}
                  alt="D keyboard key generic"
                />
              </div>
            </div>
          </div>
        </div>
        <Divider sx={{ width: "100%" }} />
        <div
          className={`${montserrat.className} cardMember`}
          style={{
            width: "100%",
            marginLeft: "12%",
          }}
        >
          <p>W/↑ | uz augšu</p>
          <p>A/← | pa kreisi</p>
          <p>S/↓ | uz leju</p>
          <p>D/→ | pa labi</p>
        </div>
      </Card>
    </div>
  );
}

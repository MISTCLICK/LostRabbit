import Image from "next/image";
import Rubb from "@/../../public/rubb.png";

interface PlayerProps {
  width: number;
  height: number;
}

export default function Player({ width, height }: PlayerProps) {
  return (
    <div>
      <Image src={Rubb} alt="Logo" width={width} height={height} />
    </div>
  );
}

import Image from "next/image";

interface PlayerProps {
  width: number;
  height: number;
}

export default function Player({ width, height }: PlayerProps) {
  return (
    <div>
      <Image src="/images/rubb.png" alt="Logo" width={width} height={height} />
    </div>
  );
}

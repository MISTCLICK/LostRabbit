interface PlayerProps {
  width: number;
  height: number;
}

export default function Player({ width, height }: PlayerProps) {
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "red",
      }}
    ></div>
  );
}

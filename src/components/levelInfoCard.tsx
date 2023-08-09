interface LevelInfoCardProps {
  className: string;
  levelNum?: string | string[];
}

export default function LevelInfoCard({
  className,
  levelNum,
}: LevelInfoCardProps) {
  return <div className={className}>{levelNum}</div>;
}

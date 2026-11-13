import { useHealth } from "../../hooks/useHealth";
import { MAX_HEALTH } from "../../player/health";

const HEART_COUNT = MAX_HEALTH / 2;
const LOW_HEALTH = 6;

// 7×6 pixel-art heart.
const HEART_PIXELS = [".##.##.", "#######", "#######", ".#####.", "..###..", "...#..."];
const HEART_PATH = HEART_PIXELS.flatMap((row, y) =>
  [...row].map((pixel, x) => (pixel === "#" ? `M${x} ${y}h1v1h-1z` : ""))
).join("");

type HeartFill = "full" | "half" | "empty";

const Heart = ({ fill }: { fill: HeartFill }) => (
  <svg className="heart" viewBox="0 0 7 6" shapeRendering="crispEdges">
    <path d={HEART_PATH} className="heart-empty" />
    {fill !== "empty" && (
      <path d={HEART_PATH} className={`heart-full ${fill === "half" ? "half" : ""}`} />
    )}
  </svg>
);

const heartFill = (index: number, health: number): HeartFill => {
  const pointsInHeart = health - index * 2;
  if (pointsInHeart >= 2) return "full";
  return pointsInHeart === 1 ? "half" : "empty";
};

const HealthBar = () => {
  const health = useHealth((state) => state.health);
  const lastHitId = useHealth((state) => state.lastHit?.id);

  return (
    <div
      key={lastHitId}
      className={`health-bar ${lastHitId ? "hurt" : ""} ${health <= LOW_HEALTH ? "low" : ""}`}
      aria-label={`Vida: ${health} de ${MAX_HEALTH}`}
    >
      {Array.from({ length: HEART_COUNT }, (_, index) => (
        <Heart key={index} fill={heartFill(index, health)} />
      ))}
    </div>
  );
};

export default HealthBar;

import { useStore } from "../../hooks/useStore";
import Cube from "../Cube";

const Cubes = () => {
  const cubes = useStore((state) => state.cubes);

  return (
    <>
      {cubes.map(({ pos, id, texture }) => (
        <Cube key={id} id={id} position={pos} texture={texture} />
      ))}
    </>
  );
};

export default Cubes;

import { useStore } from "../../hooks/useStore";
import { isTexturedBlock } from "../../inventory/items";
import ChestBlock from "../ChestBlock";
import Cube from "../Cube";

const Cubes = () => {
  const cubes = useStore((state) => state.cubes);

  return (
    <>
      {cubes.map(({ pos, id, type, facing = 0 }) =>
        isTexturedBlock(type) ? (
          <Cube key={id} id={id} position={pos} texture={type} />
        ) : (
          <ChestBlock key={id} id={id} position={pos} facing={facing} />
        )
      )}
    </>
  );
};

export default Cubes;

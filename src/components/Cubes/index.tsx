import { useStore } from "../../hooks/useStore";
import Cube from "../Cube";

const Cubes = () => {
  const [cubes]: any = useStore<any>((state: any) => [state.cubes]);
  console.log(cubes);

  return cubes.map(({ pos, id, texture }: any) => (
    <Cube key={id} id={id} position={pos} texture={texture} />
  ));
};

export default Cubes;

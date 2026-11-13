import { usePlane } from "@react-three/cannon";
import { Mesh } from "three";
import { useStore } from "../../hooks/useStore";
import { groundTexture } from "../../images/textures";

const GROUND_HEIGHT = -0.5;
const GROUND_SIZE = 100;

groundTexture.repeat.set(GROUND_SIZE, GROUND_SIZE);

const Ground = () => {
  const [ref] = usePlane<Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, GROUND_HEIGHT, 0],
  }));
  const addCube = useStore((state) => state.addCube);

  return (
    <mesh
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        addCube(e.point.x, GROUND_HEIGHT + 0.5, e.point.z);
      }}
    >
      <planeBufferGeometry attach="geometry" args={[GROUND_SIZE, GROUND_SIZE]} />
      <meshStandardMaterial attach="material" map={groundTexture} />
    </mesh>
  );
};

export default Ground;

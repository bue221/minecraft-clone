import { useBox } from "@react-three/cannon";
import { Mesh } from "three";
import { groundTexture } from "../../images/textures";
import type { BlockSurfaceUserData } from "../../world/blockSurface";

const GROUND_TOP = -0.5;
const GROUND_SIZE = 100;
const GROUND_THICKNESS = 1;
const SIDE_COLOR = "#6b4a2f";
const GROUND_USER_DATA: BlockSurfaceUserData = { blockSurface: true };
// BoxGeometry material groups: +x, -x, +y, -y, +z, -z.
const TOP_FACE = 2;
const SIDE_FACES = [0, 1, 3, 4, 5];

groundTexture.repeat.set(GROUND_SIZE, GROUND_SIZE);

/** A finite slab, so walking off the edge drops the player into the void. */
const Ground = () => {
  const [ref] = useBox<Mesh>(() => ({
    type: "Static",
    args: [GROUND_SIZE, GROUND_THICKNESS, GROUND_SIZE],
    position: [0, GROUND_TOP - GROUND_THICKNESS / 2, 0],
    userData: GROUND_USER_DATA,
  }));

  return (
    <mesh ref={ref}>
      <boxGeometry args={[GROUND_SIZE, GROUND_THICKNESS, GROUND_SIZE]} />
      <meshStandardMaterial attach={`material-${TOP_FACE}`} map={groundTexture} />
      {SIDE_FACES.map((face) => (
        <meshStandardMaterial key={face} attach={`material-${face}`} color={SIDE_COLOR} />
      ))}
    </mesh>
  );
};

export default Ground;

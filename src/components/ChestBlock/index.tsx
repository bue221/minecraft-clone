import { useBox } from "@react-three/cannon";
import { Mesh } from "three";
import type { BlockSurfaceUserData } from "../../world/blockSurface";
import type { Facing, Position } from "../../world/cube";

// Minecraft chests are 14/16 of a block and sit on the bottom of their cell.
const SIZE = 14 / 16;
const BOTTOM_OFFSET = (1 - SIZE) / 2;
const LID_SEAM_Y = SIZE / 2 - 5 / 16;

const COLORS = { body: "#9c6a32", trim: "#3b240f", latch: "#c9c9c9" };

const ChestBlock = ({ id, position, facing }: { id: string; position: Position; facing: Facing }) => {
  // Cannon overwrites the mesh's userData with the body's, so it has to be set here.
  const userData: BlockSurfaceUserData = { blockSurface: true, cubeId: id };
  const [x, y, z] = position;
  const [ref] = useBox<Mesh>(() => ({
    type: "Static",
    args: [SIZE, SIZE, SIZE],
    position: [x, y - BOTTOM_OFFSET, z],
    rotation: [0, (facing * Math.PI) / 2, 0],
    userData,
  }));

  // The latch is on the local -z side, which `facing` turns towards the player who placed it.
  return (
    <mesh ref={ref}>
      <boxGeometry args={[SIZE, SIZE, SIZE]} />
      <meshStandardMaterial color={COLORS.body} />
      <mesh position={[0, LID_SEAM_Y, 0]}>
        <boxGeometry args={[SIZE + 0.01, 0.04, SIZE + 0.01]} />
        <meshStandardMaterial color={COLORS.trim} />
      </mesh>
      <mesh position={[0, LID_SEAM_Y, -SIZE / 2 - 0.02]}>
        <boxGeometry args={[0.12, 0.22, 0.04]} />
        <meshStandardMaterial color={COLORS.latch} />
      </mesh>
    </mesh>
  );
};

export default ChestBlock;

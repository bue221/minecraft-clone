import { useBox } from "@react-three/cannon";
import { Mesh } from "three";
import { blockTextures, TextureName } from "../../images/textures";
import type { Position } from "../../world/cube";
import type { BlockSurfaceUserData } from "../../world/blockSurface";

const Cube = ({
  id,
  position,
  texture,
}: {
  id: string;
  position: Position;
  texture: TextureName;
}) => {
  // Cannon overwrites the mesh's userData with the body's, so it has to be set here.
  const userData: BlockSurfaceUserData = { blockSurface: true, cubeId: id };
  const [ref] = useBox<Mesh>(() => ({
    type: "Static",
    position,
    userData,
  }));

  return (
    <mesh ref={ref}>
      <boxBufferGeometry attach="geometry" />
      <meshStandardMaterial transparent map={blockTextures[texture]} attach="material" />
    </mesh>
  );
};

export default Cube;

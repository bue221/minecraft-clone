import { useBox } from "@react-three/cannon";
import { useState } from "react";
import { Mesh } from "three";
import { useStore } from "../../hooks/useStore";
import { blockTextures, TextureName } from "../../images/textures";
import type { Position } from "../../world/cube";

// Same order as BoxGeometry's material groups: +x, -x, +y, -y, +z, -z.
const FACE_NORMALS: Position[] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

const Cube = ({
  id,
  position,
  texture,
}: {
  id: string;
  position: Position;
  texture: TextureName;
}) => {
  const [ref] = useBox<Mesh>(() => ({
    type: "Static",
    position,
  }));
  const [isHovered, setIsHovered] = useState(false);
  const addCube = useStore((state) => state.addCube);
  const removeCube = useStore((state) => state.removeCube);

  return (
    <mesh
      ref={ref}
      onPointerMove={(e) => {
        e.stopPropagation();
        setIsHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setIsHovered(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (e.altKey) {
          removeCube(id);
          return;
        }
        const normal = FACE_NORMALS[Math.floor((e.faceIndex ?? 0) / 2)];
        const [x, y, z] = position;
        addCube(x + normal[0], y + normal[1], z + normal[2]);
      }}
    >
      <boxBufferGeometry attach="geometry" />
      <meshStandardMaterial
        color={isHovered ? "grey" : "white"}
        transparent
        map={blockTextures[texture]}
        attach="material"
      />
    </mesh>
  );
};

export default Cube;

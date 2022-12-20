import { useBox } from "@react-three/cannon";
import { useState } from "react";
import { useStore } from "../../hooks/useStore";
import * as Textures from "../../images/textures";

const Cube = ({
  id,
  position,
  texture,
}: {
  id: number;
  position: [number, number, number];
  texture: any;
}) => {
  const [ref] = useBox(() => ({
    type: "Static",
    position,
  }));
  // states
  const [isHovered, setIsHovered] = useState(false);
  const activeTexture = (Textures as any)[texture + "Texture"];
  // store
  const [addCube, removeCube]: any = useStore<any>((state: any) => [
    state.addCube,
    state.removeCube,
  ]);

  return (
    <mesh
      ref={ref as any}
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
        // listen who is the face to add the cube in this position
        const clickedFace = Math.floor((e?.faceIndex || 0) / 2);
        const { x, y, z } = ref.current?.position as any;
        if (e.altKey) {
          // remove the cube
          removeCube(id);
          return;
        } else {
          // add the cube
          addCube(
            clickedFace === 0 ? x + 1 : clickedFace === 1 ? x - 1 : x,
            clickedFace === 2 ? y + 1 : clickedFace === 3 ? y - 1 : y,
            clickedFace === 4 ? z + 1 : clickedFace === 5 ? z - 1 : z
          );
          return;
        }
      }}
    >
      <boxBufferGeometry attach="geometry" />
      <meshStandardMaterial
        color={isHovered ? "grey" : "white"}
        transparent
        map={activeTexture}
        attach="material"
      />
    </mesh>
  );
};

export default Cube;

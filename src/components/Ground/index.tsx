import { usePlane } from "@react-three/cannon";
import { useState } from "react";
import { useStore } from "../../hooks/useStore";
import { groundTexture } from "../../images/textures";

const Ground = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.5, 0],
  }));

  //This line is important to set good texture
  groundTexture.repeat.set(100, 100);

  //
  const [color, setColor] = useState("red");
  const [addCube]: any = useStore<any>((state: any) => [state.addCube]);

  return (
    <mesh
      ref={ref as any}
      onClick={(e) => {
        e.stopPropagation();
        console.log(e);
        const [x, y, z] = Object.values(e.point).map((n) => Math.ceil(n));
        addCube(x, y, z);
      }}
    >
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <meshStandardMaterial attach="material" map={groundTexture} />
    </mesh>
  );
};

export default Ground;

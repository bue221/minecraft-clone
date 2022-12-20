import { Physics } from "@react-three/cannon";
import { Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
//
import Cubes from "./components/Cubes";
import Fvp from "./components/FVP";
import Ground from "./components/Ground";
import Player from "./components/Player";
import TexturesSelector from "./components/TextureSelector";
// import RotateCubes from "./components/RotateCubes";

const App = () => {
  return (
    <>
      <Canvas>
        <Sky sunPosition={[200, 200, 10]} />
        <ambientLight intensity={0.5} />
        <Fvp />
        <Physics>
          <Cubes />
          <Player />
          <Ground />
        </Physics>
      </Canvas>
      <TexturesSelector />
      <div className="pointer">+</div>
    </>
  );
};

export default App;

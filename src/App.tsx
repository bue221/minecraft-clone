import { Physics } from "@react-three/cannon";
import { Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
//
import BlockInteraction from "./components/BlockInteraction";
import CameraRig from "./components/CameraRig";
import Cubes from "./components/Cubes";
import DeathScreen from "./components/DeathScreen";
import Ground from "./components/Ground";
import HealthBar from "./components/HealthBar";
import Hotbar from "./components/Hotbar";
import HurtOverlay from "./components/HurtOverlay";
import LookControls from "./components/LookControls";
import PauseMenu from "./components/PauseMenu";
import Player from "./components/Player";
import PlayerModel from "./components/PlayerModel";
import PlayerVitals from "./components/PlayerVitals";
import InventoryScreen from "./components/InventoryScreen";
import { selectIsWorldRunning, useSession } from "./hooks/useSession";
// import RotateCubes from "./components/RotateCubes";

const App = () => {
  const isPlaying = useSession((state) => state.isPlaying);
  const isWorldRunning = useSession(selectIsWorldRunning);

  return (
    <>
      <Canvas>
        <Sky sunPosition={[200, 200, 10]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[20, 40, 10]} intensity={0.6} />
        <LookControls />
        <CameraRig />
        <BlockInteraction />
        <PlayerModel />
        <PlayerVitals />
        {/* The player's velocity is set every frame, so friction and bounce would only fight it. */}
        <Physics
          isPaused={!isWorldRunning}
          defaultContactMaterial={{ friction: 0, restitution: 0 }}
        >
          <Cubes />
          <Player />
          <Ground />
        </Physics>
      </Canvas>
      <HurtOverlay />
      {isPlaying && <div className="pointer">+</div>}
      <div className="hud-bottom">
        <HealthBar />
        <Hotbar />
      </div>
      <InventoryScreen />
      <PauseMenu />
      <DeathScreen />
    </>
  );
};

export default App;

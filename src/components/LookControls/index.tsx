import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { useSession } from "../../hooks/useSession";
import { playerState } from "../../player/playerState";

const MOUSE_SENSITIVITY = 0.002;
const MAX_PITCH = Math.PI / 2 - 0.01;

/** Owns the pointer lock lifecycle and turns mouse movement into the player's yaw/pitch. */
const LookControls = () => {
  const canvas = useThree((state) => state.gl.domElement);

  useEffect(() => {
    const { setLockTarget, setPlaying, setLockError } = useSession.getState();
    setLockTarget(canvas);

    const handleLockChange = () => setPlaying(document.pointerLockElement === canvas);
    const handleLockError = () =>
      setLockError("No se pudo capturar el ratón. Espera un segundo y vuelve a intentarlo.");
    const handleMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement !== canvas) return;
      playerState.yaw -= event.movementX * MOUSE_SENSITIVITY;
      playerState.pitch = Math.min(
        MAX_PITCH,
        Math.max(-MAX_PITCH, playerState.pitch - event.movementY * MOUSE_SENSITIVITY)
      );
    };

    document.addEventListener("pointerlockchange", handleLockChange);
    document.addEventListener("pointerlockerror", handleLockError);
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      setLockTarget(null);
      document.removeEventListener("pointerlockchange", handleLockChange);
      document.removeEventListener("pointerlockerror", handleLockError);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [canvas]);

  return null;
};

export default LookControls;

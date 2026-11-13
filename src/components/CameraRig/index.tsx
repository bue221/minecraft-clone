import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { Raycaster, Vector3 } from "three";
import { useSession } from "../../hooks/useSession";
import { getEyePosition, getLookDirection, playerState } from "../../player/playerState";
import { intersectBlockSurface } from "../../world/blockSurface";

const TOGGLE_CAMERA_KEY = "KeyV";
const THIRD_PERSON_DISTANCE = 4;
// Over-the-shoulder offset so the character's head doesn't cover the crosshair.
const SHOULDER_OFFSET = 0.6;
const WALL_MARGIN = 0.2;

const eye = new Vector3();
const look = new Vector3();
const right = new Vector3();
const toCamera = new Vector3();

const CameraRig = () => {
  const raycaster = useMemo(() => new Raycaster(), []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { isPlaying, toggleCameraMode } = useSession.getState();
      if (event.code === TOGGLE_CAMERA_KEY && isPlaying && !event.repeat) toggleCameraMode();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useFrame(({ camera, scene }) => {
    const { yaw, pitch } = playerState;
    getEyePosition(eye);
    camera.rotation.set(pitch, yaw, 0, "YXZ");

    if (useSession.getState().cameraMode === "firstPerson") {
      camera.position.copy(eye);
      return;
    }

    right.set(Math.cos(yaw), 0, -Math.sin(yaw));
    toCamera
      .copy(right)
      .multiplyScalar(SHOULDER_OFFSET)
      .addScaledVector(getLookDirection(look), -THIRD_PERSON_DISTANCE);
    const desiredDistance = toCamera.length();
    toCamera.divideScalar(desiredDistance);

    // Pull the camera in front of any block between it and the player.
    raycaster.set(eye, toCamera);
    raycaster.far = desiredDistance;
    const wall = intersectBlockSurface(raycaster, scene.children);
    const distance = wall ? Math.max(0, wall.distance - WALL_MARGIN) : desiredDistance;
    camera.position.copy(eye).addScaledVector(toCamera, distance);
  });

  return null;
};

export default CameraRig;

import { Euler, Vector3 } from "three";

// Minecraft-like proportions, in blocks.
export const PLAYER_WIDTH = 0.6;
export const PLAYER_HEIGHT = 1.8;
export const PLAYER_EYE_HEIGHT = 1.62;
export const PLAYER_WALK_SPEED = 4.3;
export const PLAYER_SPRINT_SPEED = 5.6;

/**
 * Per-frame player data shared between the physics body, the camera and block
 * interaction. Kept outside React state because it changes every frame.
 */
export const playerState = {
  /** Center of the player's feet. */
  feet: new Vector3(),
  yaw: 0,
  pitch: 0,
};

const lookEuler = new Euler(0, 0, 0, "YXZ");

export const getEyePosition = (out: Vector3): Vector3 =>
  out.copy(playerState.feet).setY(playerState.feet.y + PLAYER_EYE_HEIGHT);

export const getLookDirection = (out: Vector3): Vector3 =>
  out
    .set(0, 0, -1)
    .applyEuler(lookEuler.set(playerState.pitch, playerState.yaw, 0));

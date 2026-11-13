import { useCompoundBody } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Mesh, Object3D, Vector3 } from "three";
import { useHealth } from "../../hooks/useHealth";
import { useKeyboard } from "../../hooks/useKeyboard";
import { useSession } from "../../hooks/useSession";
import { useStore } from "../../hooks/useStore";
import { fallDamage } from "../../player/health";
import {
  PLAYER_HEIGHT,
  PLAYER_SPRINT_SPEED,
  PLAYER_WALK_SPEED,
  PLAYER_WIDTH,
  playerState,
} from "../../player/playerState";
import { findSpawnFeet } from "../../player/spawn";

const JUMP_SPEED = 5;
// Contact normals with a vertical component above this count as "standing on" a body.
const MIN_GROUND_NORMAL_Y = 0.5;

// A stack of spheres approximates a capsule that fits through 1-block gaps.
const BODY_RADIUS = PLAYER_WIDTH / 2;
const BODY_SPHERE_HEIGHTS = [
  BODY_RADIUS,
  PLAYER_HEIGHT / 2,
  PLAYER_HEIGHT - BODY_RADIUS,
];

const UP = new Vector3(0, 1, 0);

const Player = () => {
  const { moveBackward, moveForward, moveLeft, moveRight, jump, sprint } =
    useKeyboard();

  // Cannon only reports "collide" on the first contact, so supports are tracked
  // from that event until the matching "collideEnd".
  const supports = useRef(new Set<Object3D>());
  const [ref, api] = useCompoundBody<Mesh>(() => ({
    mass: 1,
    fixedRotation: true,
    position: findSpawnFeet(useStore.getState().cubes),
    shapes: BODY_SPHERE_HEIGHTS.map((height) => ({
      type: "Sphere" as const,
      args: [BODY_RADIUS],
      position: [0, height, 0] as [number, number, number],
    })),
    onCollide: ({ body, contact }) => {
      if (contact.contactNormal[1] > MIN_GROUND_NORMAL_Y) {
        supports.current.add(body);
      }
    },
    onCollideEnd: ({ body }) => {
      supports.current.delete(body);
    },
  }));

  useEffect(
    () => api.position.subscribe(([x, y, z]) => playerState.feet.set(x, y, z)),
    [api.position]
  );

  const vel = useRef([0, 0, 0]);
  useEffect(() => api.velocity.subscribe((v) => (vel.current = v)), [api.velocity]);

  // A removed cube's "collideEnd" arrives after its ref is gone and can't be matched,
  // so supports whose mesh left the scene are pruned here.
  const isGrounded = () => {
    for (const support of supports.current) {
      if (support.parent) return true;
      supports.current.delete(support);
    }
    return false;
  };

  // Highest feet height since leaving the ground; landing turns the drop into fall damage.
  const fallPeak = useRef<number | null>(null);
  const trackFall = (grounded: boolean) => {
    const { y } = playerState.feet;
    if (!grounded) {
      fallPeak.current = Math.max(fallPeak.current ?? y, y);
      return;
    }
    if (fallPeak.current !== null) {
      useHealth.getState().damage(fallDamage(fallPeak.current - y), "fall");
      fallPeak.current = null;
    }
  };

  useEffect(
    () =>
      useHealth.subscribe((state, previous) => {
        if (state.lifeId === previous.lifeId) return;
        const spawn = findSpawnFeet(useStore.getState().cubes);
        api.position.set(...spawn);
        api.velocity.set(0, 0, 0);
        playerState.feet.set(...spawn);
        supports.current.clear();
        fallPeak.current = null;
      }),
    [api]
  );

  const moveDirection = useRef(new Vector3());
  useFrame(() => {
    const { isPlaying } = useSession.getState();
    const grounded = isGrounded();
    trackFall(grounded);
    const forward = isPlaying ? Number(moveForward) - Number(moveBackward) : 0;
    const side = isPlaying ? Number(moveRight) - Number(moveLeft) : 0;
    const speed = sprint && forward > 0 ? PLAYER_SPRINT_SPEED : PLAYER_WALK_SPEED;

    const direction = moveDirection.current
      .set(side, 0, -forward)
      .normalize()
      .multiplyScalar(speed)
      .applyAxisAngle(UP, playerState.yaw);

    const verticalSpeed = isPlaying && jump && grounded ? JUMP_SPEED : vel.current[1];
    api.velocity.set(direction.x, verticalSpeed, direction.z);
  });

  return <mesh ref={ref} />;
};

export default Player;

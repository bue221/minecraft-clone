import { useFrame } from "@react-three/fiber";
import { ReactNode, Ref, useRef } from "react";
import { Group, MathUtils, Vector3 } from "three";
import { useSession } from "../../hooks/useSession";
import { PLAYER_HEIGHT, PLAYER_WALK_SPEED, playerState } from "../../player/playerState";

// Minecraft's player model is 32 "pixels" tall; scale it to the physics body height.
const PX = PLAYER_HEIGHT / 32;

const COLORS = {
  skin: "#c8956d",
  hair: "#3b2414",
  eyes: "#2f3ea8",
  shirt: "#2fa7a7",
  pants: "#3a3fa0",
  shoes: "#4a4a4a",
};

const MAX_SWING = 0.9;
const SWING_RADIANS_PER_BLOCK = 2.6;
const SPEED_SMOOTHING = 12;

type Vec3 = [number, number, number];

/** A box sized and positioned in model pixels. */
const Part = ({ size, at = [0, 0, 0], color }: { size: Vec3; at?: Vec3; color: string }) => (
  <mesh position={at.map((n) => n * PX) as Vec3}>
    <boxGeometry args={size.map((n) => n * PX) as Vec3} />
    <meshStandardMaterial color={color} />
  </mesh>
);

/** Groups rotate around their pivot, e.g. the shoulder or the hip. */
const Pivot = ({ at, pivotRef, children }: { at: Vec3; pivotRef?: Ref<Group>; children: ReactNode }) => (
  <group ref={pivotRef} position={at.map((n) => n * PX) as Vec3}>
    {children}
  </group>
);

const previousFeet = new Vector3();

const PlayerModel = () => {
  const isVisible = useSession((state) => state.cameraMode === "thirdPerson");
  const root = useRef<Group>(null);
  const head = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const leftLeg = useRef<Group>(null);
  const rightLeg = useRef<Group>(null);
  const smoothedSpeed = useRef(0);
  const walkPhase = useRef(0);

  useFrame((_, delta) => {
    if (!root.current || delta <= 0) return;
    const { feet, yaw, pitch } = playerState;

    // Physics positions arrive at their own rate, so speed is smoothed to avoid jittery limbs.
    // Jumps of more than a block in one frame are spawns or teleports, not walking.
    const step = Math.hypot(feet.x - previousFeet.x, feet.z - previousFeet.z);
    const horizontalSpeed = step > 1 ? 0 : step / delta;
    previousFeet.copy(feet);
    smoothedSpeed.current = MathUtils.damp(smoothedSpeed.current, horizontalSpeed, SPEED_SMOOTHING, delta);
    walkPhase.current += smoothedSpeed.current * SWING_RADIANS_PER_BLOCK * delta;

    const walkAmount = Math.min(smoothedSpeed.current / PLAYER_WALK_SPEED, 1);
    const swing = Math.sin(walkPhase.current) * MAX_SWING * walkAmount;

    root.current.position.copy(feet);
    root.current.rotation.y = yaw;
    head.current?.rotation.set(pitch, 0, 0);
    rightArm.current?.rotation.set(swing, 0, 0);
    leftArm.current?.rotation.set(-swing, 0, 0);
    rightLeg.current?.rotation.set(-swing, 0, 0);
    leftLeg.current?.rotation.set(swing, 0, 0);
  });

  // The model faces -z, like the camera at yaw 0.
  return (
    <group ref={root} visible={isVisible}>
      <Pivot at={[-2, 12, 0]} pivotRef={leftLeg}>
        <Part size={[4, 10, 4]} at={[0, -5, 0]} color={COLORS.pants} />
        <Part size={[4, 2, 4]} at={[0, -11, 0]} color={COLORS.shoes} />
      </Pivot>
      <Pivot at={[2, 12, 0]} pivotRef={rightLeg}>
        <Part size={[4, 10, 4]} at={[0, -5, 0]} color={COLORS.pants} />
        <Part size={[4, 2, 4]} at={[0, -11, 0]} color={COLORS.shoes} />
      </Pivot>

      <Part size={[8, 12, 4]} at={[0, 18, 0]} color={COLORS.shirt} />

      <Pivot at={[-6, 22, 0]} pivotRef={leftArm}>
        <Part size={[4, 4, 4]} at={[0, 0, 0]} color={COLORS.shirt} />
        <Part size={[4, 8, 4]} at={[0, -6, 0]} color={COLORS.skin} />
      </Pivot>
      <Pivot at={[6, 22, 0]} pivotRef={rightArm}>
        <Part size={[4, 4, 4]} at={[0, 0, 0]} color={COLORS.shirt} />
        <Part size={[4, 8, 4]} at={[0, -6, 0]} color={COLORS.skin} />
      </Pivot>

      <Pivot at={[0, 24, 0]} pivotRef={head}>
        <Part size={[8, 8, 8]} at={[0, 4, 0]} color={COLORS.skin} />
        <Part size={[8.4, 2.4, 8.4]} at={[0, 7.4, 0]} color={COLORS.hair} />
        <Part size={[8.4, 6, 1]} at={[0, 5, 4]} color={COLORS.hair} />
        <Part size={[1.6, 1.2, 0.2]} at={[-2, 4, -4.1]} color={COLORS.eyes} />
        <Part size={[1.6, 1.2, 0.2]} at={[2, 4, -4.1]} color={COLORS.eyes} />
      </Pivot>
    </group>
  );
};

export default PlayerModel;

import { Line } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { ElementRef, useEffect, useMemo, useRef } from "react";
import { Intersection, Raycaster, Vector3 } from "three";
import { selectSelectedItem, useInventory } from "../../hooks/useInventory";
import { useSession } from "../../hooks/useSession";
import { useStore } from "../../hooks/useStore";
import { getEyePosition, PLAYER_HEIGHT, PLAYER_WIDTH, playerState } from "../../player/playerState";
import { BlockSurfaceUserData, intersectBlockSurface } from "../../world/blockSurface";
import {
  cellIntersectsBox,
  facingTowardsViewer,
  Position,
  toGridPosition,
} from "../../world/cube";

const REACH_DISTANCE = 5;
const OUTLINE_LINE_WIDTH = 2;

// A single continuous stroke over all 12 cube edges (4 of them are traced twice),
// because this drei version's <Line> can't draw disjoint segments.
const h = 0.502;
const OUTLINE_PATH: Position[] = [
  [-h, -h, -h], [h, -h, -h], [h, -h, h], [-h, -h, h], [-h, -h, -h],
  [-h, h, -h], [h, h, -h], [h, h, h], [-h, h, h], [-h, h, -h],
  [h, h, -h], [h, -h, -h], [h, h, -h], [h, h, h], [h, -h, h],
  [h, h, h], [-h, h, h], [-h, -h, h],
];

interface BlockTarget {
  cubeId: string | null;
  cell: Position | null;
  placeAt: Position | null;
}

const NO_TARGET: BlockTarget = { cubeId: null, cell: null, placeAt: null };

const eye = new Vector3();
const aimDirection = new Vector3();
const cameraToEye = new Vector3();
const worldNormal = new Vector3();
const offsetPoint = new Vector3();

const cellAlongNormal = (hit: Intersection, offset: number): Position | null => {
  offsetPoint.copy(hit.point).addScaledVector(worldNormal, offset);
  return toGridPosition(offsetPoint.x, offsetPoint.y, offsetPoint.z);
};

const toTarget = (hit: Intersection): BlockTarget => {
  if (!hit.face) return NO_TARGET;
  worldNormal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld);
  const { cubeId } = hit.object.userData as BlockSurfaceUserData;
  return {
    cubeId: cubeId ?? null,
    cell: cubeId ? cellAlongNormal(hit, -0.5) : null,
    placeAt: cellAlongNormal(hit, 0.5),
  };
};

const overlapsPlayer = (cell: Position): boolean => {
  const { feet } = playerState;
  const halfWidth = PLAYER_WIDTH / 2;
  return cellIntersectsBox(
    cell,
    [feet.x - halfWidth, feet.y, feet.z - halfWidth],
    [feet.x + halfWidth, feet.y + PLAYER_HEIGHT, feet.z + halfWidth]
  );
};

/**
 * Finds the block under the crosshair each frame, outlines it, and breaks/places blocks on click.
 * The ray starts at the camera so the crosshair stays accurate in third person, but reach is
 * measured from the player's eyes and anything between the camera and the player is ignored.
 */
const BlockInteraction = () => {
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const canvas = useThree((state) => state.gl.domElement);
  const addCube = useStore((state) => state.addCube);
  const removeCube = useStore((state) => state.removeCube);

  const target = useRef<BlockTarget>(NO_TARGET);
  const outline = useRef<ElementRef<typeof Line>>(null);
  const raycaster = useMemo(() => new Raycaster(), []);

  useFrame(() => {
    let next = NO_TARGET;
    if (useSession.getState().isPlaying) {
      getEyePosition(eye);
      aimDirection.set(0, 0, -1).applyQuaternion(camera.quaternion);
      const eyeDepth = Math.max(0, cameraToEye.subVectors(eye, camera.position).dot(aimDirection));
      raycaster.set(camera.position, aimDirection);
      raycaster.near = eyeDepth;
      raycaster.far = eyeDepth + REACH_DISTANCE;

      const hit = intersectBlockSurface(raycaster, scene.children);
      if (hit && hit.point.distanceTo(eye) <= REACH_DISTANCE) next = toTarget(hit);
    }
    target.current = next;

    if (outline.current) {
      outline.current.visible = next.cell !== null;
      if (next.cell) outline.current.position.set(...next.cell);
    }
  });

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (document.pointerLockElement !== canvas) return;
      const { cubeId, placeAt } = target.current;
      if (event.button === 0 && cubeId) removeCube(cubeId);
      if (event.button !== 2) return;

      // Like Minecraft, right-clicking a chest opens it; holding Shift places a block against it instead.
      const targetIsChest = useStore.getState().cubes.some((cube) => cube.id === cubeId && cube.type === "chest");
      if (cubeId && targetIsChest && !event.shiftKey) {
        useInventory.getState().ensureChest(cubeId);
        useSession.getState().showScreen({ kind: "chest", chestId: cubeId });
        return;
      }

      const item = selectSelectedItem(useInventory.getState());
      if (!item || !placeAt || overlapsPlayer(placeAt)) return;
      addCube(placeAt, item, item === "chest" ? facingTowardsViewer(playerState.yaw) : undefined);
    };
    const preventContextMenu = (event: MouseEvent) => event.preventDefault();

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("contextmenu", preventContextMenu);
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("contextmenu", preventContextMenu);
    };
  }, [canvas, addCube, removeCube]);

  return (
    <Line
      ref={outline}
      points={OUTLINE_PATH}
      color="black"
      lineWidth={OUTLINE_LINE_WIDTH}
      raycast={() => null}
    />
  );
};

export default BlockInteraction;

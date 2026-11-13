import type { ItemId } from "../inventory/items";

export type Position = [number, number, number];

/** Quarter turns around the vertical axis, 0-3. Only chests use it. */
export type Facing = 0 | 1 | 2 | 3;

export interface Cube {
  id: string;
  pos: Position;
  type: ItemId;
  facing?: Facing;
}

export const positionKey = ([x, y, z]: Position): string => `${x},${y},${z}`;

/** Whether the unit cell centered at `cell` overlaps the box [min, max] (touching faces don't count). */
export const cellIntersectsBox = (cell: Position, min: Position, max: Position): boolean =>
  cell.every((center, axis) => center + 0.5 > min[axis] && center - 0.5 < max[axis]);

/** Facing whose front side looks back at a viewer with the given yaw. */
export const facingTowardsViewer = (viewerYaw: number): Facing => {
  const quarterTurns = Math.round((viewerYaw + Math.PI) / (Math.PI / 2));
  return (((quarterTurns % 4) + 4) % 4) as Facing;
};

export const toGridPosition = (x: number, y: number, z: number): Position | null => {
  const coords = [x, y, z];
  if (!coords.every(Number.isFinite)) return null;
  return coords.map(Math.round) as Position;
};

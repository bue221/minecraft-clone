import type { Cube, Position } from "../world/cube";

const SPAWN_COLUMN = { x: 0, z: 0 };
const GROUND_TOP = -0.5;
const SPAWN_CLEARANCE = 0.1;

/** Feet position on top of the highest block in the spawn column, so the player never spawns inside a block. */
export const findSpawnFeet = (cubes: Cube[]): Position => {
  const topOfColumn = cubes
    .filter(({ pos: [x, , z] }) => x === SPAWN_COLUMN.x && z === SPAWN_COLUMN.z)
    .reduce((top, { pos: [, y] }) => Math.max(top, y + 0.5), GROUND_TOP);
  return [SPAWN_COLUMN.x, topOfColumn + SPAWN_CLEARANCE, SPAWN_COLUMN.z];
};

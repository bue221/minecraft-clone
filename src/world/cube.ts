import type { TextureName } from "../images/textures";

export type Position = [number, number, number];

export interface Cube {
  id: string;
  pos: Position;
  texture: TextureName;
}

export const positionKey = ([x, y, z]: Position): string => `${x},${y},${z}`;

export const toGridPosition = (x: number, y: number, z: number): Position | null => {
  const coords = [x, y, z];
  if (!coords.every(Number.isFinite)) return null;
  return coords.map(Math.round) as Position;
};

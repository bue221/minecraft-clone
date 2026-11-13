import { isItemId } from "../inventory/items";
import { readJson, writeJson } from "../storage/localJson";
import { Cube, Facing, Position, positionKey } from "./cube";

const STORAGE_KEY = "minecraft-clone:world";
const STORAGE_VERSION = 2;

const isGridPosition = (value: unknown): value is Position =>
  Array.isArray(value) && value.length === 3 && value.every(Number.isInteger);

const isFacing = (value: unknown): value is Facing =>
  value === 0 || value === 1 || value === 2 || value === 3;

/** Version 1 stored the block type as `texture`; version 2 calls it `type` and adds `facing`. */
const toCube = (value: unknown, version: number): Cube | null => {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Record<string, unknown>;
  const type = version === 1 ? candidate.texture : candidate.type;
  if (typeof candidate.id !== "string" || !isGridPosition(candidate.pos) || !isItemId(type)) {
    return null;
  }
  return {
    id: candidate.id,
    pos: candidate.pos,
    type,
    ...(isFacing(candidate.facing) ? { facing: candidate.facing } : {}),
  };
};

/**
 * Throws on an unknown format version; silently drops individual invalid or
 * duplicated cubes so one bad entry doesn't wipe the world.
 */
export const parseSavedCubes = (data: unknown): Cube[] => {
  const { version, cubes } = (data ?? {}) as { version?: unknown; cubes?: unknown };
  if ((version !== 1 && version !== STORAGE_VERSION) || !Array.isArray(cubes)) {
    throw new Error(`Unsupported saved world format (version ${String(version)})`);
  }

  const occupied = new Set<string>();
  return cubes.flatMap((value: unknown) => {
    const cube = toCube(value, version);
    if (!cube) return [];
    const key = positionKey(cube.pos);
    if (occupied.has(key)) return [];
    occupied.add(key);
    return [cube];
  });
};

export const loadCubes = (): Cube[] => readJson(STORAGE_KEY, parseSavedCubes, []);

export const saveCubes = (cubes: Cube[]): void =>
  writeJson(STORAGE_KEY, { version: STORAGE_VERSION, cubes });

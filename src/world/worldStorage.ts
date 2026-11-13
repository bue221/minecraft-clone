import { isTextureName } from "../images/textures";
import { Cube, Position, positionKey } from "./cube";

const STORAGE_KEY = "minecraft-clone:world";
const STORAGE_VERSION = 1;

const isGridPosition = (value: unknown): value is Position =>
  Array.isArray(value) && value.length === 3 && value.every(Number.isInteger);

const isCube = (value: unknown): value is Cube => {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    isGridPosition(candidate.pos) &&
    isTextureName(candidate.texture)
  );
};

/**
 * Throws on malformed JSON or an unknown format version; silently drops
 * individual invalid or duplicated cubes so one bad entry doesn't wipe the world.
 */
export const parseSavedCubes = (serialized: string): Cube[] => {
  const data = JSON.parse(serialized);
  if (data?.version !== STORAGE_VERSION || !Array.isArray(data.cubes)) {
    throw new Error(`Unsupported saved world format (version ${data?.version})`);
  }

  const occupied = new Set<string>();
  return data.cubes.filter((value: unknown) => {
    if (!isCube(value)) return false;
    const key = positionKey(value.pos);
    if (occupied.has(key)) return false;
    occupied.add(key);
    return true;
  });
};

export const loadCubes = (): Cube[] => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    return serialized === null ? [] : parseSavedCubes(serialized);
  } catch (error) {
    console.warn("[worldStorage] Could not load the saved world, starting empty", error);
    return [];
  }
};

export const saveCubes = (cubes: Cube[]): void => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: STORAGE_VERSION, cubes })
    );
  } catch (error) {
    console.error("[worldStorage] Could not save the world", error);
  }
};

import { readJson, writeJson } from "../storage/localJson";
import {
  ContainerId,
  Containers,
  containerSize,
  DEFAULT_CONTAINERS,
  HOTBAR_SIZE,
  isChestContainerId,
  isValidSlots,
} from "./containers";

const STORAGE_KEY = "minecraft-clone:inventory";
const STORAGE_VERSION = 1;

export interface SavedInventory {
  containers: Containers;
  selectedSlot: number;
}

const DEFAULT_INVENTORY: SavedInventory = { containers: DEFAULT_CONTAINERS, selectedSlot: 0 };

/** Invalid containers fall back to their defaults (or are dropped, for chests) one by one. */
export const parseSavedInventory = (data: unknown): SavedInventory => {
  const { version, containers, selectedSlot } = (data ?? {}) as Record<string, unknown>;
  if (version !== STORAGE_VERSION || typeof containers !== "object" || containers === null) {
    throw new Error(`Unsupported saved inventory format (version ${String(version)})`);
  }

  const parsed: Containers = { ...DEFAULT_CONTAINERS };
  for (const [id, slots] of Object.entries(containers)) {
    const isKnown = id === "hotbar" || id === "backpack" || isChestContainerId(id);
    if (isKnown && isValidSlots(slots, containerSize(id as ContainerId))) {
      parsed[id as ContainerId] = slots;
    }
  }

  const isValidSelection =
    Number.isInteger(selectedSlot) && (selectedSlot as number) >= 0 && (selectedSlot as number) < HOTBAR_SIZE;
  return { containers: parsed, selectedSlot: isValidSelection ? (selectedSlot as number) : 0 };
};

export const loadInventory = (): SavedInventory =>
  readJson(STORAGE_KEY, parseSavedInventory, DEFAULT_INVENTORY);

export const saveInventory = ({ containers, selectedSlot }: SavedInventory): void =>
  writeJson(STORAGE_KEY, { version: STORAGE_VERSION, containers, selectedSlot });

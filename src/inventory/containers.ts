import { isItemId, ItemId } from "./items";

export type Slot = ItemId | null;

export const HOTBAR_SIZE = 9;
export const BACKPACK_SIZE = 27;
export const CHEST_SIZE = 27;

export type ContainerId = "hotbar" | "backpack" | `chest:${string}`;
export type Containers = Partial<Record<ContainerId, Slot[]>>;

export const chestContainerId = (cubeId: string): ContainerId => `chest:${cubeId}`;
export const isChestContainerId = (id: string): id is `chest:${string}` => id.startsWith("chest:");

export const emptySlots = (size: number): Slot[] => Array.from({ length: size }, () => null);

export const DEFAULT_CONTAINERS: Containers = {
  hotbar: ["dirt", "grass", "glass", "wood", "log", "chest", null, null, null],
  backpack: emptySlots(BACKPACK_SIZE),
};

export const containerSize = (id: ContainerId): number =>
  id === "hotbar" ? HOTBAR_SIZE : id === "backpack" ? BACKPACK_SIZE : CHEST_SIZE;

export const isValidSlots = (value: unknown, size: number): value is Slot[] =>
  Array.isArray(value) &&
  value.length === size &&
  value.every((slot) => slot === null || isItemId(slot));

/** Swapping the held item with a slot covers picking up, putting down and exchanging items. */
export const clickSlot = (
  containers: Containers,
  held: Slot,
  id: ContainerId,
  index: number
): { containers: Containers; held: Slot } => {
  const slots = containers[id];
  if (!slots || index < 0 || index >= slots.length || (held === null && slots[index] === null)) {
    return { containers, held };
  }
  const next = [...slots];
  next[index] = held;
  return { containers: { ...containers, [id]: next }, held: slots[index] };
};

/** Puts the held item in the first free hotbar or backpack slot; discards it if both are full. */
export const stashHeld = (containers: Containers, held: Slot): Containers => {
  if (held === null) return containers;
  for (const id of ["hotbar", "backpack"] as const) {
    const slots = containers[id];
    const freeIndex = slots?.indexOf(null) ?? -1;
    if (slots && freeIndex >= 0) {
      const next = [...slots];
      next[freeIndex] = held;
      return { ...containers, [id]: next };
    }
  }
  return containers;
};

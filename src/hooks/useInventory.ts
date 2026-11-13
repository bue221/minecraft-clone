import create from "zustand";
import {
  chestContainerId,
  ContainerId,
  Containers,
  clickSlot,
  CHEST_SIZE,
  emptySlots,
  HOTBAR_SIZE,
  isChestContainerId,
  Slot,
  stashHeld,
} from "../inventory/containers";
import { loadInventory, saveInventory } from "../inventory/inventoryStorage";
import type { ItemId } from "../inventory/items";
import type { Cube } from "../world/cube";
import { useStore } from "./useStore";

interface InventoryState {
  containers: Containers;
  /** Item picked up with the mouse in an inventory screen. */
  held: Slot;
  selectedSlot: number;
  selectSlot: (index: number) => void;
  clickSlot: (id: ContainerId, index: number) => void;
  takeFromCatalog: (item: ItemId) => void;
  stashHeld: () => void;
  ensureChest: (cubeId: string) => void;
}

/** Chest contents only live as long as their chest block does. */
const withoutMissingChests = (containers: Containers, cubes: Cube[]): Containers => {
  const chestIds = new Set(cubes.filter((cube) => cube.type === "chest").map((cube) => chestContainerId(cube.id)));
  const entries = Object.entries(containers).filter(([id]) => !isChestContainerId(id) || chestIds.has(id as ContainerId));
  return entries.length === Object.keys(containers).length ? containers : Object.fromEntries(entries);
};

const saved = loadInventory();

export const useInventory = create<InventoryState>()((set) => ({
  containers: withoutMissingChests(saved.containers, useStore.getState().cubes),
  held: null,
  selectedSlot: saved.selectedSlot,
  selectSlot: (index) => set({ selectedSlot: ((index % HOTBAR_SIZE) + HOTBAR_SIZE) % HOTBAR_SIZE }),
  clickSlot: (id, index) => set((state) => clickSlot(state.containers, state.held, id, index)),
  takeFromCatalog: (item) => set({ held: item }),
  stashHeld: () => set((state) => ({ containers: stashHeld(state.containers, state.held), held: null })),
  ensureChest: (cubeId) =>
    set((state) => {
      const id = chestContainerId(cubeId);
      return state.containers[id] ? state : { containers: { ...state.containers, [id]: emptySlots(CHEST_SIZE) } };
    }),
}));

export const selectSelectedItem = (state: InventoryState): Slot =>
  state.containers.hotbar?.[state.selectedSlot] ?? null;

useStore.subscribe((world, previousWorld) => {
  if (world.cubes === previousWorld.cubes) return;
  const { containers } = useInventory.getState();
  const pruned = withoutMissingChests(containers, world.cubes);
  if (pruned !== containers) useInventory.setState({ containers: pruned });
});

useInventory.subscribe((state, previous) => {
  if (state.containers !== previous.containers || state.selectedSlot !== previous.selectedSlot) {
    saveInventory({ containers: state.containers, selectedSlot: state.selectedSlot });
  }
});

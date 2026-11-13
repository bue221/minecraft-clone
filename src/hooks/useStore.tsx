import { nanoid } from "nanoid";
import create from "zustand";
import type { ItemId } from "../inventory/items";
import { Cube, Facing, Position, positionKey, toGridPosition } from "../world/cube";
import { loadCubes, saveCubes } from "../world/worldStorage";

interface WorldState {
  cubes: Cube[];
  addCube: (position: Position, type: ItemId, facing?: Facing) => void;
  removeCube: (id: string) => void;
  resetWorld: () => void;
}

export const useStore = create<WorldState>()((set) => ({
  cubes: loadCubes(),
  addCube: ([x, y, z], type, facing) => {
    const pos = toGridPosition(x, y, z);
    if (!pos) {
      console.warn("[world] Ignoring cube with invalid position", { x, y, z });
      return;
    }

    set((state) => {
      const key = positionKey(pos);
      if (state.cubes.some((cube) => positionKey(cube.pos) === key)) {
        return state;
      }
      const cube: Cube = { id: nanoid(), pos, type, ...(facing === undefined ? {} : { facing }) };
      return { cubes: [...state.cubes, cube] };
    });
  },
  removeCube: (id) => {
    set((state) => ({
      cubes: state.cubes.filter((cube) => cube.id !== id),
    }));
  },
  resetWorld: () => {
    set({ cubes: [] });
  },
}));

useStore.subscribe((state, previousState) => {
  if (state.cubes !== previousState.cubes) saveCubes(state.cubes);
});

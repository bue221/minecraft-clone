import { nanoid } from "nanoid";
import create from "zustand";
import type { TextureName } from "../images/textures";
import { Cube, positionKey, toGridPosition } from "../world/cube";
import { loadCubes, saveCubes } from "../world/worldStorage";

interface WorldState {
  texture: TextureName;
  cubes: Cube[];
  addCube: (x: number, y: number, z: number) => void;
  removeCube: (id: string) => void;
  setTexture: (texture: TextureName) => void;
  resetWorld: () => void;
}

export const useStore = create<WorldState>()((set) => ({
  texture: "wood",
  cubes: loadCubes(),
  addCube: (x, y, z) => {
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
      return {
        cubes: [...state.cubes, { id: nanoid(), pos, texture: state.texture }],
      };
    });
  },
  removeCube: (id) => {
    set((state) => ({
      cubes: state.cubes.filter((cube) => cube.id !== id),
    }));
  },
  setTexture: (texture) => {
    set({ texture });
  },
  resetWorld: () => {
    set({ cubes: [] });
  },
}));

useStore.subscribe((state, previousState) => {
  if (state.cubes !== previousState.cubes) saveCubes(state.cubes);
});

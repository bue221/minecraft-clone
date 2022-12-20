import { nanoid } from "nanoid";
import create from "zustand";

export const useStore = create((set) => ({
  texture: "wood",
  cubes: [],
  addCube: (x: number, y: number, z: number) => {
    set((state: any) => ({
      cubes: [
        ...state.cubes,
        {
          id: nanoid(),
          pos: [x, y, z],
          texture: state.texture,
        },
      ],
    }));
  },
  removeCube: (id: any) => {
    set((state: any) => ({
      cubes: state.cubes.filter((cube: any) => cube.id !== id),
    }));
  },
  setTexture: (texture: string) => {
    set(() => ({ texture }));
  },
  saveWorld: () => {},
  resetWorld: () => {},
}));

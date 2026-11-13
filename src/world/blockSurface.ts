import type { Intersection, Object3D, Raycaster } from "three";

/** Meshes that block the camera and that blocks can be placed against; cubes also set `cubeId`. */
export interface BlockSurfaceUserData {
  blockSurface: true;
  cubeId?: string;
}

export const intersectBlockSurface = (
  raycaster: Raycaster,
  objects: Object3D[]
): Intersection | undefined =>
  raycaster
    .intersectObjects(objects, true)
    .find((hit) => (hit.object.userData as Partial<BlockSurfaceUserData>).blockSurface);

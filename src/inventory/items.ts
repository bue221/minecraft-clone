import { blockLabels, isTextureName, TEXTURE_NAMES, TextureName } from "../images/textures";

/** Everything that can be placed in the world. Textured cubes plus special blocks. */
export const ITEM_IDS = [...TEXTURE_NAMES, "chest"] as const;
export type ItemId = (typeof ITEM_IDS)[number];

export const isItemId = (value: unknown): value is ItemId =>
  ITEM_IDS.includes(value as ItemId);

export const isTexturedBlock = (item: ItemId): item is TextureName => isTextureName(item);

const SPECIAL_LABELS: Record<Exclude<ItemId, TextureName>, string> = {
  chest: "Baúl",
};

export const itemLabel = (item: ItemId): string =>
  isTexturedBlock(item) ? blockLabels[item] : SPECIAL_LABELS[item];

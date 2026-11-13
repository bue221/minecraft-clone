import { grassImg, dirtImg, logImg, glassImg, woodImg } from "./images.js";

import {
  NearestFilter,
  RepeatWrapping,
  Texture,
  TextureLoader,
} from "three";

export const TEXTURE_NAMES = ["dirt", "grass", "glass", "wood", "log"] as const;
export type TextureName = (typeof TEXTURE_NAMES)[number];

export const isTextureName = (value: unknown): value is TextureName =>
  TEXTURE_NAMES.includes(value as TextureName);

export const blockLabels: Record<TextureName, string> = {
  dirt: "Tierra",
  grass: "Césped",
  glass: "Vidrio",
  wood: "Madera",
  log: "Tronco",
};

export const blockImages: Record<TextureName, string> = {
  dirt: dirtImg,
  grass: grassImg,
  glass: glassImg,
  wood: woodImg,
  log: logImg,
};

const loader = new TextureLoader();

const loadPixelTexture = (src: string): Texture => {
  const texture = loader.load(src, undefined, undefined, (error) => {
    console.error(`[textures] Failed to load texture "${src}"`, error);
  });
  texture.magFilter = NearestFilter;
  return texture;
};

export const blockTextures = Object.fromEntries(
  TEXTURE_NAMES.map((name) => [name, loadPixelTexture(blockImages[name])])
) as Record<TextureName, Texture>;

export const groundTexture = loadPixelTexture(grassImg);
groundTexture.wrapS = RepeatWrapping;
groundTexture.wrapT = RepeatWrapping;

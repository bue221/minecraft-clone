export const MAX_HEALTH = 20;

export const SAFE_FALL_DISTANCE = 3;
// Physics never lands exactly on whole numbers, so a 3-block drop must not round up to 1 damage.
const FALL_TOLERANCE = 0.05;

export const VOID_HEIGHT = -20;
export const VOID_DAMAGE = 4;
export const VOID_DAMAGE_INTERVAL = 0.5;

export const REGEN_DELAY = 5;
export const REGEN_INTERVAL = 3;

/** Minecraft rule: one point of damage per block fallen beyond the first three. */
export const fallDamage = (fallDistance: number): number =>
  Math.max(0, Math.ceil(fallDistance - SAFE_FALL_DISTANCE - FALL_TOLERANCE));

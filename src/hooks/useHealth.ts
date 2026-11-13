import create from "zustand";
import { MAX_HEALTH } from "../player/health";

export type DamageCause = "fall" | "void";

interface HealthState {
  health: number;
  /** Changes on every hit so the HUD can replay its hurt animation. */
  lastHit: { id: number; cause: DamageCause } | null;
  deathCause: DamageCause | null;
  /** Increments on every respawn; the physics body teleports when it changes. */
  lifeId: number;
  damage: (amount: number, cause: DamageCause) => void;
  heal: (amount: number) => void;
  respawn: () => void;
}

export const useHealth = create<HealthState>()((set) => ({
  health: MAX_HEALTH,
  lastHit: null,
  deathCause: null,
  lifeId: 0,
  damage: (amount, cause) =>
    set((state) => {
      if (amount <= 0 || state.health <= 0) return state;
      const health = Math.max(0, state.health - amount);
      return {
        health,
        lastHit: { id: (state.lastHit?.id ?? 0) + 1, cause },
        deathCause: health === 0 ? cause : null,
      };
    }),
  heal: (amount) =>
    set((state) =>
      state.health <= 0 ? state : { health: Math.min(MAX_HEALTH, state.health + amount) }
    ),
  respawn: () =>
    set((state) => ({
      health: MAX_HEALTH,
      lastHit: null,
      deathCause: null,
      lifeId: state.lifeId + 1,
    })),
}));

export const selectIsDead = (state: HealthState) => state.health <= 0;

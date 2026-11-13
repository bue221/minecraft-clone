import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useHealth } from "../../hooks/useHealth";
import { selectIsWorldRunning, useSession } from "../../hooks/useSession";
import {
  MAX_HEALTH,
  REGEN_DELAY,
  REGEN_INTERVAL,
  VOID_DAMAGE,
  VOID_DAMAGE_INTERVAL,
  VOID_HEIGHT,
} from "../../player/health";
import { playerState } from "../../player/playerState";

/** Time-based health rules: damage in the void and slow regeneration. Timers stop while paused. */
const PlayerVitals = () => {
  const secondsSinceHit = useRef(0);
  const regenTimer = useRef(0);
  const voidTimer = useRef(0);

  useEffect(
    () =>
      useHealth.subscribe((state, previous) => {
        if (state.lastHit !== previous.lastHit) {
          secondsSinceHit.current = 0;
          regenTimer.current = 0;
        }
      }),
    []
  );

  useFrame((_, delta) => {
    const { health, damage, heal } = useHealth.getState();
    if (!selectIsWorldRunning(useSession.getState()) || health <= 0) return;
    secondsSinceHit.current += delta;

    if (playerState.feet.y < VOID_HEIGHT) {
      voidTimer.current += delta;
      if (voidTimer.current >= VOID_DAMAGE_INTERVAL) {
        voidTimer.current -= VOID_DAMAGE_INTERVAL;
        damage(VOID_DAMAGE, "void");
      }
      return;
    }
    voidTimer.current = 0;

    if (health < MAX_HEALTH && secondsSinceHit.current >= REGEN_DELAY) {
      regenTimer.current += delta;
      if (regenTimer.current >= REGEN_INTERVAL) {
        regenTimer.current -= REGEN_INTERVAL;
        heal(1);
      }
    }
  });

  return null;
};

export default PlayerVitals;

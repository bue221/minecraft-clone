import { useEffect } from "react";
import { DamageCause, selectIsDead, useHealth } from "../../hooks/useHealth";
import { useInventory } from "../../hooks/useInventory";
import { useSession } from "../../hooks/useSession";

const DEATH_MESSAGES: Record<DamageCause, string> = {
  fall: "Caíste desde demasiado alto.",
  void: "Caíste al vacío.",
};

const DeathScreen = () => {
  const isDead = useHealth(selectIsDead);
  const deathCause = useHealth((state) => state.deathCause);
  const respawn = useHealth((state) => state.respawn);
  const requestPlay = useSession((state) => state.requestPlay);

  useEffect(() => {
    if (!isDead) return;
    if (document.pointerLockElement) document.exitPointerLock();
    if (useSession.getState().openScreen) {
      useInventory.getState().stashHeld();
      useSession.getState().closeScreen(false);
    }
  }, [isDead]);

  if (!isDead) return null;

  const handleRespawn = () => {
    respawn();
    requestPlay();
  };

  return (
    <div className="menu-backdrop death">
      <div className="menu">
        <h1>¡Has muerto!</h1>
        {deathCause && <p className="death-cause">{DEATH_MESSAGES[deathCause]}</p>}
        <button className="menu-button primary" onClick={handleRespawn}>
          Reaparecer
        </button>
      </div>
    </div>
  );
};

export default DeathScreen;

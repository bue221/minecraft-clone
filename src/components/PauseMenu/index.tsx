import { selectIsDead, useHealth } from "../../hooks/useHealth";
import { useSession } from "../../hooks/useSession";
import { useStore } from "../../hooks/useStore";

const CONTROLS: [keys: string, action: string][] = [
  ["W A S D", "Moverse"],
  ["Ratón", "Mirar"],
  ["Espacio", "Saltar"],
  ["Shift", "Correr"],
  ["Clic izquierdo", "Romper bloque"],
  ["Clic derecho", "Poner bloque"],
  ["1-9 / rueda", "Elegir objeto de la barra"],
  ["E", "Inventario"],
  ["Clic derecho en baúl", "Abrir baúl"],
  ["Shift + clic derecho", "Poner bloque junto al baúl"],
  ["V", "Primera / tercera persona"],
  ["Esc", "Pausa"],
];

const PauseMenu = () => {
  const isPlaying = useSession((state) => state.isPlaying);
  const hasStarted = useSession((state) => state.hasStarted);
  const lockError = useSession((state) => state.lockError);
  const requestPlay = useSession((state) => state.requestPlay);
  const resetWorld = useStore((state) => state.resetWorld);
  const isDead = useHealth(selectIsDead);
  const hasOpenScreen = useSession((state) => state.openScreen !== null);

  if (isPlaying || isDead || hasOpenScreen) return null;

  const handleReset = () => {
    if (window.confirm("¿Borrar todos los bloques del mundo?")) resetWorld();
  };

  return (
    <div className="menu-backdrop">
      <div className="menu">
        <h1>{hasStarted ? "Pausa" : "Clon de Minecraft"}</h1>
        <button className="menu-button primary" onClick={requestPlay}>
          {hasStarted ? "Volver al juego" : "Jugar"}
        </button>
        {lockError && <p className="menu-error">{lockError}</p>}

        <dl className="controls">
          {CONTROLS.map(([keys, action]) => (
            <div key={keys} className="controls-row">
              <dt>{keys}</dt>
              <dd>{action}</dd>
            </div>
          ))}
        </dl>

        <button className="menu-button danger" onClick={handleReset}>
          Reiniciar mundo
        </button>
      </div>
    </div>
  );
};

export default PauseMenu;

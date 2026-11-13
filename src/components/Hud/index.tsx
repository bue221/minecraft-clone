import { useEffect } from "react";
import { useStore } from "../../hooks/useStore";

const RESET_KEY = "KeyR";

const Hud = () => {
  const resetWorld = useStore((state) => state.resetWorld);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== RESET_KEY || event.repeat) return;
      if (window.confirm("¿Borrar todos los bloques del mundo?")) resetWorld();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [resetWorld]);

  return (
    <div className="hud">
      Clic: poner · Alt + clic: quitar · 1-5: bloque · R: reiniciar mundo
    </div>
  );
};

export default Hud;

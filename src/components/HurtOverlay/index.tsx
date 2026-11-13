import { useHealth } from "../../hooks/useHealth";

/** Red flash on every hit; keying by hit id restarts the CSS animation. */
const HurtOverlay = () => {
  const lastHitId = useHealth((state) => state.lastHit?.id);
  return lastHitId ? <div key={lastHitId} className="hurt-overlay" /> : null;
};

export default HurtOverlay;

import { useEffect, useState } from "react";
import { useKeyboard } from "../../hooks/useKeyboard";
import { useStore } from "../../hooks/useStore";
import { blockImages, TEXTURE_NAMES } from "../../images/textures";

const VISIBLE_MS = 1000;

const TexturesSelector = () => {
  const [visible, setVisible] = useState(true);
  const texture = useStore((state) => state.texture);
  const setTexture = useStore((state) => state.setTexture);
  const actions = useKeyboard();

  const pressedTexture = TEXTURE_NAMES.find((name) => actions[name]);
  useEffect(() => {
    if (pressedTexture) setTexture(pressedTexture);
  }, [pressedTexture, setTexture]);

  useEffect(() => {
    setVisible(true);
    const visibilityTimeout = setTimeout(() => setVisible(false), VISIBLE_MS);
    return () => clearTimeout(visibilityTimeout);
  }, [texture]);

  if (!visible) return null;

  return (
    <div className="container-selector">
      {TEXTURE_NAMES.map((name) => (
        <img
          className={texture === name ? "select" : ""}
          key={name}
          src={blockImages[name]}
          alt={name}
          onClick={() => setTexture(name)}
        />
      ))}
    </div>
  );
};

export default TexturesSelector;

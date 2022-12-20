import React, { useEffect, useState } from "react";
//
import { useKeyboard } from "../../hooks/useKeyboard";
import { useStore } from "../../hooks/useStore";
import * as images from "../../images/images";

const TexturesSelector = () => {
  // states
  const [visible, setVisible] = useState(true);
  const [texture, setTexture] = useStore((state: any) => [
    state?.texture,
    state?.setTexture,
  ]);
  // select keys
  const { dirt, log, wood, glass, grass } = useKeyboard();

  // this useffect listen to change the texture
  useEffect(() => {
    const options = { dirt, log, wood, glass, grass };

    const [selectedTexture]: any = Object.entries(options).find(
      ([texture, isEnable]) => isEnable
    ) ?? [texture, true];
    if (selectedTexture) {
      setTexture(selectedTexture);
    }
  }, [dirt, grass, log, wood, glass]);

  // this useffect listen to show the images of textures
  useEffect(() => {
    const visibilityTimeout = setTimeout(() => {
      setVisible(false);
    }, 1000);

    setVisible(true);

    return () => {
      clearTimeout(visibilityTimeout);
    };
  }, [texture]);

  // dont show nothing
  if (!visible) return null;

  return (
    <div className="container-selector">
      {Object.entries(images).map(([textureName, textureSrc]: any) => (
        <img
          className={texture === textureName.replace("Img", "") ? "select" : ""}
          key={textureName}
          src={textureSrc}
          alt={textureName}
          onClick={() => setTexture(textureName)}
        />
      ))}
    </div>
  );
};

export default TexturesSelector;

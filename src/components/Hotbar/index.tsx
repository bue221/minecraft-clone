import { useEffect, useState } from "react";
import { selectSelectedItem, useInventory } from "../../hooks/useInventory";
import { useSession } from "../../hooks/useSession";
import { HOTBAR_SIZE } from "../../inventory/containers";
import { itemLabel } from "../../inventory/items";
import ItemIcon from "../ItemIcon";

const LABEL_VISIBLE_MS = 1500;

const Hotbar = () => {
  const slots = useInventory((state) => state.containers.hotbar);
  const selectedSlot = useInventory((state) => state.selectedSlot);
  const selectedItem = useInventory(selectSelectedItem);
  const selectSlot = useInventory((state) => state.selectSlot);
  const [isLabelVisible, setIsLabelVisible] = useState(true);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const slot = Number(event.code.replace("Digit", "")) - 1;
      if (Number.isInteger(slot) && slot >= 0 && slot < HOTBAR_SIZE) selectSlot(slot);
    };
    const handleWheel = (event: WheelEvent) => {
      if (!useSession.getState().isPlaying || event.deltaY === 0) return;
      selectSlot(useInventory.getState().selectedSlot + Math.sign(event.deltaY));
    };

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [selectSlot]);

  useEffect(() => {
    setIsLabelVisible(true);
    const timeout = setTimeout(() => setIsLabelVisible(false), LABEL_VISIBLE_MS);
    return () => clearTimeout(timeout);
  }, [selectedSlot, selectedItem]);

  return (
    <div className="hotbar">
      <div className={`hotbar-label ${isLabelVisible && selectedItem ? "" : "hidden"}`}>
        {selectedItem ? itemLabel(selectedItem) : "\u00a0"}
      </div>
      <div className="hotbar-slots">
        {(slots ?? []).map((item, index) => (
          <div
            key={index}
            className={`hotbar-slot ${selectedSlot === index ? "selected" : ""}`}
            onClick={() => selectSlot(index)}
          >
            {item && <ItemIcon item={item} />}
            <span className="hotbar-key">{index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hotbar;

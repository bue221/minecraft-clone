import { useEffect, useState } from "react";
import { useInventory } from "../../hooks/useInventory";
import { useSession } from "../../hooks/useSession";
import { chestContainerId, ContainerId } from "../../inventory/containers";
import { ITEM_IDS, itemLabel } from "../../inventory/items";
import ItemIcon from "../ItemIcon";

const INVENTORY_KEY = "KeyE";

const SlotGrid = ({ id, title }: { id: ContainerId; title: string }) => {
  const slots = useInventory((state) => state.containers[id]);
  const clickSlot = useInventory((state) => state.clickSlot);
  if (!slots) return null;

  return (
    <section className="inventory-section">
      <h2>{title}</h2>
      <div className="slot-grid">
        {slots.map((item, index) => (
          <button
            key={index}
            className="slot"
            title={item ? itemLabel(item) : undefined}
            onClick={() => clickSlot(id, index)}
          >
            {item && <ItemIcon item={item} />}
          </button>
        ))}
      </div>
    </section>
  );
};

/** Creative catalog: every click hands out a fresh copy of the item. */
const Catalog = () => {
  const takeFromCatalog = useInventory((state) => state.takeFromCatalog);
  return (
    <section className="inventory-section">
      <h2>Bloques</h2>
      <div className="slot-grid">
        {ITEM_IDS.map((item) => (
          <button key={item} className="slot" title={itemLabel(item)} onClick={() => takeFromCatalog(item)}>
            <ItemIcon item={item} />
          </button>
        ))}
      </div>
    </section>
  );
};

const HeldItem = () => {
  const held = useInventory((state) => state.held);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleMove = (event: MouseEvent) => setPointer({ x: event.clientX, y: event.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  if (!held || !pointer) return null;
  return (
    <div className="held-item" style={{ left: pointer.x, top: pointer.y }}>
      <ItemIcon item={held} />
    </div>
  );
};

const close = (resume: boolean) => {
  useInventory.getState().stashHeld();
  useSession.getState().closeScreen(resume);
};

const InventoryScreen = () => {
  const openScreen = useSession((state) => state.openScreen);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const session = useSession.getState();
      if (session.openScreen) {
        if (event.code === INVENTORY_KEY) close(true);
        // Escape can't re-capture the pointer, so the pause menu takes over.
        if (event.code === "Escape") close(false);
      } else if (event.code === INVENTORY_KEY && session.isPlaying && !event.repeat) {
        session.showScreen({ kind: "inventory" });
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!openScreen) return null;

  return (
    <div className="menu-backdrop">
      <div className="inventory">
        <header className="inventory-header">
          <h1>{openScreen.kind === "chest" ? "Baúl" : "Inventario"}</h1>
          <button className="menu-button" onClick={() => close(true)}>
            Cerrar (E)
          </button>
        </header>
        <Catalog />
        {openScreen.kind === "chest" && (
          <SlotGrid id={chestContainerId(openScreen.chestId)} title="Contenido del baúl" />
        )}
        <SlotGrid id="backpack" title="Mochila" />
        <SlotGrid id="hotbar" title="Barra" />
        <p className="inventory-hint">
          Clic para coger un objeto y clic en otra casilla para dejarlo o intercambiarlo.
        </p>
      </div>
      <HeldItem />
    </div>
  );
};

export default InventoryScreen;

import { blockImages } from "../../images/textures";
import { isTexturedBlock, ItemId, itemLabel } from "../../inventory/items";

const ChestIcon = () => (
  <svg viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden>
    <rect x="1" y="2" width="14" height="13" fill="#2b1a0c" />
    <rect x="2" y="3" width="12" height="4" fill="#a4723a" />
    <rect x="2" y="8" width="12" height="6" fill="#8b5a2b" />
    <rect x="7" y="6" width="2" height="4" fill="#c9c9c9" />
  </svg>
);

const ItemIcon = ({ item }: { item: ItemId }) =>
  isTexturedBlock(item) ? (
    <img className="item-icon" src={blockImages[item]} alt={itemLabel(item)} draggable={false} />
  ) : (
    <span className="item-icon" title={itemLabel(item)}>
      <ChestIcon />
    </span>
  );

export default ItemIcon;

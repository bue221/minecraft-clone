import { events, RootState } from "@react-three/fiber";

type EventsFactory = typeof events;

/**
 * While the pointer is locked the browser keeps reporting the position where the
 * lock started, so pointer events are raycast from the screen center (the crosshair).
 */
export const crosshairEvents: EventsFactory = (store) => {
  const defaultEvents = events(store);
  return {
    ...defaultEvents,
    compute: (event, state: RootState, previous) => {
      if (!document.pointerLockElement) {
        defaultEvents.compute?.(event, state, previous);
        return;
      }
      state.pointer.set(0, 0);
      state.raycaster.setFromCamera(state.pointer, state.camera);
    },
  };
};

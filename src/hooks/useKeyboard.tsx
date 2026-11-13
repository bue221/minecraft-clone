import { useEffect, useState } from "react";

const ACTIONS_KEYBOARD_MAP = {
  KeyW: "moveForward",
  KeyS: "moveBackward",
  KeyA: "moveLeft",
  KeyD: "moveRight",
  Space: "jump",
  ShiftLeft: "sprint",
  ShiftRight: "sprint",
} as const;

type Action = (typeof ACTIONS_KEYBOARD_MAP)[keyof typeof ACTIONS_KEYBOARD_MAP];
type Actions = Record<Action, boolean>;

const IDLE_ACTIONS: Actions = {
  moveForward: false,
  moveBackward: false,
  moveLeft: false,
  moveRight: false,
  jump: false,
  sprint: false,
};

const toAction = (code: string): Action | undefined =>
  ACTIONS_KEYBOARD_MAP[code as keyof typeof ACTIONS_KEYBOARD_MAP];

export const useKeyboard = (): Actions => {
  const [actions, setActions] = useState(IDLE_ACTIONS);

  useEffect(() => {
    const setAction = (code: string, isPressed: boolean) => {
      const action = toAction(code);
      if (!action) return;
      setActions((previous) =>
        previous[action] === isPressed ? previous : { ...previous, [action]: isPressed }
      );
    };
    const handleKeyDown = (event: KeyboardEvent) => setAction(event.code, true);
    const handleKeyUp = (event: KeyboardEvent) => setAction(event.code, false);
    // Keys released while the window is unfocused never fire "keyup".
    const releaseAll = () => setActions(IDLE_ACTIONS);

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", releaseAll);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", releaseAll);
    };
  }, []);

  return actions;
};

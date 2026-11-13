import create from "zustand";

export type CameraMode = "firstPerson" | "thirdPerson";
export type OpenScreen = { kind: "inventory" } | { kind: "chest"; chestId: string };

interface SessionState {
  cameraMode: CameraMode;
  toggleCameraMode: () => void;
  /** Inventory-like screen shown over the running game; the pointer is released while it's open. */
  openScreen: OpenScreen | null;
  showScreen: (screen: OpenScreen) => void;
  /** `resume` re-captures the pointer, which browsers only allow from a click or a non-Escape key. */
  closeScreen: (resume: boolean) => void;
  /** True while the pointer is locked to the game canvas, i.e. the game is being played. */
  isPlaying: boolean;
  hasStarted: boolean;
  lockError: string | null;
  lockTarget: HTMLElement | null;
  setLockTarget: (target: HTMLElement | null) => void;
  setPlaying: (isPlaying: boolean) => void;
  setLockError: (message: string | null) => void;
  requestPlay: () => void;
}

export const useSession = create<SessionState>()((set, get) => ({
  cameraMode: "firstPerson",
  toggleCameraMode: () =>
    set((state) => ({
      cameraMode: state.cameraMode === "firstPerson" ? "thirdPerson" : "firstPerson",
    })),
  openScreen: null,
  showScreen: (openScreen) => {
    set({ openScreen });
    if (document.pointerLockElement) document.exitPointerLock();
  },
  closeScreen: (resume) => {
    set({ openScreen: null });
    if (resume) get().requestPlay();
  },
  isPlaying: false,
  hasStarted: false,
  lockError: null,
  lockTarget: null,
  setLockTarget: (lockTarget) => set({ lockTarget }),
  setPlaying: (isPlaying) =>
    set((state) => ({
      isPlaying,
      hasStarted: state.hasStarted || isPlaying,
      lockError: isPlaying ? null : state.lockError,
    })),
  setLockError: (lockError) => set({ lockError }),
  requestPlay: () => {
    const { lockTarget } = get();
    if (!lockTarget) {
      console.warn("[session] Pointer lock requested before the canvas was ready");
      return;
    }
    try {
      // Newer browsers return a promise that rejects instead of firing "pointerlockerror".
      const result = lockTarget.requestPointerLock() as unknown as Promise<void> | undefined;
      result?.catch?.((error: unknown) => {
        console.warn("[session] Pointer lock was rejected", error);
        get().setLockError("No se pudo capturar el ratón. Espera un segundo y vuelve a intentarlo.");
      });
    } catch (error) {
      console.warn("[session] Pointer lock is not available", error);
      get().setLockError("Tu navegador no permite capturar el ratón en esta página.");
    }
  },
}));

/** The world keeps simulating while an inventory screen is open, like in Minecraft. */
export const selectIsWorldRunning = (state: SessionState): boolean =>
  state.isPlaying || state.openScreen !== null;

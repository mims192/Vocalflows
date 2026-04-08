import { useEffect, useRef, useCallback } from "react";

const KEY_MAP = {
  Alt: ["AltLeft", "AltRight"],
  Control: ["ControlLeft", "ControlRight"],
  Shift: ["ShiftLeft", "ShiftRight"],
  CapsLock: ["CapsLock"],
  F9: ["F9"],
  F10: ["F10"],
};

/**
 * @param {string} hotkey - Key name from KEY_MAP
 * @param {function} onHold - Called when key is held down
 * @param {function} onRelease - Called when key is released
 * @param {boolean} enabled - Whether hotkey is active
 */
export function useHotkey({ hotkey = "Alt", onHold, onRelease, enabled = true }) {
  const holdingRef = useRef(false);

  const handleKeyDown = useCallback(
    (e) => {
      if (!enabled) return;
      const codes = KEY_MAP[hotkey] || [`Key${hotkey}`];
      if (codes.includes(e.code) && !holdingRef.current) {
        e.preventDefault();
        holdingRef.current = true;
        onHold?.();
      }
    },
    [hotkey, onHold, enabled]
  );

  const handleKeyUp = useCallback(
    (e) => {
      if (!enabled) return;
      const codes = KEY_MAP[hotkey] || [`Key${hotkey}`];
      if (codes.includes(e.code) && holdingRef.current) {
        e.preventDefault();
        holdingRef.current = false;
        onRelease?.();
      }
    },
    [hotkey, onRelease, enabled]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    // Release if window loses focus
    window.addEventListener("blur", () => {
      if (holdingRef.current) {
        holdingRef.current = false;
        onRelease?.();
      }
    });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);
}

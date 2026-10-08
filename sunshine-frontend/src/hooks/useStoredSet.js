import { useCallback, useState } from "react";

const read = (key) => {
  try {
    return new Set(JSON.parse(window.localStorage.getItem(key) ?? "[]"));
  } catch {
    return new Set();
  }
};

/** A Set of strings persisted to localStorage (per browser). */
export default function useStoredSet(key) {
  const [set, setSet] = useState(() => read(key));

  const add = useCallback(
    (value) =>
      setSet((prev) => {
        const next = new Set(prev).add(value);
        try {
          window.localStorage.setItem(key, JSON.stringify([...next]));
        } catch {
          /* storage unavailable: keep in memory only */
        }
        return next;
      }),
    [key],
  );

  return [set, add];
}

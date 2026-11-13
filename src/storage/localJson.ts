/**
 * Reads and parses a JSON value. Returns `fallback` when nothing is saved, and also when
 * storage is unavailable or `parse` throws (corrupt or incompatible data), logging why.
 */
export const readJson = <T>(key: string, parse: (data: unknown) => T, fallback: T): T => {
  try {
    const serialized = localStorage.getItem(key);
    return serialized === null ? fallback : parse(JSON.parse(serialized));
  } catch (error) {
    console.warn(`[storage] Could not load "${key}", using defaults`, error);
    return fallback;
  }
};

export const writeJson = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[storage] Could not save "${key}"`, error);
  }
};

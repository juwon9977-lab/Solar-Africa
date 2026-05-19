import { useState, useEffect, useCallback } from "react";

const SAVED_KEY = "solargy_saved";

export function getSavedVendors(): number[] {
  try {
    const saved = localStorage.getItem(SAVED_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function useSavedVendors() {
  const [savedIds, setSavedIds] = useState<number[]>([]);

  useEffect(() => {
    setSavedIds(getSavedVendors());
  }, []);

  const toggleSaved = useCallback((id: number) => {
    setSavedIds((current) => {
      const isSaved = current.includes(id);
      const next = isSaved ? current.filter((x) => x !== id) : [...current, id];
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isSaved = useCallback((id: number) => savedIds.includes(id), [savedIds]);

  return { savedIds, toggleSaved, isSaved };
}

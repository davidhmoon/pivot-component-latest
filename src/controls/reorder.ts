/** Moves `id` one or more places up (negative) or down (positive), stopping at the ends. */
export function moveBy(ids: readonly string[], id: string, delta: number): string[] {
  const from = ids.indexOf(id);
  if (from === -1) return [...ids];
  const to = Math.max(0, Math.min(ids.length - 1, from + delta));
  return moveToIndex(ids, from, to);
}

/** Moves `id` into the place `targetId` occupies now; the items between shift over by one. */
export function moveOnto(ids: readonly string[], id: string, targetId: string): string[] {
  const from = ids.indexOf(id);
  const to = ids.indexOf(targetId);
  if (from === -1 || to === -1) return [...ids];
  return moveToIndex(ids, from, to);
}

function moveToIndex(ids: readonly string[], from: number, to: number): string[] {
  const next = [...ids];
  const [moved] = next.splice(from, 1);
  if (moved === undefined) return next;
  next.splice(to, 0, moved);
  return next;
}

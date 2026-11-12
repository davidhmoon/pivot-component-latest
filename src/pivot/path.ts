import type { Filter, Path } from './types';

/** The path of the top-level branch. */
export const ROOT: Path = [];

/**
 * A stable id for a row or the branch beneath it, built from its members.
 * Rows are identified by where they are in the hierarchy, never by their
 * position on screen, so sorting cannot attach an open branch to the wrong row.
 */
export function pathKey(path: Path): string {
  return path.map(encodeURIComponent).join('/');
}

/** The filters a branch's request needs: one per ancestor, outermost first. */
export function filtersFor(path: Path, levelIds: readonly string[]): Filter[] {
  return path.map((member, depth) => {
    const level = levelIds[depth];
    if (level === undefined) {
      throw new Error(`Path "${pathKey(path)}" is deeper than the hierarchy.`);
    }
    return { level, member };
  });
}

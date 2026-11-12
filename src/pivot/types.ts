/** One step of the hierarchy, for example "region" or "product". */
export interface Level {
  id: string;
  label: string;
}

/** A number the data source returns for every row. */
export interface ValueColumn {
  kind: 'value';
  id: string;
  label: string;
  format: 'currency' | 'integer';
}

/** A column worked out in the browser: the change from `prior` to `current`. */
export interface GrowthColumn {
  kind: 'growth';
  id: string;
  label: string;
  /** Id of the value column holding the current figure. */
  current: string;
  /** Id of the value column holding the figure to compare against. */
  prior: string;
}

export type Column = ValueColumn | GrowthColumn;

/** Sums keyed by value-column id. */
export type Values = Readonly<Record<string, number>>;

export interface PivotRow {
  /** What this row stands for, for example "Europe". Unique among its siblings. */
  member: string;
  values: Values;
}

/** An ancestor's member at one level. A branch is filtered by all of its ancestors. */
export interface Filter {
  level: string;
  member: string;
}

export interface BranchRequest {
  /** Id of the level to group by. */
  groupBy: string;
  /** One filter per ancestor, outermost first. Empty for the top level. */
  filters: readonly Filter[];
}

export interface BranchResult {
  rows: readonly PivotRow[];
  /** Sums over every row of the branch, computed by the source. */
  totals: Values;
}

/**
 * Where the table gets its data. One call can ask for several branches, so
 * opening a whole level costs one request instead of one per row.
 */
export interface DataSource {
  fetchBranches(requests: readonly BranchRequest[], signal?: AbortSignal): Promise<readonly BranchResult[]>;
}

/** A row's members from the top level down, for example ["Europe", "Wholesale"]. */
export type Path = readonly string[];

export type SortDirection = 'asc' | 'desc';

export interface Sort {
  /** A column id, or MEMBER_COLUMN to sort by the row labels. */
  columnId: string;
  direction: SortDirection;
}

/** The id used to sort by the label column. */
export const MEMBER_COLUMN = '@member';

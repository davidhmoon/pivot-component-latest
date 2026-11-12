import type { BranchRequest, BranchResult, DataSource } from '../pivot';

/** One record of the made-up dataset: a member for every level, and its numbers. */
export interface Fact {
  dims: Readonly<Record<string, string>>;
  values: Readonly<Record<string, number>>;
}

export interface MockSourceOptions {
  /** Simulated network delay in milliseconds. Defaults to a short random wait. */
  delay?: () => number;
  /** Called with every request as it arrives. The demo uses it for its request log. */
  onRequest?: (requests: readonly BranchRequest[]) => void;
  /** Return true to make the request being answered fail. */
  shouldFail?: () => boolean;
}

/**
 * Answers one branch request the way a reporting API would: keep the facts
 * that match every filter, group them by the requested level, and add up
 * each group. Rows come back in the order their members first appear.
 */
export function summarize(facts: readonly Fact[], request: BranchRequest): BranchResult {
  const groups = new Map<string, Record<string, number>>();
  const totals: Record<string, number> = {};

  for (const fact of facts) {
    if (!request.filters.every(({ level, member }) => fact.dims[level] === member)) continue;

    const member = fact.dims[request.groupBy];
    if (member === undefined) throw new Error(`Unknown level "${request.groupBy}".`);

    let sums = groups.get(member);
    if (!sums) {
      sums = {};
      groups.set(member, sums);
    }
    for (const [id, value] of Object.entries(fact.values)) {
      sums[id] = (sums[id] ?? 0) + value;
      totals[id] = (totals[id] ?? 0) + value;
    }
  }

  return {
    rows: Array.from(groups, ([member, values]) => ({ member, values })),
    totals,
  };
}

/**
 * Stands in for a server. It answers after a short delay, can be told to
 * fail, and stops early if the request is aborted.
 */
export function createMockSource(facts: readonly Fact[], options: MockSourceOptions = {}): DataSource {
  const delay = options.delay ?? (() => 250 + Math.random() * 350);

  return {
    fetchBranches(requests, signal) {
      return new Promise((resolve, reject) => {
        if (signal?.aborted) {
          reject(abortError());
          return;
        }

        options.onRequest?.(requests);
        const fail = options.shouldFail?.() ?? false;

        const onAbort = (): void => {
          clearTimeout(timer);
          reject(abortError());
        };
        const timer = setTimeout(() => {
          signal?.removeEventListener('abort', onAbort);
          try {
            if (fail) throw new Error('The demo server was told to refuse this request.');
            resolve(requests.map((request) => summarize(facts, request)));
          } catch (error) {
            reject(error);
          }
        }, delay());
        signal?.addEventListener('abort', onAbort, { once: true });
      });
    },
  };
}

function abortError(): DOMException {
  return new DOMException('The request was cancelled.', 'AbortError');
}

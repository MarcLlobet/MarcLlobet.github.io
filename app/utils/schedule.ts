/**
 * Ported from MarcLlobet/mobile-store. Replaces the previous `throttle`, which
 * was typed `<T extends () => void>` and so could not pass arguments through —
 * a search input needs to hand its query to the scheduled call.
 *
 * Both schedulers return a handle instead of a function, so a caller can cancel
 * a pending call when it unmounts.
 */
export type Scheduled<A extends readonly unknown[]> = {
  run: (...args: A) => void;
  cancel: () => void;
};

type Timer = {
  current: ReturnType<typeof setTimeout> | null;
  cancel: () => void;
};

const createTimer = (): Timer => {
  const timer: Timer = {
    current: null,
    cancel: () => {
      if (timer.current !== null) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    },
  };
  return timer;
};

/** Runs once the calls stop for `delayMs`. */
export const debounce = <A extends readonly unknown[]>(
  fn: (...args: A) => void,
  delayMs: number,
): Scheduled<A> => {
  const pending = createTimer();

  return {
    cancel: pending.cancel,
    run: (...args: A) => {
      pending.cancel();
      pending.current = setTimeout(() => {
        pending.current = null;
        fn(...args);
      }, delayMs);
    },
  };
};

/** Runs on the leading edge, then at most once every `intervalMs`. */
export const throttle = <A extends readonly unknown[]>(
  fn: (...args: A) => void,
  intervalMs: number,
): Scheduled<A> => {
  const pending = createTimer();
  const lastRunAt = { current: Number.NEGATIVE_INFINITY };
  const latest: { current: A | null } = { current: null };

  const invoke = (...args: A) => {
    lastRunAt.current = Date.now();
    fn(...args);
  };

  return {
    cancel: pending.cancel,
    run: (...args: A) => {
      latest.current = args;
      const waited = Date.now() - lastRunAt.current;

      if (waited >= intervalMs) {
        pending.cancel();
        invoke(...args);
        return;
      }

      pending.current ??= setTimeout(() => {
        pending.current = null;
        if (latest.current !== null) {
          invoke(...latest.current);
        }
      }, intervalMs - waited);
    },
  };
};

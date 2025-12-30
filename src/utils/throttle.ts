export const throttle = <T extends () => void>(fn: T, wait: number): T => {
  let lastTime = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (() => {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      fn();
    } else if (!timeout) {
      timeout = setTimeout(
        () => {
          lastTime = Date.now();
          timeout = null;
          fn();
        },
        wait - (now - lastTime),
      );
    }
  }) as T;
};

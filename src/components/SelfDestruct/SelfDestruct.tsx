import * as React from 'react';

type Props = {
  timeoutMs?: number;
};

/**
 * How long does the self-destructing animation last
 *
 * Used in other components to orchestrate UX.
 *
 * Currently there is no animation - disappears immediately.
 */
export const SELF_DESTRUCT_ANIMATION_MS = 0;

export const SelfDestruct: React.FC<Props> = ({children, timeoutMs = 0}) => {
  const [active, setActive] = React.useState<boolean>(true);

  React.useEffect(
    () => {
      const timeout = setTimeout(
        () => setActive(false),
        timeoutMs,
      );
      return () => clearTimeout(timeout);
    },
    [],
  );

  return active ? <>{children}</> : null;
};

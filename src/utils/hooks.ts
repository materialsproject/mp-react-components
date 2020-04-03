import { useEffect, useRef } from 'react';

// hooks are run on every render, when the prop change, we return the non-update value,
// and update it
export function usePrevious(value) {
  const ref = useRef();
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]);
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

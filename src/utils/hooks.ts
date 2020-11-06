import { useEffect, useRef, useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { useLocation } from 'react-router-dom';

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

/**
 * A useEffect hook that debounces the value by a given delay
 * Values are only checked once per delay interval
 */
export function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Set debouncedValue to value (passed in) after the specified delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Return a cleanup function that will be called every time ...
      // ... useEffect is re-called. useEffect will only be re-called ...
      // ... if value changes (see the inputs array below).
      // This is how we prevent debouncedValue from changing if value is ...
      // ... changed within the delay period. Timeout gets cleared and restarted.
      // To put it in context, if the user is typing within our app's ...
      // ... search box, we don't want the debouncedValue to update until ...
      // ... they've stopped typing for more than 500ms.
      return () => {
        clearTimeout(handler);
      };
    },
    // Only re-call effect if value changes
    // You could also add the "delay" var to inputs array if you ...
    // ... need to be able to change that dynamically.
    [value]
  );

  return debouncedValue;
}

/**
 * Same as useDebounce except the the value is deep compared to its previous
 * The value supplied to this hook must be an object or array of objects
 */
export function useDeepCompareDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useDeepCompareEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
}

/**
 * A custom hook that builds on useLocation to parse
 * the url query string for you.
 */
export const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

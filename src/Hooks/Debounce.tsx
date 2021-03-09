import { useEffect, useState } from "react";

export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // set debouncedValue to value after delay
    const debounce = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cancel setting debounced value if value changes before delay time
    return () => {
      clearTimeout(debounce);
    };
  }, [value, delay]);

  return debouncedValue;
};

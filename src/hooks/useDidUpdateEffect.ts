import { useEffect, useRef } from "react";

export default function useDidUpdateEffect(fn: Function, inputs: any[]) {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) {
      return fn();
    }
    didMountRef.current = true;
  }, inputs);
}

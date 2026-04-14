import { useEffect, useRef, useState } from "react";

export const useOverflowDetection = () => {
  const overflowRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const el = overflowRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      setIsOverflowing(el.scrollWidth > el.clientWidth);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { overflowRef, isOverflowing };
};

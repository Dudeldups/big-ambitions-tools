import { useEffect, useRef, useState } from "react";

export const useIsSticky = () => {
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: [1] },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { sentinelRef, isSticky };
};

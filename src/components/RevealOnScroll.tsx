"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

interface RevealOnScrollProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

export default function RevealOnScroll({
  children,
  delay = 0,
  className = "",
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const shown = reducedMotion || isVisible;

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      // Omit transform/will-change once visible so fixed modals inside never get trapped by a CSS containing block
      className={`transition-all duration-700 ease-out ${
        shown ? "opacity-100" : "opacity-0 translate-y-8 scale-[0.98] will-change-transform"
      } ${className}`}
    >
      {children}
    </div>
  );
}

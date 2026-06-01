import { useRef, useEffect, useState, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "fade";
  delay?: number;
  duration?: number;
  distance?: number;
  threshold?: number;
  className?: string;
}

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export const ScrollReveal = ({
  children,
  direction = "up",
  delay = 0,
  duration = 900,
  distance = 36,
  threshold = 0.12,
  className = "",
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -48px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const getTransform = () => {
    if (isVisible) return "translate3d(0, 0, 0)";
    switch (direction) {
      case "up":
        return `translate3d(0, ${distance}px, 0)`;
      case "down":
        return `translate3d(0, -${distance}px, 0)`;
      case "left":
        return `translate3d(${distance}px, 0, 0)`;
      case "right":
        return `translate3d(-${distance}px, 0, 0)`;
      case "fade":
        return "translate3d(0, 0, 0)";
      default:
        return `translate3d(0, ${distance}px, 0)`;
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms ${EASE} ${delay}ms, transform ${duration}ms ${EASE} ${delay}ms`,
        willChange: isVisible ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
};

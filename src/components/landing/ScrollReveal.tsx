import { useRef, useEffect, useState, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  /** Animation direction: 'up' | 'down' | 'left' | 'right' | 'fade' */
  direction?: "up" | "down" | "left" | "right" | "fade";
  /** Delay in ms before animation starts */
  delay?: number;
  /** Duration of the animation in ms */
  duration?: number;
  /** How far (px) the element slides in from */
  distance?: number;
  /** IntersectionObserver threshold (0-1) */
  threshold?: number;
  /** Additional className */
  className?: string;
}

export const ScrollReveal = ({
  children,
  direction = "up",
  delay = 0,
  duration = 700,
  distance = 40,
  threshold = 0.15,
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
      { threshold, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const getTransform = () => {
    if (isVisible) return "translate3d(0, 0, 0)";
    switch (direction) {
      case "up":    return `translate3d(0, ${distance}px, 0)`;
      case "down":  return `translate3d(0, -${distance}px, 0)`;
      case "left":  return `translate3d(${distance}px, 0, 0)`;
      case "right": return `translate3d(-${distance}px, 0, 0)`;
      case "fade":  return "translate3d(0, 0, 0)";
      default:      return `translate3d(0, ${distance}px, 0)`;
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
};

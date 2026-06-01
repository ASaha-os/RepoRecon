import { MouseEvent, ReactNode } from "react";
import { scrollToSection, scrollToTop } from "@/lib/smoothScroll";
import { cn } from "@/lib/utils";

type SmoothAnchorProps = {
  href: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
};

export const SmoothAnchor = ({ href, children, className, onNavigate }: SmoothAnchorProps) => {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith("#")) return;

    e.preventDefault();
    onNavigate?.();

    if (href === "#" || href === "#top") {
      scrollToTop();
      return;
    }

    scrollToSection(href);
    window.history.pushState(null, "", href);
  };

  return (
    <a href={href} onClick={handleClick} className={cn("nav-link-smooth", className)}>
      {children}
    </a>
  );
};

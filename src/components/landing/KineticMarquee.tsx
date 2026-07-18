import { cn } from "@/lib/utils";

type MarqueeProps = {
  items: string[];
  speed?: "fast" | "slow";
  className?: string;
};

export const KineticMarquee = ({ items, speed = "fast", className }: MarqueeProps) => (
  <div className={cn("mono-marquee", className)} aria-label={items.join(" · ")}>
    {/* Screen-reader friendly static list */}
    <span className="sr-only">{items.join(". ")}</span>

    <div
      className={cn(
        "mono-marquee-track",
        speed === "fast" ? "mono-marquee-fast" : "mono-marquee-slow"
      )}
      aria-hidden="true"
    >
      {[...items, ...items].map((item, i) => (
        <span key={item + i} className="mono-marquee-item">
          {item}
          <b aria-hidden="true">·</b>
        </span>
      ))}
    </div>
  </div>
);

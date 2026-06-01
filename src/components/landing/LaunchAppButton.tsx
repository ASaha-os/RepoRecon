import { ArrowUpRight } from "lucide-react";
import { openRepoReconApp } from "@/constants/links";
import { cn } from "@/lib/utils";

type LaunchAppButtonProps = {
  size?: "hero" | "default" | "compact";
  className?: string;
  label?: string;
};

export const LaunchAppButton = ({
  size = "default",
  className,
  label,
}: LaunchAppButtonProps) => {
  const isHero = size === "hero";
  const isCompact = size === "compact";

  const text =
    label ?? (isHero ? "Let's Try It — Launch App" : isCompact ? "Launch App" : "Launch the App");

  return (
    <div className={cn("inline-flex", className)}>
      <button
        type="button"
        onClick={openRepoReconApp}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold text-white bg-navy",
          "shadow-md hover:bg-navy/90 transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          isHero && "h-14 px-9 text-base sm:text-lg rounded-2xl",
          !isHero && !isCompact && "h-12 px-8 text-sm rounded-xl",
          isCompact && "h-8 px-4 text-xs rounded-lg"
        )}
      >
        <span>{text}</span>
        <ArrowUpRight className={cn("shrink-0 opacity-90", isHero ? "w-5 h-5" : "w-4 h-4")} />
      </button>
    </div>
  );
};

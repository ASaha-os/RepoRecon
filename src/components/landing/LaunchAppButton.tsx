import { ArrowUpRight } from "lucide-react";
import { REPO_RECON_APP_URL } from "@/constants/links";
import { cn } from "@/lib/utils";

type LaunchAppButtonProps = {
  size?: "hero" | "default" | "compact";
  className?: string;
  label?: string;
  variant?: "primary" | "outline";
};

export const LaunchAppButton = ({
  size = "default",
  className,
  label,
  variant = "primary",
}: LaunchAppButtonProps) => {
  const text = label ?? (size === "compact" ? "Launch" : "Analyze a repo");

  return (
    <div className={cn("inline-flex", className)}>
      <a
        href={REPO_RECON_APP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "mono-button",
          size === "hero" && "mono-button--hero",
          size === "compact" && "mono-button--compact",
          variant === "outline" && "mono-button--outline"
        )}
      >
        <span>{text}</span>
        <ArrowUpRight
          size={size === "hero" ? 18 : 14}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </a>
    </div>
  );
};

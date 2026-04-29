import React from "react";
import { cn } from "@/libs/utils";

type AppPageHeaderProps = {
  title: string;
  description?: string;
  icon?: React.ElementType;
  actions?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  gradientClassName?: string;
};

export function AppPageHeader({
  title,
  description,
  icon: Icon,
  actions,
  className,
  contentClassName,
  gradientClassName = "bg-primary-secondary-135",
}: AppPageHeaderProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl shadow-brand-glow-sm p-8 sm:p-10",
        gradientClassName,
        className,
      )}
    >
      <div className="gradient-border-static absolute inset-0 rounded-3xl pointer-events-none" />
      {Icon && (
        <Icon
          className="absolute -right-6 -bottom-6 w-40 h-40 opacity-[0.06] dark:opacity-[0.04] pointer-events-none"
          aria-hidden="true"
        />
      )}
      <div
        className={cn(
          "relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
          contentClassName,
        )}
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gradient-brand">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-muted-foreground max-w-2xl">{description}</p>
          )}
        </div>
        {actions}
      </div>
    </div>
  );
}

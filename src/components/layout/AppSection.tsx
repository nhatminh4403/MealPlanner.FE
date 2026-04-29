import React from "react";
import { cn } from "@/libs/utils";

type AppSectionProps = {
  title: string;
  description?: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function AppSection({
  title,
  description,
  icon: Icon,
  action,
  children,
  className,
}: AppSectionProps) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-border bg-card/60 backdrop-blur-sm p-5 sm:p-6",
        className,
      )}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 text-primary" aria-hidden="true" />}
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

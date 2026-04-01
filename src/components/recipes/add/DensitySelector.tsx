"use client";

import React from "react";
import { DENSITY_PRESETS } from "@/libs/unit-conversion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/libs/utils";

interface DensitySelectorProps {
  value: number;
  onChange: (density: number) => void;
}

export function DensitySelector({ value, onChange }: DensitySelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-primary/70 dark:text-primary/60 shrink-0">
        Density:
      </span>

      <Select value="" onValueChange={(v) => onChange(Number(v))}>
        <SelectTrigger
          className={cn(
            "h-7 text-xs flex-1 min-w-0",
            "bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--foreground)]",
            "hover:border-primary/50 focus:border-primary focus:ring-[var(--input-ring)]",
            "transition-colors duration-150",
          )}
        >
          <SelectValue placeholder="Pick preset" />
        </SelectTrigger>
        <SelectContent
          className={cn(
            "bg-[var(--popover-bg)] border-[var(--popover-border)]",
            "text-[var(--foreground)] shadow-lg shadow-black/10 dark:shadow-black/40",
          )}
        >
          {DENSITY_PRESETS.map((p) => (
            <SelectItem
              key={p.label}
              value={String(p.density)}
              className={cn(
                "text-xs cursor-pointer",
                "focus:bg-primary/10 focus:text-primary",
                "data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary",
              )}
            >
              <span>{p.label}</span>
              <span className="ml-2 text-[var(--muted-fg)]">
                {p.density} g/ml
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="number"
        className={cn(
          "h-7 w-20 text-xs text-center font-medium shrink-0",
          "bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--foreground)]",
          "focus:border-primary focus:ring-[var(--input-ring)]",
          "transition-colors duration-150",
        )}
        step={0.01}
        min={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder="g/ml"
      />
      <span className="text-[10px] text-[var(--muted-fg)] shrink-0">g/ml</span>
    </div>
  );
}
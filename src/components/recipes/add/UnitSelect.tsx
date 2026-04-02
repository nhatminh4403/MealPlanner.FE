"use client";

import React from "react";
import { UNITS, UNITS_BY_CATEGORY } from "@/libs/unit-conversion";
import { Unit } from "@/libs/interfaceDTO";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface UnitSelectProps {
  value: Unit | null;
  onChange: (unit: Unit) => void;
}

export function UnitSelect({ value, onChange }: UnitSelectProps) {
  return (
    <Select
      value={value?.label ?? ""}
      onValueChange={(label) => {
        const unit = UNITS.find((u) => u.label === label);
        if (unit) onChange(unit);
      }}
    >
      <SelectTrigger
        className={cn(
          "h-9 w-full font-medium text-sm",
          "bg-white dark:bg-zinc-900/80",
          "border border-zinc-200 dark:border-zinc-700/60",
          "text-foreground",
          "hover:border-primary/50 dark:hover:border-primary/40",
          "focus:border-primary dark:focus:border-primary/70",
          "focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/15",
          "backdrop-blur-sm transition-colors duration-150",
          /* Show category accent on the selected value */
          value?.category === "weight" && "data-[state=closed]:text-primary",
          value?.category === "volume" && "data-[state=closed]:text-secondary",
          value?.category === "count" && "data-[state=closed]:text-amber-500 dark:data-[state=closed]:text-amber-400",
        )}
      >
        <SelectValue placeholder="Unit" />
      </SelectTrigger>

      <SelectContent
        className={cn(
          /* Light mode */
          "bg-white border-zinc-200",
          /* Dark mode */
          "dark:bg-zinc-900 dark:border-zinc-700/60",
          "text-foreground",
          "shadow-xl shadow-black/10 dark:shadow-black/50",
          /* Scrollable with a thin styled scrollbar */
          "max-h-72 overflow-y-auto",
          "[&::-webkit-scrollbar]:w-1.5",
          "[&::-webkit-scrollbar-track]:bg-transparent",
          "[&::-webkit-scrollbar-thumb]:rounded-full",
          "[&::-webkit-scrollbar-thumb]:bg-zinc-300 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-600",
          "[&::-webkit-scrollbar-thumb]:hover:bg-zinc-400 dark:[&::-webkit-scrollbar-thumb]:hover:bg-zinc-500",
        )}
      >
        {/* ── Weight ──────────────────────────────────────── */}
        <SelectGroup>
          <SelectLabel
            className={cn(
              "text-[10px] font-bold uppercase tracking-widest px-3 py-1.5",
              "text-primary/80",
            )}
          >
            Weight
          </SelectLabel>
          {UNITS_BY_CATEGORY.weight.map((u) => (
            <SelectItem
              key={u.label}
              value={u.label}
              className={cn(
                "text-sm cursor-pointer",
                "text-foreground",
                "focus:bg-primary/10 focus:text-primary",
                "data-highlighted:bg-primary/10 data-highlighted:text-primary",
                "data-[state=checked]:text-primary data-[state=checked]:font-semibold",
              )}
            >
              <span className="font-medium">{u.label}</span>
              <span className="ml-2 text-(--muted-fg) text-xs">
                {u.fullName}
              </span>
            </SelectItem>
          ))}
        </SelectGroup>

        {/* ── Volume ──────────────────────────────────────── */}
        <SelectGroup>
          <SelectLabel
            className={cn(
              "text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 mt-1",
              "text-secondary/80",
            )}
          >
            Volume
          </SelectLabel>
          {UNITS_BY_CATEGORY.volume.map((u) => (
            <SelectItem
              key={u.label}
              value={u.label}
              className={cn(
                "text-sm cursor-pointer",
                "text-foreground",
                "focus:bg-secondary/10 focus:text-secondary",
                "data-highlighted:bg-secondary/10 data-highlighted:text-secondary",
                "data-[state=checked]:text-secondary data-[state=checked]:font-semibold",
              )}
            >
              <span className="font-medium">{u.label}</span>
              <span className="ml-2 text-(--muted-fg) text-xs">
                {u.fullName}
              </span>
            </SelectItem>
          ))}
        </SelectGroup>

        {/* ── Count ───────────────────────────────────────── */}
        <SelectGroup>
          <SelectLabel
            className={cn(
              "text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 mt-1",
              "text-amber-500/80 dark:text-amber-400/80",
            )}
          >
            Count
          </SelectLabel>
          {UNITS_BY_CATEGORY.count.map((u) => (
            <SelectItem
              key={u.label}
              value={u.label}
              className={cn(
                "text-sm cursor-pointer",
                "text-foreground",
                "focus:bg-amber-500/10 focus:text-amber-600 dark:focus:text-amber-400",
                "data-highlighted:bg-amber-500/10 data-highlighted:text-amber-600 dark:data-highlighted:text-amber-400",
                "data-[state=checked]:text-amber-600 dark:data-[state=checked]:text-amber-400 data-[state=checked]:font-semibold",
              )}
            >
              <span className="font-medium">{u.label}</span>
              <span className="ml-2 text-(--muted-fg) text-xs">
                {u.fullName}
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
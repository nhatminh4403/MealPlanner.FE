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

interface DensitySelectorProps {
  value: number;
  onChange: (density: number) => void;
}

export function DensitySelector({ value, onChange }: DensitySelectorProps) {
  return (
    <div className="flex items-center gap-1.5 mt-1">
      <span className="text-xs text-muted-foreground shrink-0">Density:</span>
      <Select value="" onValueChange={(v) => onChange(Number(v))}>
        <SelectTrigger className="h-7 text-xs flex-1">
          <SelectValue placeholder="Pick preset" />
        </SelectTrigger>
        <SelectContent>
          {DENSITY_PRESETS.map((p) => (
            <SelectItem key={p.label} value={String(p.density)}>
              {p.label} ({p.density} g/ml)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="number"
        className="h-7 w-20 text-xs"
        step={0.01}
        min={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder="g/ml"
      />
    </div>
  );
}

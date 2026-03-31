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
      <SelectTrigger className="h-9 w-full">
        <SelectValue placeholder="Unit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel className="text-xs text-muted-foreground">
            Weight
          </SelectLabel>
          {UNITS_BY_CATEGORY.weight.map((u) => (
            <SelectItem key={u.label} value={u.label}>
              {u.label}{" "}
              <span className="text-muted-foreground text-xs ml-1">
                ({u.fullName})
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel className="text-xs text-muted-foreground">
            Volume
          </SelectLabel>
          {UNITS_BY_CATEGORY.volume.map((u) => (
            <SelectItem key={u.label} value={u.label}>
              {u.label}{" "}
              <span className="text-muted-foreground text-xs ml-1">
                ({u.fullName})
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel className="text-xs text-muted-foreground">
            Count
          </SelectLabel>
          {UNITS_BY_CATEGORY.count.map((u) => (
            <SelectItem key={u.label} value={u.label}>
              {u.label}{" "}
              <span className="text-muted-foreground text-xs ml-1">
                ({u.fullName})
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

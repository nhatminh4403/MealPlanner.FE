"use client";

import React from "react";
import { useLocalization } from "@/libs/localization";
import { Plus, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface InstructionsSectionProps {
  instructions: string[];
  addInstruction: () => void;
  removeInstruction: (index: number) => void;
  updateInstruction: (index: number, value: string) => void;
}

export function InstructionsSection({
  instructions,
  addInstruction,
  removeInstruction,
  updateInstruction,
}: InstructionsSectionProps) {
  const { L } = useLocalization();

  return (
    <Card className="border-none shadow-premium dark:shadow-premium-dark">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>
            {L("MealPlannerAPI", "Instructions") || "Instructions"}
          </CardTitle>
          <CardDescription>
            {L("MealPlannerAPI", "InstructionsDescription") ||
              "Step-by-step prep guide"}
          </CardDescription>
        </div>
        <button
          type="button"
          onClick={addInstruction}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        >
          <Plus className="size-4" />
        </button>
      </CardHeader>
      <CardContent className="grid gap-4">
        {instructions.map((step, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {i + 1}
            </div>
            <div className="flex flex-1 items-start gap-2">
              <Textarea
                className="min-h-9 py-1.5"
                value={step}
                onChange={(e) => updateInstruction(i, e.target.value)}
                placeholder={`${L("MealPlannerAPI", "Step") || "Step"} ${i + 1}...`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => removeInstruction(i)}
                disabled={instructions.length === 1}
                className="mt-0.5 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
        {instructions.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center bg-muted/5">
            <p className="text-sm text-muted-foreground">
              {L("MealPlannerAPI", "NoInstructionsAdded") ||
                "No instructions added"}
            </p>
            <Button
              variant="link"
              size="sm"
              onClick={addInstruction}
              className="mt-2"
            >
              <Plus className="mr-1 size-3" />
              {L("MealPlannerAPI", "AddStep") || "Add Step"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

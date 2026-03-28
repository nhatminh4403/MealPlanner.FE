"use client";
import React from "react";
import Link from "next/link";
import { ChefHat } from "lucide-react";

interface EmptyRecipesProps {
  title?: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
}

export default function EmptyRecipesState({
  title = "No recipes yet",
  description = "Create your first recipe to see it here",
  buttonLabel = "Create Recipe",
  buttonHref = "/recipe/create",
}: EmptyRecipesProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
        <ChefHat size={28} className="text-emerald-400" />
      </div>
      <p className="text-white font-semibold mb-1">{title}</p>
      <p className="text-zinc-500 text-sm mb-6">{description}</p>
      <Link
        href={buttonHref}
        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold text-sm transition-all"
      >
        {buttonLabel}
      </Link>
    </div>
  );
}

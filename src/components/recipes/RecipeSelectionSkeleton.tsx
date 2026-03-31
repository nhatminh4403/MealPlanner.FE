"use client";
import React from "react";

export default function RecipeSelectionSkeleton({
  count = 10,
}: {
  count?: number;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-white/3 border border-white/6 overflow-hidden animate-pulse"
        >
          <div className="aspect-video bg-white/5" />
          <div className="p-4 space-y-3">
            <div className="h-3 bg-white/5 rounded-lg w-3/4" />
            <div className="h-3 bg-white/5 rounded-lg w-1/2" />
            <div className="h-8 bg-white/5 rounded-xl mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

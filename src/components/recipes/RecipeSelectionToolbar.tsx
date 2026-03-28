"use client";
import React from "react";
import { Search, Plus } from "lucide-react";
import Link from "next/link";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RecipeSelectionToolbarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  tabs: { value: string; label: string; icon: React.ComponentType<{ size?: number }> }[];
}

export default function RecipeSelectionToolbar({
  searchTerm,
  onSearchChange,
  tabs,
}: RecipeSelectionToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Tabs */}
      <TabsList className="bg-white/4 border border-white/6 p-1 rounded-xl h-auto gap-1 w-fit">
        {tabs.map(({ value, icon: Icon, label }) => (
          <TabsTrigger
            key={value}
            value={value}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-500 
        data-[state=active]:bg-white/10 data-[state=active]:text-white 
        flex items-center gap-1.5 transition-all"
          >
            <Icon size={14} />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Search + Button */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600"
            size={15}
          />
          <input
            type="text"
            placeholder="Search recipes…"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/8 
        focus:outline-none focus:border-white/20 focus:bg-white/8 
        text-white placeholder-zinc-600 text-sm w-60 transition-all"
          />
        </div>

        <Link
          href="/recipe/create"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl 
      bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 
      hover:bg-emerald-500/20 text-sm font-bold transition-all whitespace-nowrap"
        >
          <Plus size={15} />
          New Recipe
        </Link>
      </div>
    </div>
  );
}

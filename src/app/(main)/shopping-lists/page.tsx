import React from 'react';
import { RefreshCw, Plus, ShoppingCart } from 'lucide-react';

export default function ShoppingListsPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 pt-24 pb-12 animate-page-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Shopping Lists</h1>
          <p className="mt-2 text-zinc-500">Manage your grocery lists here.</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow-md active:scale-[0.98]">
          <Plus size={18} />
          <span>New List</span>
        </button>
      </div>

      {/* Glassmorphism Container */}
      <div className="relative bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 shadow-xl">
        <div className="absolute inset-0 bg-linear-to-br from-white/40 to-white/10 dark:from-white/5 dark:to-transparent rounded-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Your Lists</h2>
            <button className="p-2 text-zinc-400 hover:text-emerald-500 transition-colors rounded-lg bg-zinc-100/50 dark:bg-zinc-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10">
              <RefreshCw size={18} />
            </button>
          </div>

          {/* TODO Section for API & Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example Empty State / Todo Container */}
            <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/20 col-span-full py-16 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
              <div className="w-16 h-16 mb-4 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                <ShoppingCart size={32} />
              </div>
              <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">No Shopping Lists</h3>
              <p className="text-sm text-zinc-500 max-w-sm mb-6">
                TODO: Fetch shopping lists from API (`api.shoppingLists.getList()`).<br/>
                Map over the result and render `ShoppingList` cards here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

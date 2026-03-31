"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Plus, ShoppingCart, Trash2, Check } from "lucide-react";
import { shoppingLists } from "@/libs/api";
import { ShoppingList } from "@/libs/interfaceDTO";
import { ShoppingListCategory } from "@/libs/enums";
import { toast } from "sonner";
import { useLocalization } from "@/libs/localization";

export default function ShoppingListsPage() {
  const { L } = useLocalization();
  const [userShoppingLists, setUserShoppingLists] = useState<ShoppingList[]>(
    [],
  );

  const loadUserShoppingList = useCallback(async () => {
    try {
      const shoppingListsRes = await shoppingLists.getList();
      setUserShoppingLists(shoppingListsRes.data.items);
      console.log(shoppingListsRes.data.items);
    } catch {
      toast.error(L("MealPlannerAPI", "FailedToLoadShoppingLists"));
    }
  }, [L]);

  useEffect(() => {
    (async () => {
      await loadUserShoppingList();
    })();
  }, [loadUserShoppingList]);

  const handleToggleItem = async (listId: string, itemId: string) => {
    try {
      await shoppingLists.toggleItem(listId, itemId);
      loadUserShoppingList();
    } catch {
      toast.error(L("MealPlannerAPI", "FailedToUpdateItem"));
    }
  };

  const handleDeleteListItem = async (listId: string, itemId: string) => {
    try {
      await shoppingLists.removeItem(listId, itemId);
      loadUserShoppingList();
    } catch {
      toast.error(L("MealPlannerAPI", "FailedToRemoveItem"));
    }
  };

  const handleDeleteList = async (listId: string) => {
    if (!confirm(L("MealPlannerAPI", "ConfirmDeleteList"))) return;
    try {
      await shoppingLists.delete(listId);
      loadUserShoppingList();
      toast.success(L("MealPlannerAPI", "ListDeleted"));
    } catch {
      toast.error(L("MealPlannerAPI", "FailedToDeleteList"));
    }
  };

  const handleCreateList = async () => {
    const name = prompt(L("MealPlannerAPI", "EnterListName"));
    if (!name) return;
    try {
      await shoppingLists.create({ name });
      loadUserShoppingList();
      toast.success(L("MealPlannerAPI", "ListCreated"));
    } catch {
      toast.error(L("MealPlannerAPI", "FailedToCreateList"));
    }
  };

  const getCategoryDetails = (category: number) => {
    switch (category) {
      case ShoppingListCategory.Produce:
        return {
          label: L("MealPlannerAPI", "CategoryProduce"),
          color:
            "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
        };
      case ShoppingListCategory.Meat:
        return {
          label: L("MealPlannerAPI", "CategoryMeat"),
          color: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
        };
      case ShoppingListCategory.Dairy:
        return {
          label: L("MealPlannerAPI", "CategoryDairy"),
          color:
            "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
        };
      case ShoppingListCategory.Pantry:
        return {
          label: L("MealPlannerAPI", "CategoryPantry"),
          color:
            "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
        };
      case ShoppingListCategory.Frozen:
        return {
          label: L("MealPlannerAPI", "CategoryFrozen"),
          color: "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
        };
      default:
        return {
          label: L("MealPlannerAPI", "CategoryOther"),
          color:
            "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
        };
    }
  };

  const handleAddItem = async (listId: string) => {
    const itemName = prompt(L("MealPlannerAPI", "ItemName"));
    if (!itemName) return;
    const qty = prompt(L("MealPlannerAPI", "QuantityOptional")) || undefined;

    // We can also let the user pick a category if we had a proper modal
    // For now, let's keep it simple or default to 'Other'

    try {
      await shoppingLists.addItem(listId, {
        name: itemName,
        quantity: qty,
        category: ShoppingListCategory.Other,
      });
      loadUserShoppingList();
    } catch {
      toast.error(L("MealPlannerAPI", "FailedToAddItem"));
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 pt-24 pb-12 animate-page-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            {L("MealPlannerAPI", "ShoppingLists")}
          </h1>
          <p className="mt-2 text-zinc-500">
            {L("MealPlannerAPI", "ShoppingListsDescription")}
          </p>
        </div>
        <button
          onClick={handleCreateList}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
        >
          <Plus size={18} />
          <span>{L("MealPlannerAPI", "NewList")}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {userShoppingLists.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white/30 dark:bg-zinc-900/30 backdrop-blur-sm col-span-full py-20">
            <div className="w-20 h-20 mb-6 rounded-3xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
              <ShoppingCart size={40} />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
              {L("MealPlannerAPI", "NoShoppingLists")}
            </h3>
            <p className="text-zinc-500 max-w-xs mb-8">
              {L("MealPlannerAPI", "NoShoppingListsDescription")}
            </p>
            <button
              onClick={handleCreateList}
              className="text-emerald-500 font-medium hover:underline flex items-center gap-2"
            >
              <Plus size={16} /> {L("MealPlannerAPI", "CreateFirstList")}
            </button>
          </div>
        ) : (
          userShoppingLists.map((list) => (
            <div
              key={list.id}
              className="group relative bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:bg-white/80 dark:hover:bg-zinc-900/80 transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-zinc-900 dark:text-white group-hover:text-emerald-500 transition-colors uppercase tracking-wider text-sm">
                  {list.name}
                </h3>
                <button
                  onClick={() => handleDeleteList(list.id)}
                  className="p-2 text-zinc-400 hover:text-red-500 transition-colors rounded-xl bg-zinc-100/50 dark:bg-zinc-800/50 hover:bg-red-50 dark:hover:bg-red-500/10"
                  title={L("MealPlannerAPI", "DeleteList")}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="space-y-3 grow">
                {list.items.length === 0 ? (
                  <p className="text-sm text-zinc-400 italic py-4">
                    {L("MealPlannerAPI", "NoItemsInList")}
                  </p>
                ) : (
                  list.items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between group/item p-3 rounded-2xl transition-all ${
                        item.isChecked
                          ? "bg-emerald-50/30 dark:bg-emerald-500/5 opacity-60"
                          : "hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <button
                          onClick={() => handleToggleItem(list.id, item.id)}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                            item.isChecked
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "border-zinc-300 dark:border-zinc-600"
                          }`}
                        >
                          {item.isChecked && <Check size={12} />}
                        </button>
                        <div className="flex flex-col overflow-hidden">
                          <span
                            className={`text-sm font-medium transition-all group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400 ${
                              item.isChecked
                                ? "text-zinc-400 line-through decoration-emerald-500/50"
                                : "text-zinc-700 dark:text-zinc-100"
                            }`}
                          >
                            {item.name}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            {item.quantity && (
                              <span
                                className="text-[13px] text-zinc-500 font-medium px-1.5 py-0.5 rounded-md bg-zinc-100
                               dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                              >
                                {item.quantity} {item.unit}
                              </span>
                            )}
                            <span
                              className={`text-[13px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${getCategoryDetails(item.category).color}`}
                            >
                              {getCategoryDetails(item.category).label}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteListItem(list.id, item.id)}
                        className="opacity-0 group-hover/item:opacity-100 p-1.5 text-zinc-400 hover:text-red-500 transition-all rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        <Plus size={14} className="rotate-45" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 font-medium">
                  {list.items.filter((i) => i.isChecked).length}{" "}
                  {L("MealPlannerAPI", "Of")} {list.items.length}{" "}
                  {L("MealPlannerAPI", "Completed")}
                </span>
                <button
                  className="text-xs font-semibold text-emerald-500 hover:text-emerald-600 transition-colors flex items-center gap-1"
                  onClick={() => handleAddItem(list.id)}
                >
                  <Plus size={12} /> {L("MealPlannerAPI", "AddItem")}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

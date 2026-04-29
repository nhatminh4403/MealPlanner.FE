"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Plus, ShoppingCart, Trash2, Check, ShoppingBag } from "lucide-react";
import { shoppingLists } from "@/libs/api";
import { ShoppingList } from "@/libs/interfaceDTO";
import { ShoppingListCategory } from "@/libs/enums";
import { toast } from "sonner";
import { useLocalization } from "@/libs/LocalizationProvider";
import { AppPageHeader } from "@/components/layout/AppPageHeader";

export default function ShoppingListsPage() {
  const { L } = useLocalization();
  const [userShoppingLists, setUserShoppingLists] = useState<ShoppingList[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  const loadUserShoppingList = useCallback(async () => {
    try {
      const res = await shoppingLists.getList();
      setUserShoppingLists(res.data.items);
    } catch {
      toast.error(L("MealPlannerAPI", "ShoppingList:LoadFailed"));
    } finally {
      setLoading(false);
    }
  }, [L]);

  useEffect(() => {
    loadUserShoppingList();
  }, [loadUserShoppingList]);

  const handleToggleItem = async (listId: string, itemId: string) => {
    try {
      await shoppingLists.toggleItem(listId, itemId);
      // Optimistic update
      setUserShoppingLists((prev) =>
        prev.map((list) =>
          list.id !== listId
            ? list
            : {
                ...list,
                items: list.items.map((item) =>
                  item.id === itemId
                    ? { ...item, isChecked: !item.isChecked }
                    : item,
                ),
              },
        ),
      );
    } catch {
      toast.error(L("MealPlannerAPI", "ShoppingList:UpdateItemFailed"));
    }
  };

  const handleDeleteListItem = async (listId: string, itemId: string) => {
    try {
      await shoppingLists.removeItem(listId, itemId);
      setUserShoppingLists((prev) =>
        prev.map((list) =>
          list.id !== listId
            ? list
            : { ...list, items: list.items.filter((i) => i.id !== itemId) },
        ),
      );
    } catch {
      toast.error(L("MealPlannerAPI", "ShoppingList:RemoveItemFailed"));
    }
  };

  const handleDeleteList = async (listId: string) => {
    if (!confirm(L("MealPlannerAPI", "ShoppingList:ConfirmDelete"))) return;
    try {
      await shoppingLists.delete(listId);
      setUserShoppingLists((prev) => prev.filter((l) => l.id !== listId));
      toast.success(L("MealPlannerAPI", "ShoppingList:Deleted"));
    } catch {
      toast.error(L("MealPlannerAPI", "ShoppingList:DeleteFailed"));
    }
  };

  const handleCreateList = async () => {
    const name = prompt(L("MealPlannerAPI", "ShoppingList:EnterName"));
    if (!name) return;
    try {
      const res = await shoppingLists.create({ name });
      setUserShoppingLists((prev) => [...prev, res.data]);
      toast.success(L("MealPlannerAPI", "ShoppingList:Created"));
    } catch {
      toast.error(L("MealPlannerAPI", "ShoppingList:CreateFailed"));
    }
  };

  const handleAddItem = async (listId: string) => {
    const itemName = prompt(L("MealPlannerAPI", "ShoppingList:ItemName"));
    if (!itemName) return;
    const qty =
      prompt(L("MealPlannerAPI", "ShoppingList:QuantityOptional")) || undefined;
    try {
      await shoppingLists.addItem(listId, {
        name: itemName,
        quantity: qty,
        category: ShoppingListCategory.Other,
      });
      loadUserShoppingList();
    } catch {
      toast.error(L("MealPlannerAPI", "ShoppingList:AddItemFailed"));
    }
  };

  const getCategoryDetails = (category: number) => {
    const map: Record<number, { key: string; color: string }> = {
      [ShoppingListCategory.Produce]: {
        key: "ShoppingList:CategoryProduce",
        color:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
      },
      [ShoppingListCategory.Meat]: {
        key: "ShoppingList:CategoryMeat",
        color: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
      },
      [ShoppingListCategory.Dairy]: {
        key: "ShoppingList:CategoryDairy",
        color:
          "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
      },
      [ShoppingListCategory.Pantry]: {
        key: "ShoppingList:CategoryPantry",
        color:
          "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
      },
      [ShoppingListCategory.Frozen]: {
        key: "ShoppingList:CategoryFrozen",
        color: "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
      },
    };
    return (
      map[category] ?? {
        key: "ShoppingList:CategoryOther",
        color: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
      }
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16 animate-page-in">
      <AppPageHeader
        className="mb-10"
        gradientClassName="bg-primary-secondary-45"
        icon={ShoppingBag}
        title={L("MealPlannerAPI", "ShoppingList:Title")}
        description={L("MealPlannerAPI", "ShoppingList:Description")}
        actions={
          <button
            onClick={handleCreateList}
            className="flex items-center gap-2 bg-brand-gradient text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-brand-glow-sm hover:shadow-brand-glow active:scale-[0.98]"
          >
            <Plus size={18} aria-hidden="true" />
            {L("MealPlannerAPI", "ShoppingList:NewList")}
          </button>
        }
      />

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-3xl border border-border bg-card p-6 space-y-4 animate-pulse"
            >
              <div className="h-5 w-1/2 bg-muted rounded-lg" />
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-10 bg-muted rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && userShoppingLists.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border-2 border-dashed border-border bg-primary-secondary-radial-center">
          <div className="w-20 h-20 mb-6 rounded-3xl bg-primary/10 flex items-center justify-center shadow-brand-glow-sm">
            <ShoppingCart
              size={36}
              className="text-primary"
              aria-hidden="true"
            />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            {L("MealPlannerAPI", "ShoppingList:NoLists")}
          </h3>
          <p className="text-muted-foreground max-w-xs mb-8">
            {L("MealPlannerAPI", "ShoppingList:NoListsDesc")}
          </p>
          <button
            onClick={handleCreateList}
            className="flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            <Plus size={16} aria-hidden="true" />
            {L("MealPlannerAPI", "ShoppingList:CreateFirst")}
          </button>
        </div>
      )}

      {/* Lists grid */}
      {!loading && userShoppingLists.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userShoppingLists.map((list, idx) => {
            const checkedCount = list.items.filter((i) => i.isChecked).length;
            const progress =
              list.items.length > 0
                ? (checkedCount / list.items.length) * 100
                : 0;
            const gradients = [
              "bg-primary-secondary-25",
              "bg-primary-secondary-135",
              "bg-primary-secondary-270",
            ];

            return (
              <div
                key={list.id}
                className="group relative rounded-3xl border border-border bg-card shadow-sm hover:shadow-brand-glow transition-all duration-300 flex flex-col h-full overflow-hidden"
              >
                {/* Top accent bar using different gradient angles */}
                <div
                  className={`h-1 w-full ${gradients[idx % gradients.length]}`}
                />

                <div className="p-6 flex flex-col flex-1">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors uppercase tracking-wider text-sm truncate pr-2">
                      {list.name}
                    </h3>
                    <button
                      onClick={() => handleDeleteList(list.id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-xl hover:bg-destructive/10 shrink-0"
                      aria-label={L(
                        "MealPlannerAPI",
                        "ShoppingList:DeleteList",
                      )}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </div>

                  {/* Progress bar */}
                  {list.items.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                        <span>
                          {checkedCount} {L("MealPlannerAPI", "Common:Of")}{" "}
                          {list.items.length}{" "}
                          {L("MealPlannerAPI", "Common:Completed")}
                        </span>
                        <span className="font-semibold text-primary">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-brand-gradient rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Items */}
                  <div className="space-y-2 flex-1">
                    {list.items.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic py-4 text-center">
                        {L("MealPlannerAPI", "ShoppingList:NoItems")}
                      </p>
                    ) : (
                      list.items.map((item) => {
                        const cat = getCategoryDetails(item.category);
                        return (
                          <div
                            key={item.id}
                            className={`group/item flex items-center justify-between p-2.5 rounded-xl transition-all ${
                              item.isChecked
                                ? "opacity-50"
                                : "hover:bg-muted/50"
                            }`}
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <button
                                onClick={() =>
                                  handleToggleItem(list.id, item.id)
                                }
                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
                                  item.isChecked
                                    ? "bg-primary border-primary text-primary-foreground"
                                    : "border-border hover:border-primary"
                                }`}
                                aria-label={
                                  item.isChecked ? "Uncheck item" : "Check item"
                                }
                              >
                                {item.isChecked && (
                                  <Check size={11} aria-hidden="true" />
                                )}
                              </button>
                              <div className="flex flex-col overflow-hidden">
                                <span
                                  className={`text-sm font-medium truncate ${
                                    item.isChecked
                                      ? "line-through text-muted-foreground"
                                      : "text-foreground"
                                  }`}
                                >
                                  {item.name}
                                </span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  {item.quantity && (
                                    <span className="text-[11px] text-muted-foreground px-1.5 py-0.5 rounded-md bg-muted border border-border">
                                      {item.quantity} {item.unit}
                                    </span>
                                  )}
                                  <span
                                    className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${cat.color}`}
                                  >
                                    {L("MealPlannerAPI", cat.key)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                handleDeleteListItem(list.id, item.id)
                              }
                              className="opacity-0 group-hover/item:opacity-100 p-1.5 text-muted-foreground hover:text-destructive transition-all rounded-lg hover:bg-destructive/10 shrink-0"
                              aria-label="Remove item"
                            >
                              <Plus
                                size={13}
                                className="rotate-45"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-end">
                    <button
                      className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                      onClick={() => handleAddItem(list.id)}
                    >
                      <Plus size={12} aria-hidden="true" />
                      {L("MealPlannerAPI", "ShoppingList:AddItem")}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

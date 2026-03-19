'use client'
import React, { useState, useEffect } from 'react'
import { recipes as recipeApi } from '@/libs/api';
import RecipeCardGrid from './components/RecipeCardGrid';
import { Recipe } from '@/libs/interfaceDTO';

export default function Page() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const response = await recipeApi.getList();
        // Assuming response.data contains the { items: Recipe[], totalCount: number } structure from dtoAPI
        setRecipes(response.data.items);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-6 pt-24 pb-12">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Recipes</h1>
      <p className="text-zinc-500 mb-8">Discover and manage your recipes.</p>
      {/* <div className="mb-8">
        <RecipeCardGrid></RecipeCardGrid>
      </div> */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div 
              key={recipe.id} 
              className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer group"
            >
              <h2 className="font-semibold text-lg text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">
                {recipe.name}
              </h2>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                {recipe.description}
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500">
                <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins</span>
                <span>•</span>
                <span>Difficulty: {recipe.difficultyLevel}/5</span>
              </div>
            </div>
          ))}
          {recipes.length === 0 && (
            <div className="col-span-full py-20 text-center text-zinc-500">
              No recipes found.
            </div>
          )}
        </div>
      )}
        </div>
  )
}

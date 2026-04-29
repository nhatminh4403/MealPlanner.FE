import { 
  RecipeSummary, 
  Recipe, 
  DashboardStats, 
  UserProfile, 
  MealPlan, 
  ShoppingList,
  TrendingRecipe,
  PagedResult
} from "./interfaceDTO";

export const MOCK_RECIPES_SUMMARY: RecipeSummary[] = [
  {
    id: "r1",
    name: "Classic Beef Lasagna",
    cuisine: "Italian",
    difficulty: 1,
    totalTimeMinutes: 90,
    servings: 6,
    rating: 4.8,
    reviewCount: 124,
    imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
    description: "Layers of pasta, rich meat sauce, and creamy béchamel bake together in this ultimate comfort food.",
    tags: ["Dinner", "Comfort Food", "Pasta"],
  },
  {
    id: "r2",
    name: "Fresh Avocado Toast",
    cuisine: "International",
    difficulty: 0,
    totalTimeMinutes: 10,
    servings: 1,
    rating: 4.5,
    reviewCount: 89,
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    description: "Multi-grain bread topped with mashed avocado, chili flakes, and a squeeze of lime.",
    tags: ["Breakfast", "Healthy", "Quick"],
  },
  {
    id: "r3",
    name: "Spiced Chickpea Curry",
    cuisine: "Indian",
    difficulty: 1,
    totalTimeMinutes: 40,
    servings: 4,
    rating: 4.7,
    reviewCount: 56,
    imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
    description: "A hearty and aromatic vegetarian curry made with chickpeas, tomatoes, and blend of Indian spices.",
    tags: ["Vegan", "Dinner", "Spicy"],
  },
  {
    id: "r4",
    name: "Grilled Salmon with Asparagus",
    cuisine: "Seafood",
    difficulty: 1,
    totalTimeMinutes: 30,
    servings: 2,
    rating: 4.9,
    reviewCount: 210,
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80",
    description: "Perfectly seasoned grilled salmon served with crisp, buttered asparagus spears.",
    tags: ["Low Carb", "Healthy", "Dinner"],
  }
];

export const MOCK_RECIPES: Record<string, Recipe> = {
  "r1": {
    ...MOCK_RECIPES_SUMMARY[0],
    cookingTimeMinutes: 60,
    prepTimeMinutes: 30,
    instructions: [
      "In a large skillet, brown the ground beef over medium heat until cooked through. Drain excess fat.",
      "Add the onion and garlic and cook until softened, about 5 minutes.",
      "Stir in the tomato sauce, tomato paste, crushed tomatoes, and water. Simmer for 15 minutes.",
      "Preheat oven to 375°F (190°C).",
      "Spread 1 cup of meat sauce in the bottom of a 9x13 inch baking dish.",
      "Layer with noodles, ricotta mixture, mozzarella, and meat sauce.",
      "Repeat layers, ending with mozzarella.",
      "Bake for 45-50 minutes until noodles are tender and sauce is bubbly."
    ],
    author: {
      id: "u1",
      name: "Chef Mario",
      avatarUrl: "https://i.pravatar.cc/150?u=u1"
    },
    ingredients: [
      { id: "i1", name: "Lasagna Noodles", quantityGrams: 500, displayQuantity: "12 noodles" },
      { id: "i2", name: "Ground Beef", quantityGrams: 700, displayQuantity: "1.5 lbs" },
      { id: "i3", name: "Tomato Sauce", quantityGrams: 400, displayQuantity: "15 oz" },
      { id: "i4", name: "Ricotta Cheese", quantityGrams: 450, displayQuantity: "15 oz" },
      { id: "i5", name: "Mozzarella Cheese", quantityGrams: 300, displayQuantity: "3 cups" }
    ],
    nutritionPerServing: {
      calories: 550,
      proteinGrams: 35,
      carbsGrams: 45,
      fatGrams: 28,
      fiberGrams: 4
    }
  }
};

export const MOCK_STATS: DashboardStats = {
  totalRecipes: 12,
  totalFollowers: 145,
  totalFollowing: 82,
  averageRating: 4.7
};

export const MOCK_USER: UserProfile = {
  id: "u_demo",
  userName: "demo_user",
  name: "Demo",
  surname: "User",
  email: "demo@example.com",
  avatarUrl: "https://i.pravatar.cc/150?u=demo",
  followersCount: 145,
  followingCount: 82
};

export const MOCK_TRENDING: TrendingRecipe[] = MOCK_RECIPES_SUMMARY.map(r => ({
  id: r.id,
  name: r.name,
  imageUrl: r.imageUrl,
  rating: r.rating,
  reviewCount: r.reviewCount,
  trendingScore: 95,
  trendingSince: new Date().toISOString()
}));

export const MOCK_MEAL_PLAN: MealPlan = {
  id: "mp1",
  userId: "u_demo",
  weekStartDate: new Date().toISOString(),
  days: [
    {
      dayOfWeek: 1, // Monday
      meals: [
        {
          id: "m1",
          recipeId: "r2",
          recipeName: "Fresh Avocado Toast",
          mealType: 0,
          mealName: "Breakfast",
          dayOfWeek: 1
        },
        {
          id: "m2",
          recipeId: "r1",
          recipeName: "Classic Beef Lasagna",
          mealType: 2,
          mealName: "Dinner",
          dayOfWeek: 1
        }
      ]
    }
  ]
};

export const MOCK_SHOPPING_LISTS: PagedResult<ShoppingList> = {
  items: [
    {
      id: "sl1",
      name: "Weekly Groceries",
      creationTime: new Date().toISOString(),
      items: [
        { id: "sli1", name: "Avocados", quantity: "2", isChecked: false, category: 1, unit: "pcs" },
        { id: "sli2", name: "Ground Beef", quantity: "500g", isChecked: true, category: 2, unit: "g" },
      ]
    }
  ],
  totalCount: 1
};

export const MOCK_LOCALIZATION = {
  resources: {
    "MealPlanner": {
      texts: {
        "AppName": "Meal Planner",
        "Home": "Home",
        "Recipes": "Recipes",
        "MealPlans": "Meal Plans",
        "ShoppingList": "Shopping List",
      }
    },
    "MealPlannerAPI": {
      texts: {
        "Easy": "Easy",
        "Medium": "Medium",
        "Hard": "Hard",
        "RecipeNotFound": "Recipe not found",
        "FailedToLoadRecipe": "Failed to load recipe",
        "LoadingRecipe": "Loading recipe...",
        "BackToRecipes": "Back to Recipes",
        "DeleteRecipeConfirmation": "Are you sure you want to delete this recipe?",
        "RecipeDeleted": "Recipe deleted successfully",
        "FailedToDeleteRecipe": "Failed to delete recipe",
        "YourRecipe": "Your Recipe",
        "ReviewsCount": "{0} reviews",
        "MinTotal": "{0} min total",
        "PrepAndCookTime": "({0} prep, {1} cook)",
        "ServingsCount": "{0} servings",
        "NutritionPerServing": "Nutrition Per Serving",
        "Calories": "Calories",
        "Protein": "Protein",
        "Carbs": "Carbs",
        "Fat": "Fat",
        "Fiber": "Fiber",
        "Ingredients": "Ingredients",
        "NoIngredients": "No ingredients available",
        "Instructions": "Instructions",
        "NoInstructions": "No instructions available",
        "Common:WelcomeToMealPlanner": "Welcome to MealPlanner",
        "Common:AppIntroduction": "Your personalized recipe management system. Discover new tastes, plan your meals, and keep your shopping organized.",
        "Recipes:TopRated": "Top Rated",
        "Recipes:NoTopRatedRecipes": "No top-rated recipes yet.",
        "Recipes:Trending": "Trending",
        "Recipes:NoTrendingRecipes": "No trending recipes right now.",
        "Recipes:Browse": "Browse Recipes",
        "Recipes:TrendingLabel": "Trending",
        "Recipes:Rating": "Rating",
        "Recipes:TotalCount": "Total Recipes",
        "Recipes:Add": "Add Recipe",
        "Recipes:BasicInfoDesc": "Start with the core details of your recipe",
        "Auth:WelcomeBack": "Welcome back",
        "Auth:SignInDescription": "Enter your email or username and password to sign in",
        "Auth:EmailOrUsername": "Email or Username",
        "Auth:Password": "Password",
        "Auth:ForgotPassword": "Forgot password?",
        "Auth:RememberMe": "Remember me",
        "Auth:SignIn": "Sign In",
        "Auth:SigningIn": "Signing In...",
        "Auth:NoAccount": "Don't have an account?",
        "Auth:CreateAccount": "Create an account",
        "Auth:SuccessfullyLoggedIn": "Successfully logged in!",
        "Auth:LoginFailed": "Login failed. Please check your credentials.",
        "Auth:CreateAnAccount": "Create an account",
        "Auth:RegisterDescription": "Enter your details below to create your account and start planning your meals",
        "Auth:FullName": "Full Name",
        "Auth:Email": "Email",
        "Auth:AgreeToTerms": "I agree to the",
        "Auth:TermsOfService": "Terms of Service",
        "Auth:Register": "Sign Up",
        "Auth:Registering": "Creating Account...",
        "Auth:AlreadyHaveAccount": "Already have an account?",
        "Auth:PasswordsDoNotMatch": "Passwords do not match",
        "Auth:RegistrationSuccessful": "Registration successful! Please sign in.",
        "Auth:RegistrationFailed": "Registration failed",
        "Auth:RegistrationNamePlaceholder": "John Doe",
        "Auth:RegistrationEmailPlaceholder": "name@example.com",
        "Dashboard:Title": "Dashboard",
        "Dashboard:Overview": "Followers",
        "MealPlan:Title": "Weekly Meal Planner",
        "MealPlan:Description": "Manage your culinary journey...",
        "ShoppingList:Title": "Shopping Lists",
        "ShoppingList:Description": "Manage your grocery lists and track your items.",
        "Common:Confirm": "Confirm",
        "Common:View": "View",
        "Common:Welcome": "Welcome",
        "Common:Search": "Search",
        "Common:Next": "Following",
        "Common:UnexpectedErrorOccurred": "An unexpected error occurred.",
      }
    },
    "AbpUi": {
      texts: {
        "Edit": "Edit",
        "Delete": "Delete",
      }
    }
  }
};

export const MOCK_CONFIG = {
  currentUser: {
    id: "u_demo",
    userName: "demo_user",
    isAuthenticated: true,
  },
  auth: {
    grantedPolicies: {},
  },
  localization: {
    currentCulture: { name: "en", displayName: "English" },
    languages: [{ cultureName: "en", displayName: "English" }],
  },
  setting: {
    values: {
      "MealPlannerAPI.EnableMockData": "true"
    }
  }
};

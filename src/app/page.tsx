

export default function Home() {
  // TODO: Fetch featured recipes or status from API
  return (
    <div className="w-full max-w-6xl mx-auto px-6 pt-24 pb-12">
      <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Welcome to MealPlanner
        </h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          Your personalized dashboard and recipe management system is ready.
        </p>
      </div>
    </div>
  );
}

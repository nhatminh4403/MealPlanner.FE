import React from 'react'

export default function page() {
  // TODO: Fetch recipe details from API using ID
  return (
    <div className="w-full max-w-6xl mx-auto px-6 pt-24 pb-12">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Recipe Details</h1>
      <p className="mt-2 text-zinc-500">View information about this specific recipe.</p>
    </div>
  )
}

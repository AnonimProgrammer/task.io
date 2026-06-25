import { TaskBoard } from "@/components/TaskBoard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export default function Home() {
  return (
    <div className="min-h-full bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-colors duration-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
              <span className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome to Task.io
              </span>
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {isSupabaseConfigured() ? (
          <TaskBoard />
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-950/20 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
            Supabase is not configured. Copy <code>.env.example</code> to{" "}
            <code>.env.local</code> and add your project URL and anon key.
          </div>
        )}
      </main>
    </div>
  );
}

"use client";

import { TaskCard } from "@/components/TaskCard";
import type { TaskStatus, TaskWithAssignee } from "@/lib/types";

type TaskColumnProps = {
  title: string;
  status: TaskStatus;
  tasks: TaskWithAssignee[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: TaskWithAssignee) => void;
  showDivider?: boolean;
};

export function TaskColumn({
  title,
  status,
  tasks,
  onAddTask,
  onEditTask,
  showDivider = false,
}: TaskColumnProps) {
  return (
    <section
      className={`flex min-h-[28rem] min-w-0 flex-1 flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm transition-colors duration-200 ${showDivider ? "lg:border-l lg:pl-6" : ""}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
            {title}
          </h2>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">{tasks.length} tasks</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        {tasks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 px-4 py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No tasks yet
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onEditTask(task)} />
          ))
        )}
      </div>
    </section>
  );
}

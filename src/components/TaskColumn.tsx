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
      className={`flex min-h-[28rem] min-w-0 flex-1 flex-col ${showDivider ? "border-l border-zinc-200 pl-6" : ""}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            {title}
          </h2>
          <p className="text-xs text-zinc-400">{tasks.length} tasks</p>
        </div>
        <button
          type="button"
          onClick={() => onAddTask(status)}
          className="rounded-md border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          + Add
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        {tasks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/60 px-4 py-10 text-center text-sm text-zinc-500">
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

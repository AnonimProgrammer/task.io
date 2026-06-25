"use client";

import { MemberAvatar } from "@/components/MemberAvatar";
import type { TaskPriority, TaskWithAssignee } from "@/lib/types";

const priorityStyles: Record<TaskPriority, string> = {
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-red-50 text-red-700 border-red-200",
};

function formatDueDate(isoDate: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(isoDate));
}

type TaskCardProps = {
  task: TaskWithAssignee;
  onClick: () => void;
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="font-semibold text-zinc-900">{task.title}</h3>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${priorityStyles[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>
      <p className="mb-3 line-clamp-2 text-sm text-zinc-600">{task.summary}</p>
      <div className="flex items-end justify-between gap-3">
        <p className="text-xs text-zinc-500">Due {formatDueDate(task.due_at)}</p>
        <MemberAvatar
          initials={task.assignee?.initials}
          size="sm"
          title={task.assignee?.full_name ?? "Unassigned"}
        />
      </div>
    </button>
  );
}

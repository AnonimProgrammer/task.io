"use client";

import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type TaskPriority,
  type TaskStatus,
  type TeamMember,
} from "@/lib/types";

export type StatusFilter = TaskStatus | "all";
export type PriorityFilter = TaskPriority | "all";
export type AssigneeFilter = string | "all" | "unassigned";

type TaskFilterBarProps = {
  members: TeamMember[];
  statusFilter: StatusFilter;
  priorityFilter: PriorityFilter;
  assigneeFilter: AssigneeFilter;
  onStatusChange: (value: StatusFilter) => void;
  onPriorityChange: (value: PriorityFilter) => void;
  onAssigneeChange: (value: AssigneeFilter) => void;
  onReset: () => void;
};

export function TaskFilterBar({
  members,
  statusFilter,
  priorityFilter,
  assigneeFilter,
  onStatusChange,
  onPriorityChange,
  onAssigneeChange,
  onReset,
}: TaskFilterBarProps) {
  const hasActiveFilters =
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    assigneeFilter !== "all";

  return (
    <div className="mt-4 flex flex-wrap items-end gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="min-w-40 flex-1">
        <label
          htmlFor="status-filter"
          className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400"
        >
          Status
        </label>

        <select
          id="status-filter"
          value={statusFilter}
          onChange={(event) =>
            onStatusChange(event.target.value as StatusFilter)
          }
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-sky-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
        >
          <option value="all">All statuses</option>

          {TASK_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-40 flex-1">
        <label
          htmlFor="assignee-filter"
          className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400"
        >
          Assignee
        </label>

        <select
          id="assignee-filter"
          value={assigneeFilter}
          onChange={(event) => onAssigneeChange(event.target.value)}
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-sky-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
        >
          <option value="all">All members</option>
          <option value="unassigned">Unassigned</option>

          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.full_name}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-40 flex-1">
        <label
          htmlFor="priority-filter"
          className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400"
        >
          Priority
        </label>

        <select
          id="priority-filter"
          value={priorityFilter}
          onChange={(event) =>
            onPriorityChange(event.target.value as PriorityFilter)
          }
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-sky-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
        >
          <option value="all">All priorities</option>

          {TASK_PRIORITIES.map((priority) => (
            <option key={priority.value} value={priority.value}>
              {priority.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onReset}
        disabled={!hasActiveFilters}
        className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        Reset
      </button>
    </div>
  );
}
"use client";

import { FormEvent, useEffect, useState } from "react";
import { MemberPicker } from "@/components/MemberPicker";
import { Modal } from "@/components/Modal";
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type Task,
  type TaskPriority,
  type TaskStatus,
  type TeamMember,
} from "@/lib/types";

export type TaskFormValues = {
  title: string;
  summary: string;
  description: string;
  assigneeId: string | null;
  dueAt: string;
  priority: TaskPriority;
  status: TaskStatus;
};

type TaskFormModalProps = {
  open: boolean;
  title: string;
  members: TeamMember[];
  initialValues?: Partial<TaskFormValues>;
  submitLabel: string;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => Promise<void>;
};

function toLocalInputValue(isoDate: string) {
  const date = new Date(isoDate);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

function defaultDueAt() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(17, 0, 0, 0);
  return toLocalInputValue(date.toISOString());
}

export function taskToFormValues(task: Task): TaskFormValues {
  return {
    title: task.title,
    summary: task.summary,
    description: task.description ?? "",
    assigneeId: task.assignee_id,
    dueAt: toLocalInputValue(task.due_at),
    priority: task.priority,
    status: task.status,
  };
}

export function TaskFormModal({
  open,
  title,
  members,
  initialValues,
  submitLabel,
  onClose,
  onSubmit,
}: TaskFormModalProps) {
  const [form, setForm] = useState<TaskFormValues>({
    title: "",
    summary: "",
    description: "",
    assigneeId: null,
    dueAt: defaultDueAt(),
    priority: "medium",
    status: "to_do",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setForm({
      title: initialValues?.title ?? "",
      summary: initialValues?.summary ?? "",
      description: initialValues?.description ?? "",
      assigneeId: initialValues?.assigneeId ?? null,
      dueAt: initialValues?.dueAt ?? defaultDueAt(),
      priority: initialValues?.priority ?? "medium",
      status: initialValues?.status ?? "to_do",
    });
    setError(null);
    setSubmitting(false);
  }, [open, initialValues]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!form.title.trim() || !form.summary.trim()) {
      setError("Title and summary are required.");
      return;
    }

    if (!form.dueAt) {
      setError("Due time is required.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        title: form.title.trim(),
        summary: form.summary.trim(),
        description: form.description.trim(),
      });
      onClose();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to save task.",
      );
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-700">
            Title
          </span>
          <input
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({ ...current, title: event.target.value }))
            }
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            placeholder="Task title"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-700">
            Summary
          </span>
          <input
            value={form.summary}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                summary: event.target.value,
              }))
            }
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            placeholder="Short summary"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-700">
            Description{" "}
            <span className="font-normal text-zinc-400">(optional)</span>
          </span>
          <textarea
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            rows={3}
            className="w-full resize-none rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            placeholder="Additional details"
          />
        </label>

        <MemberPicker
          members={members}
          selectedId={form.assigneeId}
          onSelect={(assigneeId) =>
            setForm((current) => ({ ...current, assigneeId }))
          }
        />

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-zinc-700">
              Due time
            </span>
            <input
              type="datetime-local"
              value={form.dueAt}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  dueAt: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-zinc-700">
              Priority
            </span>
            <select
              value={form.priority}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  priority: event.target.value as TaskPriority,
                }))
              }
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            >
              {TASK_PRIORITIES.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-700">
            Status
          </span>
          <select
            value={form.status}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                status: event.target.value as TaskStatus,
              }))
            }
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          >
            {TASK_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {submitting ? "Saving…" : submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}

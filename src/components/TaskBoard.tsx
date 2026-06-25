"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { TaskColumn } from "@/components/TaskColumn";
import {
  TaskFilterBar,
  type AssigneeFilter,
  type PriorityFilter,
  type StatusFilter,
} from "@/components/TaskFilterBar";
import { TaskFormModal, taskToFormValues } from "@/components/TaskFormModal";
import { TeamBar } from "@/components/TeamBar";
import { createSupabaseClient } from "@/lib/supabase/client";
import {
  TASK_STATUSES,
  type Task,
  type TaskStatus,
  type TaskWithAssignee,
  type TeamMember,
} from "@/lib/types";

function mapTasksWithAssignees(
  tasks: Task[],
  members: TeamMember[],
): TaskWithAssignee[] {
  const membersById = new Map(
    members.map((member) => [member.id, member]),
  );

  return tasks.map((task) => ({
    ...task,
    assignee: task.assignee_id
      ? membersById.get(task.assignee_id) ?? null
      : null,
  }));
}

export function TaskBoard() {
  const supabase = createSupabaseClient();

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<TaskWithAssignee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] =
    useState<TaskWithAssignee | null>(null);
  const [defaultStatus, setDefaultStatus] =
    useState<TaskStatus>("to_do");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] =
    useState<PriorityFilter>("all");
  const [assigneeFilter, setAssigneeFilter] =
    useState<AssigneeFilter>("all");

  const loadData = useCallback(async () => {
    const [membersResult, tasksResult] = await Promise.all([
      supabase
        .from("team_members")
        .select("*")
        .order("created_at"),

      supabase
        .from("tasks")
        .select("*")
        .order("position")
        .order("created_at"),
    ]);

    if (membersResult.error) {
      throw membersResult.error;
    }

    if (tasksResult.error) {
      throw tasksResult.error;
    }

    setError(null);

    const nextMembers = (membersResult.data ?? []) as TeamMember[];

    const nextTasks = mapTasksWithAssignees(
      (tasksResult.data ?? []) as Task[],
      nextMembers,
    );

    setMembers(nextMembers);
    setTasks(nextTasks);
  }, [supabase]);

  useEffect(() => {
    loadData()
      .catch((loadError) => {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load board data.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [loadData]);

  const handleAddMember = async ({
    fullName,
    email,
  }: {
    fullName: string;
    email: string;
  }) => {
    const { error: insertError } = await supabase
      .from("team_members")
      .insert({
        full_name: fullName,
        email: email || null,
      });

    if (insertError) {
      throw insertError;
    }

    await loadData();
  };

  const handleRemoveMember = async (memberId: string) => {
    const member = members.find(
      (item) => item.id === memberId,
    );

    if (!member) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove ${member.full_name}?`,
    );

    if (!confirmed) {
      return;
    }

    setError(null);

    try {
      const { error: unassignError } = await supabase
        .from("tasks")
        .update({
          assignee_id: null,
        })
        .eq("assignee_id", memberId);

      if (unassignError) {
        throw unassignError;
      }

      const { error: deleteError } = await supabase
        .from("team_members")
        .delete()
        .eq("id", memberId);

      if (deleteError) {
        throw deleteError;
      }

      if (assigneeFilter === memberId) {
        setAssigneeFilter("all");
      }

      await loadData();
    } catch (removeError) {
      setError(
        removeError instanceof Error
          ? removeError.message
          : "Failed to remove team member.",
      );
    }
  };

  const handleCreateTask = async (values: {
    title: string;
    summary: string;
    description: string;
    assigneeId: string | null;
    dueAt: string;
    priority: Task["priority"];
    status: TaskStatus;
  }) => {
    const tasksInColumn = tasks.filter(
      (task) => task.status === values.status,
    );

    const position =
      tasksInColumn.length > 0
        ? Math.max(
            ...tasksInColumn.map((task) => task.position),
          ) + 1
        : 0;

    const { error: insertError } = await supabase
      .from("tasks")
      .insert({
        title: values.title,
        summary: values.summary,
        description: values.description || null,
        assignee_id: values.assigneeId,
        due_at: new Date(values.dueAt).toISOString(),
        priority: values.priority,
        status: values.status,
        position,
      });

    if (insertError) {
      throw insertError;
    }

    await loadData();
  };

  const handleUpdateTask = async (values: {
    title: string;
    summary: string;
    description: string;
    assigneeId: string | null;
    dueAt: string;
    priority: Task["priority"];
    status: TaskStatus;
  }) => {
    if (!editingTask) {
      return;
    }

    const { error: updateError } = await supabase
      .from("tasks")
      .update({
        title: values.title,
        summary: values.summary,
        description: values.description || null,
        assignee_id: values.assigneeId,
        due_at: new Date(values.dueAt).toISOString(),
        priority: values.priority,
        status: values.status,
      })
      .eq("id", editingTask.id);

    if (updateError) {
      throw updateError;
    }

    await loadData();
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setPriorityFilter("all");
    setAssigneeFilter("all");
  };

  const openCreateTask = (status: TaskStatus) => {
    setEditingTask(null);
    setDefaultStatus(status);
    setTaskModalOpen(true);
  };

  const openEditTask = (task: TaskWithAssignee) => {
    setEditingTask(task);
    setDefaultStatus(task.status);
    setTaskModalOpen(true);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        statusFilter === "all" ||
        task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" ||
        task.priority === priorityFilter;

      const matchesAssignee =
        assigneeFilter === "all" ||
        (assigneeFilter === "unassigned"
          ? task.assignee_id === null
          : task.assignee_id === assigneeFilter);

      return (
        matchesStatus &&
        matchesPriority &&
        matchesAssignee
      );
    });
  }, [
    tasks,
    statusFilter,
    priorityFilter,
    assigneeFilter,
  ]);

  const tasksByStatus = useMemo(() => {
    return TASK_STATUSES.reduce(
      (groups, status) => {
        groups[status.value] = filteredTasks.filter(
          (task) => task.status === status.value,
        );

        return groups;
      },
      {} as Record<TaskStatus, TaskWithAssignee[]>,
    );
  }, [filteredTasks]);

  const visibleStatuses = useMemo(() => {
    return TASK_STATUSES.filter(
      (status) =>
        statusFilter === "all" ||
        status.value === statusFilter,
    );
  }, [statusFilter]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
        Loading board…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-950/20 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <TeamBar
          members={members}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
        />

        <button
          type="button"
          onClick={() => openCreateTask("to_do")}
          className="cursor-pointer rounded-xl border border-sky-200 bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-md active:scale-[0.98] dark:border-sky-800 dark:hover:bg-sky-500"
        >
          Create Task
        </button>
      </div>

      <TaskFilterBar
        members={members}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        assigneeFilter={assigneeFilter}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
        onAssigneeChange={setAssigneeFilter}
        onReset={resetFilters}
      />

      <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 transition-colors duration-200 dark:border-zinc-800 dark:bg-zinc-900/20">
        <div
          className={`grid gap-6 ${
            statusFilter === "all"
              ? "lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {visibleStatuses.map((status, index) => (
            <TaskColumn
              key={status.value}
              title={status.label}
              status={status.value}
              tasks={tasksByStatus[status.value]}
              onAddTask={openCreateTask}
              onEditTask={openEditTask}
              showDivider={
                statusFilter === "all" && index > 0
              }
            />
          ))}
        </div>
      </div>

      <TaskFormModal
        open={taskModalOpen}
        title={editingTask ? "Edit Task" : "Create Task"}
        members={members}
        initialValues={
          editingTask
            ? taskToFormValues(editingTask)
            : {
                status: defaultStatus,
              }
        }
        submitLabel={
          editingTask ? "Save Changes" : "Create Task"
        }
        onClose={() => {
          setTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={
          editingTask
            ? handleUpdateTask
            : handleCreateTask
        }
      />
    </>
  );
}
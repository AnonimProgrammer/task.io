export type TaskStatus = "to_do" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export type TeamMember = {
  id: string;
  full_name: string;
  email: string | null;
  initials: string;
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: string;
  title: string;
  summary: string;
  description: string | null;
  assignee_id: string | null;
  due_at: string;
  priority: TaskPriority;
  status: TaskStatus;
  position: number;
  created_at: string;
  updated_at: string;
};

export type TaskWithAssignee = Task & {
  assignee: TeamMember | null;
};

export const TASK_STATUSES: { value: TaskStatus; label: string }[] = [
  { value: "to_do", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export const TASK_PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

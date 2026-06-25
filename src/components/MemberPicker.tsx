"use client";

import { useState } from "react";
import { MemberAvatar } from "@/components/MemberAvatar";
import type { TeamMember } from "@/lib/types";

type MemberPickerProps = {
  members: TeamMember[];
  selectedId: string | null;
  onSelect: (memberId: string | null) => void;
  label?: string;
};

export function MemberPicker({
  members,
  selectedId,
  onSelect,
  label = "Assignee",
}: MemberPickerProps) {
  const [open, setOpen] = useState(false);
  const selected = members.find((member) => member.id === selectedId) ?? null;

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</p>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="mb-3 flex w-full items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2.5 text-left shadow-sm transition hover:border-zinc-300 dark:hover:border-zinc-700 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <MemberAvatar
            initials={selected?.initials}
            title={selected ? selected.full_name : "No assignee"}
          />
          <span className="text-sm text-zinc-600 dark:text-zinc-300">
            {selected ? selected.full_name : "No assignee"}
          </span>
        </div>
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
          {open ? "Hide" : "Show"}
        </span>
      </button>

      {open && (
        <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-2">
          <button
            type="button"
            onClick={() => {
              onSelect(null);
              setOpen(false);
            }}
            className={`flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-white dark:hover:bg-zinc-900 cursor-pointer text-zinc-600 dark:text-zinc-300 ${selectedId === null ? "bg-white dark:bg-zinc-900" : ""}`}
          >
            <MemberAvatar size="sm" />
            <span>No assignee</span>
          </button>
          {members.map((member) => (
            <button
              key={member.id}
              type="button"
              onClick={() => {
                onSelect(member.id);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-white dark:hover:bg-zinc-900 cursor-pointer text-zinc-900 dark:text-zinc-100 ${selectedId === member.id ? "bg-white dark:bg-zinc-900" : ""}`}
            >
              <MemberAvatar initials={member.initials} size="sm" />
              <div className="min-w-0">
                <p className="truncate font-medium text-zinc-900 dark:text-zinc-50">
                  {member.full_name}
                </p>
                {member.email && (
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{member.email}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

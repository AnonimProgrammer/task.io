"use client";

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
  const selected = members.find((member) => member.id === selectedId) ?? null;

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-zinc-700">{label}</p>
      <div className="mb-3 flex items-center gap-3">
        <MemberAvatar
          initials={selected?.initials}
          title={selected ? selected.full_name : "No assignee"}
        />
        <span className="text-sm text-zinc-600">
          {selected ? selected.full_name : "No assignee"}
        </span>
      </div>
      <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-zinc-200 p-2">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={`flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-zinc-50 ${selectedId === null ? "bg-zinc-100" : ""}`}
        >
          <MemberAvatar size="sm" />
          <span className="text-zinc-600">No assignee</span>
        </button>
        {members.map((member) => (
          <button
            key={member.id}
            type="button"
            onClick={() => onSelect(member.id)}
            className={`flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-zinc-50 ${selectedId === member.id ? "bg-zinc-100" : ""}`}
          >
            <MemberAvatar initials={member.initials} size="sm" />
            <div className="min-w-0">
              <p className="truncate font-medium text-zinc-900">
                {member.full_name}
              </p>
              {member.email && (
                <p className="truncate text-xs text-zinc-500">{member.email}</p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

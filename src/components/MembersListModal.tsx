"use client";

import { MemberAvatar } from "@/components/MemberAvatar";
import { Modal } from "@/components/Modal";
import type { TeamMember } from "@/lib/types";

type MembersListModalProps = {
  open: boolean;
  members: TeamMember[];
  onClose: () => void;
  onRemoveMember: (memberId: string) => Promise<void>;
};

export function MembersListModal({
  open,
  members,
  onClose,
  onRemoveMember,
}: MembersListModalProps) {
  return (
    <Modal open={open} title="Team Members" onClose={onClose}>
      <ul className="max-h-80 space-y-2 overflow-y-auto">
        {members.length === 0 ? (
          <li className="rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 px-4 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No team members yet.
          </li>
        ) : (
          members.map((member) => (
            <li
              key={member.id}
              className="flex items-center gap-3 rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-3"
            >
              <MemberAvatar initials={member.initials} />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {member.full_name}
                </p>
                {member.email ? (
                  <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                    {member.email}
                  </p>
                ) : (
                  <p className="text-sm text-zinc-400 dark:text-zinc-500">
                    No email
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onRemoveMember(member.id)}
                aria-label={`Remove ${member.full_name}`}
                title="Remove member"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-zinc-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v5" />
                  <path d="M14 11v5" />
                </svg>
              </button>
            </li>
          ))
        )}
      </ul>
    </Modal>
  );
}

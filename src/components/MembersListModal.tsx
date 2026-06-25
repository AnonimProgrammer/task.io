"use client";

import { MemberAvatar } from "@/components/MemberAvatar";
import { Modal } from "@/components/Modal";
import type { TeamMember } from "@/lib/types";

type MembersListModalProps = {
  open: boolean;
  members: TeamMember[];
  onClose: () => void;
};

export function MembersListModal({
  open,
  members,
  onClose,
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
              <div className="min-w-0">
                <p className="font-medium text-zinc-900 dark:text-zinc-50">{member.full_name}</p>
                {member.email ? (
                  <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">{member.email}</p>
                ) : (
                  <p className="text-sm text-zinc-400 dark:text-zinc-500">No email</p>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </Modal>
  );
}

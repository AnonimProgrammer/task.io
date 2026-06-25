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
          <li className="rounded-lg border border-dashed border-zinc-300 px-4 py-6 text-center text-sm text-zinc-500">
            No team members yet.
          </li>
        ) : (
          members.map((member) => (
            <li
              key={member.id}
              className="flex items-center gap-3 rounded-lg border border-zinc-200 px-3 py-3"
            >
              <MemberAvatar initials={member.initials} />
              <div className="min-w-0">
                <p className="font-medium text-zinc-900">{member.full_name}</p>
                {member.email ? (
                  <p className="truncate text-sm text-zinc-500">{member.email}</p>
                ) : (
                  <p className="text-sm text-zinc-400">No email</p>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </Modal>
  );
}

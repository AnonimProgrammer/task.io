"use client";

import { useState } from "react";
import { AddMemberModal } from "@/components/AddMemberModal";
import { MemberAvatar } from "@/components/MemberAvatar";
import { MembersListModal } from "@/components/MembersListModal";
import type { TeamMember } from "@/lib/types";

type TeamBarProps = {
  members: TeamMember[];
  onAddMember: (data: { fullName: string; email: string }) => Promise<void>;
};

export function TeamBar({ members, onAddMember }: TeamBarProps) {
  const [membersOpen, setMembersOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const visibleMembers = members.slice(0, 2);
  const hiddenCount = Math.max(members.length - visibleMembers.length, 0);

  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-zinc-700">Team:</span>
          <button
            type="button"
            onClick={() => setMembersOpen(true)}
            className="flex items-center -space-x-2 rounded-full p-1 transition-colors hover:bg-zinc-100"
            title="View all team members"
          >
            {visibleMembers.length === 0 ? (
              <MemberAvatar size="md" />
            ) : (
              visibleMembers.map((member) => (
                <MemberAvatar
                  key={member.id}
                  initials={member.initials}
                  title={member.full_name}
                  className="ring-2 ring-white"
                />
              ))
            )}
            {hiddenCount > 0 && (
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-black text-xs font-semibold text-white ring-2 ring-white">
                +{hiddenCount}
              </span>
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50"
        >
          Add Member
        </button>
      </div>

      <MembersListModal
        open={membersOpen}
        members={members}
        onClose={() => setMembersOpen(false)}
      />
      <AddMemberModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={onAddMember}
      />
    </>
  );
}

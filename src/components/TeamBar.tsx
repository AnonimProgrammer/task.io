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
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setMembersOpen(true)}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:shadow-md active:scale-[0.98]"
          title="View all team members"
        >
          <span className="text-base font-semibold text-zinc-800 dark:text-zinc-200">Team</span>
          <span className="flex -space-x-3">
            {visibleMembers.length === 0 ? (
              <MemberAvatar size="md" />
            ) : (
              visibleMembers.map((member) => (
                <MemberAvatar
                  key={member.id}
                  initials={member.initials}
                  title={member.full_name}
                  className="ring-2 ring-white dark:ring-zinc-900"
                />
              ))
            )}
            {hiddenCount > 0 && (
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-black dark:border-zinc-950 bg-black dark:bg-zinc-950 text-xs font-semibold text-white dark:text-zinc-200 ring-2 ring-white dark:ring-zinc-900">
                +{hiddenCount}
              </span>
            )}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-200 hover:shadow-md active:scale-[0.98]"
          title="Add team member"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
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

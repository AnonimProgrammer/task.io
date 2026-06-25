"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/components/Modal";

type AddMemberModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { fullName: string; email: string }) => Promise<void>;
};

export function AddMemberModal({ open, onClose, onSubmit }: AddMemberModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setFullName("");
    setEmail("");
    setError(null);
    setSubmitting(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const trimmedName = fullName.trim();
    if (!trimmedName) {
      setError("Full name is required.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ fullName: trimmedName, email: email.trim() });
      reset();
      onClose();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to add member.",
      );
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} title="Add Member" onClose={handleClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-700">
            Full name
          </span>
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            placeholder="Omar Ismayilov"
            autoFocus
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-700">
            Email <span className="font-normal text-zinc-400">(optional)</span>
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            placeholder="omar@example.com"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {submitting ? "Adding…" : "Add Member"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

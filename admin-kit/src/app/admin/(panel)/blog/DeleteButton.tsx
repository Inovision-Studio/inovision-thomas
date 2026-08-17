"use client";

import { useConfirm, useToast } from "@/components/admin/Dialogs";
import { deletePost } from "./actions";

export default function DeleteButton({ id }: { id: number }) {
  const confirm = useConfirm();
  const toast = useToast();

  // The dialog is async, so the native submit can't be gated inline — always
  // stop it, then run the delete only once the user has actually confirmed.
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const ok = await confirm({
      title: "Delete this post?",
      body: "This removes it from the live site. It can't be undone.",
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;
    try {
      await deletePost(id);
      toast("Deleted");
    } catch {
      toast("Delete failed — try again", "error");
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <button type="submit" className="text-xs text-red-400 hover:underline">
        Delete
      </button>
    </form>
  );
}

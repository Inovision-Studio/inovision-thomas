"use client";

import { useState } from "react";
import ImagePicker from "@/components/admin/ImagePicker";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import AiBar, { type AiPatch } from "@/components/admin/AiBar";
import { inputClass } from "@/components/admin/ui";
import { slugify } from "@/lib/slug";
import { createPost, updatePost } from "./actions";

export type PostInit = {
  id: number;
  title: string;
  slug: string;
  body: string;
  excerpt: string;
  tags: string[];
  image: string | null;
  published: boolean;
};

export default function PostForm({ init }: { init?: PostInit }) {
  const [title, setTitle] = useState(init?.title ?? "");
  const [slug, setSlug] = useState(init?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(!!init);
  const [excerpt, setExcerpt] = useState(init?.excerpt ?? "");
  const [tags, setTags] = useState((init?.tags ?? []).join(", "));
  const [body, setBody] = useState(init?.body ?? "");
  const [image, setImage] = useState<string | null>(init?.image ?? null);

  const action = init ? updatePost.bind(null, init.id) : createPost;

  function applyAi(patch: AiPatch) {
    if (patch.title !== undefined) {
      setTitle(patch.title);
      if (!slugEdited && !patch.slug) setSlug(slugify(patch.title));
    }
    if (patch.slug !== undefined && !slugEdited) setSlug(patch.slug);
    if (patch.excerpt !== undefined) setExcerpt(patch.excerpt);
    if (patch.body !== undefined) setBody(patch.body);
    if (patch.tags !== undefined) setTags(patch.tags.join(", "));
    if (patch.image !== undefined) setImage(patch.image || null);
  }

  return (
    <form action={action} className="card max-w-4xl space-y-5 p-6">
      <input type="hidden" name="image" value={image ?? ""} />

      <AiBar
        current={{ title, slug, excerpt, body, tags: tags.split(",").map((t) => t.trim()).filter(Boolean), image: image ?? "" }}
        onApply={applyAi}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-white/80">Title</label>
          <input
            name="title"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugEdited) setSlug(slugify(e.target.value));
            }}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/80">Slug</label>
          <input
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugEdited(true);
            }}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 flex items-center justify-between text-sm text-white/80">
          <span>Excerpt <span className="text-white/40">— shows on cards and in Google</span></span>
          <span className={`text-xs ${excerpt.length > 155 ? "text-amber-300" : "text-white/40"}`}>{excerpt.length}/160</span>
        </label>
        <textarea name="excerpt" rows={2} maxLength={160} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className={inputClass} />
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <div>
          <label className="mb-1 block text-sm text-white/80">Tags <span className="text-white/40">— comma separated</span></label>
          <input name="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="vapes, new arrivals, glass" className={inputClass} />
        </div>
        <ImagePicker label="Cover image" value={image} onChange={setImage} />
      </div>

      <div>
        <label className="mb-1 block text-sm text-white/80">Body</label>
        <MarkdownEditor name="body" value={body} onChange={setBody} />
      </div>

      <label className="flex items-center gap-2 text-sm text-white/80">
        <input name="published" type="checkbox" defaultChecked={init ? init.published : true} />
        Published
      </label>

      <button type="submit" className="btn-accent">{init ? "Save changes" : "Create post"}</button>
    </form>
  );
}

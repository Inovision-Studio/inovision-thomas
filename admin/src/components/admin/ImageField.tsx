"use client";

import { useState } from "react";
import ImagePicker from "./ImagePicker";

/** ImagePicker that participates in a plain <form> post via a hidden input. */
export default function ImageField({ name, initial, label }: { name: string; initial: string; label?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <>
      <input type="hidden" name={name} value={value} />
      <ImagePicker value={value} onChange={setValue} label={label ?? "Image"} />
      {value ? (
        <button type="button" onClick={() => setValue("")} className="mt-1 text-left text-xs text-white/50 hover:text-white">
          Clear (use default)
        </button>
      ) : null}
    </>
  );
}

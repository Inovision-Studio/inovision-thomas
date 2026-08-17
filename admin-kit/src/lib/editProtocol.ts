import type { EditType } from "./editAttrs";
import type { HomeLayout, LayoutControl, SectionId } from "./homeLayout";

/** Messages the edit iframe (EditBridge) posts up to the admin editor. */
export type ToParent =
  | { type: "ready" }
  | { type: "select"; key: string; editType: EditType; value: string; section: string; rect: DOMRectInit }
  | { type: "selectSection"; section: SectionId }
  | { type: "layout"; section: SectionId; control: LayoutControl; value: string | number };

/** Messages the admin editor posts down into the iframe. */
export type ToFrame =
  | { type: "preview"; key: string; editType: EditType; value: string }
  | { type: "layout"; layout: HomeLayout }
  | { type: "reload" }
  | { type: "scrollTo"; section: SectionId }
  | { type: "select"; key: string };

export const EDIT_MSG = "site-edit" as const;
export type Envelope<T> = { src: typeof EDIT_MSG; msg: T };

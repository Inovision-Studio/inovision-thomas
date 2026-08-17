/**
 * Edit-mode attribute helpers. When `on` is false every helper returns `{}` so
 * spreading it into JSX emits nothing — visitor HTML stays byte-identical.
 * When on (owner + ?edit=1), elements get data-* hooks the EditBridge script
 * uses to make them clickable / reorderable / resizable inside the admin iframe.
 */
export type EditType = "text" | "textarea" | "list" | "image" | "gallery";

const NONE = {} as const;

export const editAttrs = (on: boolean) =>
  on
    ? (key: string, type: EditType = "text") => ({ "data-edit-key": key, "data-edit-type": type })
    : (_key: string, _type: EditType = "text") => NONE;

export const sectionAttrs = (on: boolean) =>
  on ? (id: string) => ({ "data-section": id }) : (_id: string) => NONE;

export const layoutAttrs = (on: boolean) =>
  on
    ? (id: string, control: string) => ({ "data-edit-layout": `${id}:${control}` })
    : (_id: string, _control: string) => NONE;

/**
 * Material Web runtime registration entrypoint.
 * Keep runtime "material/*" imports centralized in this file only.
 */

type MaterialLoader = {
  tag: string;
  load: () => Promise<unknown>;
};

const MATERIAL_LOADERS: MaterialLoader[] = [
  { tag: "md-text-field", load: () => import("material/text/text-field.js") },
  { tag: "md-button", load: () => import("material/buttons/button.js") },
  {
    tag: "md-icon-button",
    load: () => import("material/buttons/icon-button.js"),
  },
  { tag: "md-fab", load: () => import("material/buttons/fab.js") },
  { tag: "md-checkbox", load: () => import("material/checkbox/checkbox.js") },
  { tag: "md-radio", load: () => import("material/radio/radio.js") },
  { tag: "md-switch", load: () => import("material/switch/switch.js") },
  { tag: "md-slider", load: () => import("material/slider/slider.js") },
  { tag: "md-select", load: () => import("material/select/select.js") },
  {
    tag: "md-select-option",
    load: () => import("material/select/select-option.js"),
  },
  { tag: "md-tabs", load: () => import("material/tabs/tabs.js") },
  { tag: "md-tab", load: () => import("material/tabs/tab.js") },
  { tag: "md-nav-rail", load: () => import("material/nav/rail.js") },
  { tag: "md-nav-bar", load: () => import("material/nav/bar.js") },
  { tag: "md-nav-item", load: () => import("material/nav/item.js") },
  { tag: "md-menu", load: () => import("material/menu/menu.js") },
  { tag: "md-menu-item", load: () => import("material/menu/menu-item.js") },
  { tag: "md-dialog", load: () => import("material/dialog/dialog.js") },
  { tag: "md-progress", load: () => import("material/progress/progress.js") },
  { tag: "md-chip-set", load: () => import("material/chips/chip-set.js") },
  { tag: "md-chip", load: () => import("material/chips/chip.js") },
  { tag: "md-card", load: () => import("material/card/card.js") },
  { tag: "md-list", load: () => import("material/list/list.js") },
  { tag: "md-icon", load: () => import("material/icon/icon.js") },
  { tag: "md-divider", load: () => import("material/divider/divider.js") },
  { tag: "md-snackbar", load: () => import("material/snackbar/snackbar.js") },
  { tag: "md-badge", load: () => import("material/badge/badge.js") },
];

declare global {
  var __CALABASH_MATERIAL_REGISTRATION_PROMISE__: Promise<void> | undefined;
}

function hasCustomElementSupport(): boolean {
  return (
    typeof window !== "undefined" && typeof window.customElements !== "undefined"
  );
}

export async function ensureMaterialWebRegistered(): Promise<void> {
  if (!hasCustomElementSupport()) {
    return;
  }

  if (!globalThis.__CALABASH_MATERIAL_REGISTRATION_PROMISE__) {
    globalThis.__CALABASH_MATERIAL_REGISTRATION_PROMISE__ = (async () => {
      for (const { tag, load } of MATERIAL_LOADERS) {
        if (customElements.get(tag)) {
          continue;
        }
        await load();
      }
    })();
  }

  try {
    await globalThis.__CALABASH_MATERIAL_REGISTRATION_PROMISE__;
  } catch (error) {
    globalThis.__CALABASH_MATERIAL_REGISTRATION_PROMISE__ = undefined;
    throw error;
  }
}

import type { Material } from "@/services/api";

export type MaterialActionKind = "download" | "open-source" | "none";

export interface MaterialAction {
  kind: MaterialActionKind;
  url: string | null;
  reason?: string;
}

function getYouTubeId(url: string | undefined): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function hasActionableUrl(url: string | undefined): boolean {
  if (!url) return false;
  const normalized = url.trim();
  return normalized.length > 0 && normalized !== "#";
}

export function resolveMaterialAction(material: Material): MaterialAction {
  const materialUrl = material.url?.trim() || "";
  const youtubeUrl = material.youtubeUrl?.trim() || "";
  const hasYoutubeSource = Boolean(getYouTubeId(youtubeUrl) || getYouTubeId(materialUrl));

  if (material.type === "video") {
    if (hasYoutubeSource) {
      return {
        kind: "open-source",
        url: youtubeUrl || materialUrl,
      };
    }

    if (hasActionableUrl(materialUrl)) {
      return {
        kind: "download",
        url: materialUrl,
      };
    }

    return {
      kind: "none",
      url: null,
      reason: "This video does not have a playable or downloadable source yet.",
    };
  }

  if (hasActionableUrl(materialUrl)) {
    return {
      kind: "download",
      url: materialUrl,
    };
  }

  return {
    kind: "none",
    url: null,
    reason: "This resource is unavailable for download right now.",
  };
}

export function resolveUrlDownloadAction(url: string): MaterialAction {
  if (!hasActionableUrl(url)) {
    return {
      kind: "none",
      url: null,
      reason: "A downloadable source is not available for this file.",
    };
  }

  return {
    kind: "download",
    url: url.trim(),
  };
}

export function runMaterialAction(action: MaterialAction): boolean {
  if (typeof window === "undefined" || !action.url || action.kind === "none") {
    return false;
  }

  if (action.kind === "download") {
    const anchor = document.createElement("a");
    anchor.href = action.url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.download = "";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    return true;
  }

  if (action.kind === "open-source") {
    window.open(action.url, "_blank", "noopener,noreferrer");
    return true;
  }

  return false;
}

"use client";

import * as React from "react";
import {
  Copy01Icon,
  Link01Icon,
  Mail01Icon,
  Message01Icon,
  Share01Icon,
} from "@/lib/icons/material-icons";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  M3Button,
  Separator,
} from "@/components/core";
import type { Material } from "@/services/api";
import { useToast } from "@/components/core/toast";

interface ShareMaterialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material: Material;
  shareUrl: string;
}

function openInNewTab(url: string): void {
  if (typeof window === "undefined") {
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

function fallbackCopyToClipboard(value: string): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, value.length);

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}

export function ShareMaterialModal({
  open,
  onOpenChange,
  material,
  shareUrl,
}: ShareMaterialModalProps) {
  const { addToast } = useToast();
  const [nativeShareSupported, setNativeShareSupported] = React.useState(false);

  React.useEffect(() => {
    setNativeShareSupported(
      typeof navigator !== "undefined" && typeof navigator.share === "function",
    );
  }, []);

  const shareText = React.useMemo(() => {
    return `Check out "${material.title}" (${material.courseCode}) on Calabash: ${shareUrl}`;
  }, [material.courseCode, material.title, shareUrl]);

  const handleCopyLink = async () => {
    if (!shareUrl.trim()) {
      addToast("Share link is unavailable right now.", "error");
      return;
    }

    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        addToast("Link copied to clipboard.", "success");
        return;
      } catch {
        // Fallback handled below.
      }
    }

    const copied = fallbackCopyToClipboard(shareUrl);
    if (copied) {
      addToast("Link copied to clipboard.", "success");
    } else {
      addToast("Unable to copy automatically. Please copy the link manually.", "error");
    }
  };

  const handleNativeShare = async () => {
    if (
      typeof navigator === "undefined" ||
      typeof navigator.share !== "function"
    ) {
      return;
    }

    try {
      await navigator.share({
        title: material.title,
        text: `Resource from ${material.courseCode}`,
        url: shareUrl,
      });
    } catch (error) {
      const err = error as { name?: string };
      if (err?.name !== "AbortError") {
        addToast("Native share failed. Try copying the link instead.", "error");
      }
    }
  };

  const emailUrl = React.useMemo(() => {
    const subject = `Calabash resource: ${material.title}`;
    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      shareText,
    )}`;
  }, [material.title, shareText]);

  const whatsappUrl = React.useMemo(() => {
    return `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  }, [shareText]);

  const xIntentUrl = React.useMemo(() => {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  }, [shareText]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(96vw,42rem)] max-h-[calc(100dvh-2rem)] overflow-hidden rounded-3xl border border-[color:var(--md-sys-color-outline-variant)]">
        <DialogHeader className="bg-[color:var(--md-sys-color-surface-container-low)]">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]">
              <MaterialSymbol icon={Share01Icon} size={20} />
            </div>
            <div>
              <DialogTitle className="text-[20px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                Share Resource
              </DialogTitle>
              <p className="mt-1 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
                Share this material link with students and collaborators.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[calc(100dvh-10rem)] overflow-y-auto space-y-5">
          <div className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[color:var(--md-sys-color-on-surface-variant)]">
              Resource Preview
            </p>
            <h3 className="mt-2 text-[18px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
              {material.title}
            </h3>
            <p className="mt-1 text-[13px] text-[color:var(--md-sys-color-on-surface-variant)]">
              {material.courseCode} • {material.type}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="share-url">Share Link</Label>
            <Input
              id="share-url"
              value={shareUrl}
              readOnly
              leadingIcon={Link01Icon}
              className="h-11 border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-lowest)]"
            />
          </div>

          <div className="m3-action-row">
            <M3Button
              size="lg"
              className="h-11 gap-2 px-4 text-[15px] font-medium"
              onClick={() => void handleCopyLink()}
              aria-label="Copy share link"
            >
              <MaterialSymbol icon={Copy01Icon} size={18} />
              Copy Link
            </M3Button>
            {nativeShareSupported ? (
              <M3Button
                variant="outlined"
                size="lg"
                className="h-11 gap-2 px-4 text-[15px] font-medium"
                onClick={() => void handleNativeShare()}
                aria-label="Open system share"
              >
                <MaterialSymbol icon={Share01Icon} size={18} />
                System Share
              </M3Button>
            ) : null}
          </div>

          <Separator className="bg-[color:var(--md-sys-color-outline-variant)]" />

          <div className="space-y-2">
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[color:var(--md-sys-color-on-surface-variant)]">
              Quick Share
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <M3Button
                variant="outlined"
                size="md"
                className="h-10 gap-2 text-[14px] font-medium"
                onClick={() => openInNewTab(emailUrl)}
                aria-label="Share via email"
              >
                <MaterialSymbol icon={Mail01Icon} size={16} />
                Email
              </M3Button>
              <M3Button
                variant="outlined"
                size="md"
                className="h-10 gap-2 text-[14px] font-medium"
                onClick={() => openInNewTab(whatsappUrl)}
                aria-label="Share via WhatsApp"
              >
                <MaterialSymbol icon={Message01Icon} size={16} />
                WhatsApp
              </M3Button>
              <M3Button
                variant="outlined"
                size="md"
                className="h-10 gap-2 text-[14px] font-medium"
                onClick={() => openInNewTab(xIntentUrl)}
                aria-label="Share via X"
              >
                <MaterialSymbol icon={Share01Icon} size={16} />
                X
              </M3Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

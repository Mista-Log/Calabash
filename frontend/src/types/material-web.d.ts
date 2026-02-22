/* eslint-disable @typescript-eslint/no-empty-object-type */
import type * as React from "react";

type MaterialIntrinsicElements = {
  "md-nav-rail": React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement> & {
      "active-index"?: number;
      "aria-label"?: string;
      class?: string;
      expanded?: boolean;
    },
    HTMLElement
  >;
  "md-nav-bar": React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement> & {
      "active-index"?: number;
      "aria-label"?: string;
      class?: string;
    },
    HTMLElement
  >;
  "md-nav-item": React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement> & {
      label?: string;
      href?: string;
      "badge-value"?: string | number;
      "show-badge"?: boolean;
      active?: boolean;
    },
    HTMLElement
  >;
  "md-tabs": React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement> & {
      "active-index"?: number;
    },
    HTMLElement
  >;
  "md-tab": React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement> & {
      label?: string;
      active?: boolean;
    },
    HTMLElement
  >;
  "md-filled-button": React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
      class?: string;
    },
    HTMLButtonElement
  >;
  "md-tonal-button": React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
      class?: string;
    },
    HTMLButtonElement
  >;
  "md-outlined-button": React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
      class?: string;
    },
    HTMLButtonElement
  >;
  "md-text-button": React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
      class?: string;
    },
    HTMLButtonElement
  >;
  "md-elevated-button": React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
      class?: string;
    },
    HTMLButtonElement
  >;
  "md-icon-button": React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
      selected?: boolean;
      toggle?: boolean;
      class?: string;
    },
    HTMLButtonElement
  >;
  "md-fab": React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
      variant?: "primary" | "surface" | "secondary" | "tertiary";
      extended?: boolean;
      lowered?: boolean;
      label?: string;
      class?: string;
    },
    HTMLButtonElement
  >;
  "md-icon": React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement> & {
      class?: string;
    },
    HTMLElement
  >;
  "md-text-field": React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement> & {
      label?: string;
      "supporting-text"?: string;
      "prefix-text"?: string;
      "suffix-text"?: string;
      error?: boolean;
    },
    HTMLInputElement
  >;
  "md-checkbox": React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement> & {
      indeterminate?: boolean;
    },
    HTMLInputElement
  >;
  "md-radio": React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  "md-switch": React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement> & {
      selected?: boolean;
      icons?: boolean;
    },
    HTMLInputElement
  >;
  "md-select": React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement> & {
      label?: string;
      required?: boolean;
      disabled?: boolean;
      error?: boolean;
      "supporting-text"?: string;
    },
    HTMLElement
  >;
  "md-select-option": React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement> & {
      selected?: boolean;
      disabled?: boolean;
      value?: string;
    },
    HTMLElement
  >;
  "md-slider": React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement> & {
      value?: number;
      min?: number;
      max?: number;
      step?: number;
      disabled?: boolean;
      label?: string;
      labeled?: boolean;
      ticks?: boolean;
    },
    HTMLElement
  >;
  "md-snackbar": React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement> & {
      open?: boolean;
      "action-label"?: string;
      "close-on-escape"?: boolean;
      "auto-close-duration"?: number;
    },
    HTMLElement
  >;
  "md-dialog": React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDialogElement> & {
      open?: boolean;
      "aria-labelledby"?: string;
      "aria-describedby"?: string;
    },
    HTMLDialogElement
  >;
  "md-card": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  "md-list": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  "md-list-item": React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  >;
  "md-badge": React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement> & {
      value?: string | number;
      "aria-label"?: string;
    },
    HTMLElement
  >;
  "md-divider": React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  >;
  "md-chip": React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement> & {
      label?: string;
      selected?: boolean;
      disabled?: boolean;
    },
    HTMLElement
  >;
  "md-chip-set": React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  >;
  "md-menu": React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement> & {
      open?: boolean;
      anchor?: "top" | "bottom" | "left" | "right";
    },
    HTMLElement
  >;
  "md-menu-item": React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement> & {
      disabled?: boolean;
    },
    HTMLElement
  >;
  "md-linear-progress": React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement> & {
      value?: number;
      buffer?: number;
    },
    HTMLElement
  >;
  "md-circular-progress": React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement> & {
      value?: number;
      indeterminate?: boolean;
    },
    HTMLElement
  >;
};

declare global {
  namespace JSX {
    interface IntrinsicElements extends MaterialIntrinsicElements {}
  }
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements extends MaterialIntrinsicElements {}
  }
}

export {};

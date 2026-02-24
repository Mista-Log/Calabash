import * as React from "react";
<<<<<<< HEAD

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isInvalid?: boolean;
  color?: string;
  leadingIcon?: string;
  trailingIcon?: string;
  onTrailingIconClick?: () => void;
  trailingIconAriaLabel?: string;
}

const LEGACY_TEXT_FIELD_TOKEN_MAP: ReadonlyArray<readonly [string, string]> = [
  ["--md-filled-text-field-container-shape", "--md-text-field-container-shape"],
  [
    "--md-outlined-text-field-container-shape",
    "--md-text-field-container-shape",
  ],
  ["--md-filled-text-field-container-height", "--md-text-field-container-height"],
  [
    "--md-outlined-text-field-container-height",
    "--md-text-field-container-height",
  ],
  ["--md-filled-text-field-input-text-color", "--md-text-field-input-text-color"],
  [
    "--md-outlined-text-field-input-text-color",
    "--md-text-field-input-text-color",
  ],
  ["--md-filled-text-field-label-text-color", "--md-text-field-label-text-color"],
  [
    "--md-outlined-text-field-label-text-color",
    "--md-text-field-label-text-color",
  ],
  [
    "--md-filled-text-field-hover-label-text-color",
    "--md-text-field-hover-label-text-color",
  ],
  [
    "--md-outlined-text-field-hover-label-text-color",
    "--md-text-field-hover-label-text-color",
  ],
  ["--md-filled-text-field-caret-color", "--md-text-field-caret-color"],
  ["--md-outlined-text-field-caret-color", "--md-text-field-caret-color"],
  ["--md-filled-text-field-container-color", "--md-text-field-container-color"],
  [
    "--md-filled-text-field-focus-container-color",
    "--md-text-field-focus-container-color",
  ],
  [
    "--md-filled-text-field-hover-container-color",
    "--md-text-field-hover-container-color",
  ],
  ["--md-outlined-text-field-outline-color", "--md-text-field-outline-color"],
  [
    "--md-outlined-text-field-hover-outline-color",
    "--md-text-field-hover-outline-color",
  ],
  [
    "--md-outlined-text-field-focus-outline-color",
    "--md-text-field-focus-outline-color",
  ],
  [
    "--md-filled-text-field-active-indicator-color",
    "--md-text-field-active-indicator-color",
  ],
  [
    "--md-filled-text-field-hover-active-indicator-color",
    "--md-text-field-hover-active-indicator-color",
  ],
  [
    "--md-filled-text-field-focus-active-indicator-color",
    "--md-text-field-focus-active-indicator-color",
  ],
  [
    "--md-filled-text-field-leading-icon-color",
    "--md-text-field-leading-icon-color",
  ],
  [
    "--md-outlined-text-field-leading-icon-color",
    "--md-text-field-leading-icon-color",
  ],
  [
    "--md-filled-text-field-trailing-icon-color",
    "--md-text-field-trailing-icon-color",
  ],
  [
    "--md-outlined-text-field-trailing-icon-color",
    "--md-text-field-trailing-icon-color",
  ],
];

type CSSVariableMap = React.CSSProperties & Record<string, string | number>;

function normalizeTextFieldStyle(
  style: React.CSSProperties | undefined,
): React.CSSProperties {
  const resolvedStyle: CSSVariableMap = {
    ...((style as CSSVariableMap | undefined) ?? {}),
  };

  for (const [legacyToken, canonicalToken] of LEGACY_TEXT_FIELD_TOKEN_MAP) {
    if (
      resolvedStyle[legacyToken] !== undefined &&
      resolvedStyle[canonicalToken] === undefined
    ) {
      resolvedStyle[canonicalToken] = resolvedStyle[legacyToken];
    }
  }

  return resolvedStyle;
}

function createInputLikeEvent(
  nextValue: string,
): React.ChangeEvent<HTMLInputElement> {
  const inputLikeTarget = {
    value: nextValue,
  };
  return {
    target: inputLikeTarget,
    currentTarget: inputLikeTarget,
  } as unknown as React.ChangeEvent<HTMLInputElement>;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type,
      isInvalid,
      color = "outlined",
      leadingIcon,
      trailingIcon,
      onTrailingIconClick,
      trailingIconAriaLabel = "Input action",
      className,
      value,
      defaultValue,
      autoComplete,
      onChange,
      onInput,
      ...props
    },
    _ref,
  ) => {
    const materialColor = color === "filled" ? "filled" : "outlined";
    const resolvedStyle = normalizeTextFieldStyle(props.style);

    const textFieldProps: Record<string, unknown> = {
      ...props,
      className,
      type,
      color: materialColor,
      error: isInvalid || undefined,
      style: resolvedStyle,
      onInput: (event: Event) => {
        const nextValue =
          (event.currentTarget as HTMLElement & { value?: string }).value ?? "";
        const inputEvent = createInputLikeEvent(nextValue);
        const reactInputEvent =
          inputEvent as unknown as React.InputEvent<HTMLInputElement>;

        onInput?.(reactInputEvent);
        onChange?.(inputEvent);
      },
    };

    if (autoComplete) {
      textFieldProps.autocomplete = autoComplete;
    }

    if (value !== undefined) {
      textFieldProps.value = value;
    } else if (defaultValue !== undefined) {
      textFieldProps.defaultValue = defaultValue;
    }

    return React.createElement(
      "md-text-field",
      textFieldProps,
      leadingIcon
        ? React.createElement(
            "md-icon",
            { slot: "leading-icon" },
            leadingIcon,
          )
        : null,
      trailingIcon
        ? React.createElement(
            "button",
            {
              type: "button",
              slot: "trailing-icon",
              onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
                event.preventDefault();
                onTrailingIconClick?.();
              },
              className:
                "inline-flex h-8 w-8 items-center justify-center rounded-full text-[color:var(--md-sys-color-on-surface-variant)]",
              "aria-label": trailingIconAriaLabel,
            },
            React.createElement("md-icon", null, trailingIcon),
          )
        : null,
    );
  },
);

=======
import { cn } from "@/lib/utils";

<<<<<<< HEAD
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
=======
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isInvalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isInvalid, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-md border px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
          isInvalid
            ? "border-destructive focus-visible:ring-destructive/40"
            : "border-border hover:border-muted-foreground/40 focus-visible:border-primary",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
>>>>>>> 4e84afb555dea8266411ce233f4e83fd5a07858e
>>>>>>> origin/main
Input.displayName = "Input";

export { Input };

"use client";

import * as React from "react";

type EasePreset =
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "anticipate"
  | "backIn"
  | "backOut";

type MotionTransition = {
  duration?: number;
  delay?: number;
  ease?: EasePreset | number[] | string;
  [key: string]: unknown;
};

// Shared Material motion tokens for component-level transitions.
// `duration` uses milliseconds; `ease` is resolved by `mapEase`.
export const motionDurationShort = 180;
export const motionDurationMedium = 260;
export const motionDurationLong = 360;
export const motionEasingStandard = "standard";

type MotionTarget = {
  opacity?: number;
  x?: number | string;
  y?: number | string;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  rotate?: number | string;
  width?: number | string;
  height?: number | string;
  transition?: MotionTransition;
  [key: string]: unknown;
};

export type Variants = Record<string, MotionTarget>;

type MotionProps<T extends HTMLElement> = React.HTMLAttributes<T> & {
  initial?: MotionTarget | string | false;
  animate?: MotionTarget | string | false;
  exit?: MotionTarget | string | false;
  whileHover?: MotionTarget;
  whileTap?: MotionTarget;
  transition?: MotionTransition;
  variants?: Variants;
  layout?: boolean;
  children?: React.ReactNode;
};

function toCssValue(value: unknown): string | number | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "number") return value;
  return String(value);
}

function toTransform(target?: MotionTarget): string | undefined {
  if (!target) return undefined;
  const transforms: string[] = [];

  if (target.x !== undefined) transforms.push(`translateX(${toCssValue(target.x)})`);
  if (target.y !== undefined) transforms.push(`translateY(${toCssValue(target.y)})`);
  if (target.scale !== undefined) transforms.push(`scale(${toCssValue(target.scale)})`);
  if (target.scaleX !== undefined) transforms.push(`scaleX(${toCssValue(target.scaleX)})`);
  if (target.scaleY !== undefined) transforms.push(`scaleY(${toCssValue(target.scaleY)})`);
  if (target.rotate !== undefined) transforms.push(`rotate(${toCssValue(target.rotate)})`);

  return transforms.length ? transforms.join(" ") : undefined;
}

function mapEase(ease: MotionTransition["ease"]): string {
  if (Array.isArray(ease)) return `cubic-bezier(${ease.join(",")})`;

  switch (ease) {
    case "linear":
      return "var(--md-sys-motion-easing-linear)";
    case "easeIn":
      return "var(--md-sys-motion-easing-standard-accelerate)";
    case "easeOut":
      return "var(--md-sys-motion-easing-standard-decelerate)";
    case "easeInOut":
      return "var(--md-sys-motion-easing-emphasized)";
    case "anticipate":
    case "backIn":
      return "var(--md-sys-motion-easing-emphasized-accelerate)";
    case "backOut":
      return "var(--md-sys-motion-easing-emphasized-decelerate)";
    default:
      return "var(--md-sys-motion-easing-standard)";
  }
}

function normalizeDuration(duration?: number): string {
  if (duration === undefined) return "var(--md-sys-motion-duration-medium2)";
  const milliseconds = duration <= 10 ? duration * 1000 : duration;
  return `${milliseconds}ms`;
}

function normalizeDelay(delay?: number): string | undefined {
  if (delay === undefined) return undefined;
  const milliseconds = delay <= 10 ? delay * 1000 : delay;
  return `${milliseconds}ms`;
}

function resolveTarget(
  value: MotionTarget | string | false | undefined,
  variants?: Variants,
): MotionTarget | undefined {
  if (value === false || value === undefined) return undefined;
  if (typeof value === "string") return variants?.[value];
  return value;
}

function toStyle(target?: MotionTarget): React.CSSProperties {
  if (!target) return {};
  const style: React.CSSProperties = {};
  const transform = toTransform(target);
  if (transform) style.transform = transform;
  if (target.opacity !== undefined) style.opacity = target.opacity;
  if (target.width !== undefined) style.width = toCssValue(target.width);
  if (target.height !== undefined) style.height = toCssValue(target.height);
  return style;
}

function createMotionComponent(tag: string) {
  const MotionComponent = (props: MotionProps<HTMLElement>) => {
    const {
      initial,
      animate,
      exit,
      whileHover,
      whileTap,
      transition,
      variants,
      layout,
      style,
      onMouseEnter,
      onMouseLeave,
      onPointerDown,
      onPointerUp,
      onPointerCancel,
      ...domProps
    } = props;

    void exit;
    void layout;

    const [mounted, setMounted] = React.useState(false);
    const [hovered, setHovered] = React.useState(false);
    const [pressed, setPressed] = React.useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

    React.useEffect(() => {
      const id = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(id);
    }, []);

    React.useEffect(() => {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      const sync = () => setPrefersReducedMotion(media.matches);
      sync();
      media.addEventListener("change", sync);
      return () => media.removeEventListener("change", sync);
    }, []);

    const animateTarget = resolveTarget(animate, variants);
    const initialTarget =
      initial === false ? animateTarget : resolveTarget(initial, variants);

    const baseTarget = mounted ? animateTarget : initialTarget;
    const hoverTarget = hovered ? whileHover : undefined;
    const tapTarget = pressed ? whileTap : undefined;
    const interactiveTarget = tapTarget ?? hoverTarget ?? baseTarget;

    const transitionSpec = transition ?? animateTarget?.transition;
    const transitionDuration = prefersReducedMotion
      ? "1ms"
      : normalizeDuration(transitionSpec?.duration);
    const transitionDelay = normalizeDelay(transitionSpec?.delay);
    const transitionTiming = mapEase(transitionSpec?.ease);

    const mergedStyle: React.CSSProperties = {
      ...toStyle(interactiveTarget),
      transitionProperty: "transform, opacity, width, height",
      transitionDuration,
      transitionTimingFunction: transitionTiming,
      ...(transitionDelay ? { transitionDelay } : {}),
      ...style,
    };

    return React.createElement(tag, {
      ...(domProps as React.HTMLAttributes<HTMLElement>),
      style: mergedStyle,
      onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
        setHovered(true);
        onMouseEnter?.(event);
      },
      onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
        setHovered(false);
        setPressed(false);
        onMouseLeave?.(event);
      },
      onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
        setPressed(true);
        onPointerDown?.(event);
      },
      onPointerUp: (event: React.PointerEvent<HTMLElement>) => {
        setPressed(false);
        onPointerUp?.(event);
      },
      onPointerCancel: (event: React.PointerEvent<HTMLElement>) => {
        setPressed(false);
        onPointerCancel?.(event);
      },
    });
  };

  MotionComponent.displayName = `motion.${tag}`;
  return MotionComponent;
}

const motionCache = new Map<
  string,
  React.ComponentType<MotionProps<HTMLElement> & Record<string, unknown>>
>();

export const motion = new Proxy(
  {},
  {
    get(_target, key: string) {
      if (!motionCache.has(key)) {
        motionCache.set(key, createMotionComponent(key));
      }
      return motionCache.get(key);
    },
  },
) as Record<
  string,
  React.ComponentType<MotionProps<HTMLElement> & Record<string, unknown>>
>;

export function AnimatePresence({
  children,
}: {
  children?: React.ReactNode;
  mode?: "wait" | "sync" | "popLayout";
  initial?: boolean;
}) {
  return <>{children}</>;
}

<<<<<<< HEAD
﻿"use client";

import { ArrowLeft01Icon } from "@/lib/icons/material-icons";
import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { Input } from "@/components/core";
import { cn } from "@/lib/utils";

import { useUserStore } from "@/store/useUserStore";
import { authService, extractAuthErrorMessage } from "@/services/auth.service";
=======
"use client";

import {
  LibraryIcon,
  Mail01Icon,
  LockPasswordIcon,
  ViewIcon,
  ViewOffIcon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";
import * as React from "react";
import { useRouter } from "next/navigation";

import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";
import {
  Button,
  Input,
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/core";

import { useUserStore } from "@/store/useUserStore";
import { UserProfile } from "@/services/api";
import { authService } from "@/services/auth.service";
>>>>>>> origin/main

interface LoginFormProps extends React.ComponentProps<"form"> {
  signupUrl?: string;
  role?: "student" | "lecturer";
}

<<<<<<< HEAD
=======
import Image from "next/image"; // Import Image component

>>>>>>> origin/main
export function LoginForm({
  className,
  signupUrl,
  role,
  ...props
}: LoginFormProps) {
  const router = useRouter();
  const defaultSignupUrl =
    role === "student"
      ? "/auth/student"
      : role === "lecturer"
        ? "/auth/lecturer"
        : "/signup";
  const finalSignupUrl = signupUrl || defaultSignupUrl;
<<<<<<< HEAD
  const forgotPasswordUrl =
    role === "student"
      ? "/auth/login/student/forgot-password"
      : role === "lecturer"
        ? "/auth/login/lecturer/forgot-password"
        : "/auth/login/student/forgot-password";
  const emailPlaceholder =
    role === "lecturer"
      ? "faculty@university.edu"
      : role === "student"
        ? "student@university.edu"
        : "name@university.edu";
=======
>>>>>>> origin/main
  const { login } = useUserStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
<<<<<<< HEAD
  const [formError, setFormError] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const submitInFlightRef = React.useRef(false);
=======
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
>>>>>>> origin/main

  const validateEmail = (val: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!val) return "";
    return regex.test(val) ? "" : "Please enter a valid email address";
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
<<<<<<< HEAD
    if (submitInFlightRef.current || isLoading) {
      return;
    }

    const currentEmailError = validateEmail(email);
    if (currentEmailError) {
      setEmailError(currentEmailError);
      return;
    }

    submitInFlightRef.current = true;
    setIsLoading(true);
    setFormError("");

    try {
      const session = await authService.loginAndResolveUser({
        email,
        password,
      }, role);

      if (!session.user) {
        setFormError(
          "Unable to load account profile. Please contact support.",
        );
        return;
      }

      login(session.user, session.accessToken, session.refreshToken, rememberMe);
      router.push("/dashboard");
    } catch (error: unknown) {
      setFormError(
        extractAuthErrorMessage(
          error,
          "Login failed. Please check your credentials.",
        ),
      );
    } finally {
      submitInFlightRef.current = false;
=======
    setIsLoading(true);
    setEmailError("");

    try {
      const result = await authService.login({
        username: email,
        email,
        password,
      });

      // Handle token and user data from result
      const token = result.access || result.token || "";
      const refreshToken = result.refresh || "";

      const user: UserProfile = result.user || {
        id: "u-" + Math.random().toString(36).substr(2, 5),
        name: result.email ? result.email.split("@")[0] : "User",
        email: result.email || "",
        role:
          role ||
          (result.email.toLowerCase().includes("lecturer")
            ? "lecturer"
            : "student"),
        department: "Computer Science",
        semester: 2,
        isNewUser: false,
      };

      login(user, token, refreshToken);

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error);
      setEmailError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
>>>>>>> origin/main
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)}>
<<<<<<< HEAD
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/auth"
          className="inline-flex items-center gap-2 text-[16px] font-semibold text-[color:var(--md-sys-color-on-surface-variant)] hover:text-[color:var(--md-sys-color-primary)] transition-colors mb-6 group"
        >
          <MaterialSymbol
=======
      <div className="mb-8">
        <a
          href="/auth"
          className="inline-flex items-center gap-2 text-base font-semibold text-muted-foreground hover:text-primary transition-colors mb-6 group"
        >
          <HugeiconsIcon
>>>>>>> origin/main
            icon={ArrowLeft01Icon}
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Selection
<<<<<<< HEAD
        </Link>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-2xl"
              style={{ backgroundColor: "var(--md-sys-color-primary)" }}
            >
              <MaterialSymbol
                icon="lock"
                size={24}
                style={{ color: "var(--md-sys-color-on-primary)" }}
              />
            </div>
          </div>
          <h1 className="text-[32px] font-bold tracking-tight text-[color:var(--md-sys-color-on-surface)]">
            Welcome Back
          </h1>
          <p className="text-[16px] text-[color:var(--md-sys-color-on-surface-variant)] mt-2">
            Sign in to your {role || "account"} to continue
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid gap-5" {...props}>
        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-[14px] font-semibold uppercase tracking-wider text-[color:var(--md-sys-color-on-surface-variant)]"
          >
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder={emailPlaceholder}
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(validateEmail(e.target.value));
              setFormError("");
            }}
            leadingIcon="mail"
            isInvalid={Boolean(emailError)}
            required
            className="h-14 w-full"
            style={
              {
                "--md-filled-text-field-container-color":
                  "var(--md-sys-color-surface-container-high)",
                "--md-filled-text-field-hover-container-color":
                  "var(--md-sys-color-surface-container-highest)",
                "--md-filled-text-field-focus-container-color":
                  "var(--md-sys-color-surface-container-highest)",
                "--md-filled-text-field-container-shape":
                  "var(--md-sys-shape-corner-extra-large)",
                "--md-outlined-text-field-container-shape":
                  "var(--md-sys-shape-corner-extra-large)",
              } as React.CSSProperties
            }
          />
          {emailError && (
            <p className="text-[13px] font-semibold text-[color:var(--md-sys-color-error)] flex items-center gap-2">
              <MaterialSymbol icon="error" size={16} />
              {emailError}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-[14px] font-semibold uppercase tracking-wider text-[color:var(--md-sys-color-on-surface-variant)]"
            >
              Password
            </label>
            <Link
              href={forgotPasswordUrl}
              className="text-[14px] font-semibold text-[color:var(--md-sys-color-primary)] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFormError("");
            }}
            placeholder="Your password"
            leadingIcon="lock"
            trailingIcon={showPassword ? "visibility_off" : "visibility"}
            trailingIconAriaLabel={
              showPassword ? "Hide password" : "Show password"
            }
            onTrailingIconClick={() => setShowPassword(!showPassword)}
            required
            className="h-14 w-full"
            style={
              {
                "--md-filled-text-field-container-color":
                  "var(--md-sys-color-surface-container-high)",
                "--md-filled-text-field-hover-container-color":
                  "var(--md-sys-color-surface-container-highest)",
                "--md-filled-text-field-focus-container-color":
                  "var(--md-sys-color-surface-container-highest)",
                "--md-filled-text-field-container-shape":
                  "var(--md-sys-shape-corner-extra-large)",
                "--md-outlined-text-field-container-shape":
                  "var(--md-sys-shape-corner-extra-large)",
              } as React.CSSProperties
            }
          />
        </div>

        {formError && (
          <p className="text-[13px] font-semibold text-[color:var(--md-sys-color-error)] flex items-center gap-2">
            <MaterialSymbol icon="error" size={16} />
            {formError}
          </p>
        )}

        {/* Remember Me */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-5 h-5 rounded-lg border-2 border-[color:var(--md-sys-color-outline)] text-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)] focus:ring-2 cursor-pointer"
          />
          <label
            htmlFor="remember"
            className="text-[16px] font-semibold text-[color:var(--md-sys-color-on-surface-variant)] cursor-pointer"
          >
            Remember for 30 days
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full h-14 rounded-2xl",
            "bg-[color:var(--md-sys-color-primary)]",
            "text-[color:var(--md-sys-color-on-primary)]",
            "text-[18px] font-bold",
            "transition-all duration-200",
            "hover:opacity-90",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "flex items-center justify-center gap-2",
          )}
        >
          {isLoading ? (
            <>
              <MaterialSymbol
                icon="progress_activity"
                size={20}
                className="animate-spin"
              />
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="text-center">
        <p className="text-[15px] text-[color:var(--md-sys-color-on-surface-variant)]">
          Don&apos;t have an account?{" "}
          <Link
            href={finalSignupUrl}
            className="font-bold text-[color:var(--md-sys-color-primary)] hover:underline"
          >
            Sign Up
          </Link>
=======
        </a>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome Back.
        </h1>
        <p className="text-muted-foreground mt-2">
          Let&apos;s sign in to your {role || "account"} and get started.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6">
        <FieldGroup>
          <Field>
            <FieldLabel
              htmlFor="email"
              className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80 mb-2 block"
            >
              Email Address
            </FieldLabel>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                <HugeiconsIcon icon={Mail01Icon} size={18} />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(validateEmail(e.target.value));
                }}
                required
                className={cn(
                  "h-11 pl-12 rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-all",
                  emailError &&
                    "border-destructive focus-visible:ring-destructive",
                )}
              />
            </div>
            {emailError && (
              <p className="text-xs text-destructive font-bold mt-1.5 ml-4 uppercase tracking-widest">
                {emailError}
              </p>
            )}
          </Field>

          <Field>
            <div className="flex items-center justify-between mb-2">
              <FieldLabel
                htmlFor="password"
                className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80"
              >
                Password
              </FieldLabel>
              <a
                href="#"
                className="text-sm font-bold text-primary hover:underline"
              >
                Forgot Password
              </a>
            </div>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                <HugeiconsIcon icon={LockPasswordIcon} size={18} />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 pl-12 pr-12 rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <HugeiconsIcon icon={ViewOffIcon} size={18} />
                ) : (
                  <HugeiconsIcon icon={ViewIcon} size={18} />
                )}
              </button>
            </div>
          </Field>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="rounded border-border/60 text-primary focus:ring-primary h-4 w-4"
            />
            <label
              htmlFor="remember"
              className="text-base font-semibold text-muted-foreground cursor-pointer"
            >
              Remember For 30 Days
            </label>
          </div>
        </FieldGroup>

        <div className="grid gap-3">
          <Button
            type="submit"
            isLoading={isLoading}
            loadingText="Signing In..."
            className="h-11 rounded-xl text-lg font-bold shadow-lg shadow-primary/10 bg-primary hover:bg-primary/90 text-primary-foreground"
            icon={ArrowLeft01Icon}
            iconPlacement="right"
          >
            Sign In
          </Button>

          <Button
            variant="outline"
            type="button"
            className="h-11 rounded-xl border-border/60 font-bold bg-background hover:bg-muted/30 transition-all gap-3"
          >
            <Image
              src="/google.svg"
              alt="Google"
              width={20} // Explicit width
              height={20} // Explicit height
              className="h-5 w-5"
            />
            Sign In With Google
          </Button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Don&apos;t have an account?{" "}
          <a
            href={finalSignupUrl}
            className="text-primary font-bold hover:underline"
          >
            Sign Up.
          </a>
>>>>>>> origin/main
        </p>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/main

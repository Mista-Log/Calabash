"use client";

import { ArrowLeft01Icon } from "@/lib/icons/material-icons";
import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { Input } from "@/components/core";
import { cn } from "@/lib/utils";

import { useUserStore } from "@/store/useUserStore";
import { authService, extractAuthErrorMessage } from "@/services/auth.service";

interface LoginFormProps extends React.ComponentProps<"form"> {
  signupUrl?: string;
  role?: "student" | "lecturer";
}

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
  const { login } = useUserStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [formError, setFormError] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const submitInFlightRef = React.useRef(false);

  const validateEmail = (val: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!val) return "";
    return regex.test(val) ? "" : "Please enter a valid email address";
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
      const session = await authService.loginAndResolveUser(
        {
          email,
          password,
        },
        role,
      );

      if (!session.user) {
        setFormError("Unable to load account profile. Please contact support.");
        return;
      }

      login(
        session.user,
        session.accessToken,
        session.refreshToken,
        rememberMe,
      );
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
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)}>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/auth"
          className="inline-flex items-center gap-2 text-[16px] font-semibold text-(--md-sys-color-on-surface-variant) hover:text-(--md-sys-color-primary) transition-colors mb-6 group"
        >
          <MaterialSymbol
            icon={ArrowLeft01Icon}
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Selection
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
          <h1 className="text-[32px] font-bold tracking-tight text-(--md-sys-color-on-surface)">
            Welcome Back
          </h1>
          <p className="text-[16px] text-(--md-sys-color-on-surface-variant) mt-2">
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
            className="block text-[14px] font-semibold uppercase tracking-wider text-(--md-sys-color-on-surface-variant)"
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
            <p className="text-[13px] font-semibold text-(--md-sys-color-error) flex items-center gap-2">
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
              className="block text-[14px] font-semibold uppercase tracking-wider text-(--md-sys-color-on-surface-variant)"
            >
              Password
            </label>
            <Link
              href={forgotPasswordUrl}
              className="text-[14px] font-semibold text-(--md-sys-color-primary) hover:underline"
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
          <p className="text-[13px] font-semibold text-(--md-sys-color-error) flex items-center gap-2">
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
            className="w-5 h-5 rounded-lg border-2 border-(--md-sys-color-outline) text-(--md-sys-color-primary) focus:ring-(--md-sys-color-primary) focus:ring-2 cursor-pointer"
          />
          <label
            htmlFor="remember"
            className="text-[16px] font-semibold text-(--md-sys-color-on-surface-variant) cursor-pointer"
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
            "bg-(--md-sys-color-primary)",
            "text-(--md-sys-color-on-primary)",
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
        <p className="text-[15px] text-(--md-sys-color-on-surface-variant)">
          Don&apos;t have an account?{" "}
          <Link
            href={finalSignupUrl}
            className="font-bold text-(--md-sys-color-primary) hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

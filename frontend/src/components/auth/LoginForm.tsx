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

  const validateEmail = (val: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!val) return "";
    return regex.test(val) ? "" : "Please enter a valid email address";
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const currentEmailError = validateEmail(email);
    if (currentEmailError) {
      setEmailError(currentEmailError);
      return;
    }

    setIsLoading(true);
    setFormError("");

    try {
      const session = await authService.loginAndResolveUser({
        email,
        password,
      });

      if (session.backendRole === "admin") {
        setFormError(
          "Administrator accounts are not supported on this portal.",
        );
        return;
      }

      if (role && session.backendRole !== role) {
        setFormError(
          "This account is not permitted on the selected sign-in portal.",
        );
        return;
      }

      if (!session.user) {
        setFormError(
          "Unable to load account profile. Please contact support.",
        );
        return;
      }

      login(session.user, session.accessToken, session.refreshToken);
      router.push("/dashboard");
    } catch (error: unknown) {
      setFormError(
        extractAuthErrorMessage(
          error,
          "Login failed. Please check your credentials.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)}>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/auth"
          className="inline-flex items-center gap-2 text-[16px] font-semibold text-[color:var(--md-sys-color-on-surface-variant)] hover:text-[color:var(--md-sys-color-primary)] transition-colors mb-6 group"
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

        {/* Divider */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[color:var(--md-sys-color-outline-variant)]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[color:var(--md-sys-color-surface)] text-[color:var(--md-sys-color-on-surface-variant)] font-medium">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          className={cn(
            "w-full h-14 rounded-2xl",
            "bg-[color:var(--md-sys-color-surface-container-high)]",
            "border-2 border-[color:var(--md-sys-color-outline-variant)]",
            "text-[color:var(--md-sys-color-on-surface)]",
            "text-[16px] font-bold",
            "transition-all duration-200",
            "hover:bg-[color:var(--md-sys-color-surface-container-highest)]",
            "flex items-center justify-center gap-3",
          )}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign In With Google
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
        </p>
      </div>
    </div>
  );
}

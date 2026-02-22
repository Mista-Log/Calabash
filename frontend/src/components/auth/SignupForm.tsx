"use client";

import {
  ArrowLeft01Icon,
} from "@/lib/icons/material-icons";
import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { Input } from "@/components/core";
import { cn } from "@/lib/utils";

import { useUserStore } from "@/store/useUserStore";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { authService, extractAuthErrorMessage } from "@/services/auth.service";

interface SignupFormProps extends React.ComponentProps<"form"> {
  title?: string;
  description?: string;
  defaultRole?: "student" | "lecturer";
  loginUrl?: string;
}

export function SignupForm({
  className,
  title = "Create Account.",
  description = "Join Calabash and start your academic journey.",
  defaultRole = "student",
  loginUrl,
}: SignupFormProps) {
  const router = useRouter();
  const defaultLoginUrl =
    defaultRole === "student" ? "/auth/login/student" : "/auth/login/lecturer";
  const finalLoginUrl = loginUrl || defaultLoginUrl;
  const emailPlaceholder =
    defaultRole === "lecturer"
      ? "faculty@university.edu"
      : "student@university.edu";
  const { login } = useUserStore();
  const startRoleOnboarding = useOnboardingStore(
    (state) => state.startRoleOnboarding,
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [formError, setFormError] = React.useState("");
  const [needsManualSignIn, setNeedsManualSignIn] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const validateEmail = (val: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!val) return "";
    return regex.test(val) ? "" : "Please enter a valid email address";
  };

  const getStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score: 0, label: "" };

    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    const labels = ["Weak", "Fair", "Good", "Strong", "Excellent"];
    return { score, label: labels[score - 1] || "Weak" };
  };

  const strength = getStrength(password);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const currentEmailError = validateEmail(email);
    if (currentEmailError) {
      setEmailError(currentEmailError);
      return;
    }

    setIsLoading(true);
    setFormError("");
    setNeedsManualSignIn(false);

    try {
      await authService.signup({
        email,
        full_name: name,
        password,
        role: defaultRole,
      });

      try {
        const session = await authService.loginAndResolveUser({ email, password });

        if (session.backendRole === "admin") {
          setFormError(
            "Administrator accounts are not supported on this portal.",
          );
          setNeedsManualSignIn(true);
          return;
        }

        if (session.backendRole !== defaultRole || !session.user) {
          setFormError("Account created. Please sign in to continue.");
          setNeedsManualSignIn(true);
          return;
        }

        startRoleOnboarding(defaultRole);
        login(session.user, session.accessToken, session.refreshToken);
        router.push(`/onboarding/${defaultRole}`);
      } catch {
        setFormError("Account created. Please sign in to continue.");
        setNeedsManualSignIn(true);
      }
    } catch (error: unknown) {
      setFormError(
        extractAuthErrorMessage(
          error,
          "Registration failed. Please check your details.",
        ),
      );
      setNeedsManualSignIn(false);
    } finally {
      setIsLoading(false);
    }
  }

  const getPasswordColor = () => {
    if (strength.score <= 1) return "var(--md-sys-color-error)";
    if (strength.score <= 2) return "var(--md-sys-color-tertiary)";
    if (strength.score <= 3) return "var(--md-sys-color-secondary)";
    return "var(--md-sys-color-primary)";
  };

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
                icon="person_add"
                size={24}
                style={{ color: "var(--md-sys-color-on-primary)" }}
              />
            </div>
          </div>
          <h1 className="text-[32px] font-bold tracking-tight text-[color:var(--md-sys-color-on-surface)]">
            {title}
          </h1>
          <p className="text-[16px] text-[color:var(--md-sys-color-on-surface-variant)] mt-2">
            {description}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid gap-5">
        {/* Full Name Field */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-[14px] font-semibold uppercase tracking-wider text-[color:var(--md-sys-color-on-surface-variant)]"
          >
            Full Name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="e.g., Ada Lovelace"
            autoComplete="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setFormError("");
              setNeedsManualSignIn(false);
            }}
            leadingIcon="person"
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
              setNeedsManualSignIn(false);
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
          <label
            htmlFor="password"
            className="block text-[14px] font-semibold uppercase tracking-wider text-[color:var(--md-sys-color-on-surface-variant)]"
          >
            Password
          </label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFormError("");
              setNeedsManualSignIn(false);
            }}
            required
            placeholder="At least 8 characters"
            leadingIcon="lock"
            trailingIcon={showPassword ? "visibility_off" : "visibility"}
            trailingIconAriaLabel={
              showPassword ? "Hide password" : "Show password"
            }
            onTrailingIconClick={() => setShowPassword(!showPassword)}
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

          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <div className="space-y-2 mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex gap-1.5 h-1.5">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={cn(
                      "h-full flex-1 rounded-full transition-all duration-300",
                      step <= strength.score
                        ? "opacity-100"
                        : "opacity-30"
                    )}
                    style={{
                      backgroundColor: getPasswordColor(),
                      transform: step <= strength.score ? "scaleX(1)" : "scaleX(0.9)",
                    }}
                  />
                ))}
              </div>
              <p className="text-[13px] font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="text-[color:var(--md-sys-color-on-surface-variant)]">
                  Strength:
                </span>
                <span
                  className="transition-all duration-300"
                  style={{ color: getPasswordColor() }}
                >
                  {strength.label}
                </span>
              </p>
            </div>
          )}
        </div>

        {formError && (
          <p className="text-[13px] font-semibold text-[color:var(--md-sys-color-error)] flex flex-wrap items-center gap-2">
            <MaterialSymbol icon="error" size={16} />
            <span>{formError}</span>
            {needsManualSignIn && (
              <Link
                href={finalLoginUrl}
                className="font-bold text-[color:var(--md-sys-color-primary)] hover:underline"
              >
                Sign In
              </Link>
            )}
          </p>
        )}

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
            "flex items-center justify-center gap-2"
          )}
        >
          {isLoading ? (
            <>
              <MaterialSymbol icon="progress_activity" size={20} className="animate-spin" />
              Creating Account...
            </>
          ) : (
            "Sign Up"
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

        {/* Google Sign Up */}
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
            "flex items-center justify-center gap-3"
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
          Sign Up With Google
        </button>
      </form>

      {/* Footer */}
      <div className="text-center">
        <p className="text-[15px] text-[color:var(--md-sys-color-on-surface-variant)]">
          Already have an account?{" "}
          <Link
            href={finalLoginUrl}
            className="font-bold text-[color:var(--md-sys-color-primary)] hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

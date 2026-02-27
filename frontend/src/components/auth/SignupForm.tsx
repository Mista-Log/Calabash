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
  const submitInFlightRef = React.useRef(false);

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
    setNeedsManualSignIn(false);

    try {
      await authService.signup({
        email,
        full_name: name,
        password,
        role: defaultRole,
      });

      try {
        const session = await authService.loginAndResolveUser({ email, password }, defaultRole);

        if (!session.user) {
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
      submitInFlightRef.current = false;
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

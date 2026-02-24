<<<<<<< HEAD
﻿"use client";

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
=======
"use client";

import {
  UserIcon,
  Mail01Icon,
  LockPasswordIcon,
  ArrowLeft01Icon,
  ViewIcon,
  ViewOffIcon,
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
>>>>>>> origin/main

interface SignupFormProps extends React.ComponentProps<"form"> {
  title?: string;
  description?: string;
<<<<<<< HEAD
  defaultRole?: "student" | "lecturer";
  loginUrl?: string;
}

=======
}

import { useUserStore } from "@/store/useUserStore";
import { UserProfile } from "@/services/api";
import { authService } from "@/services/auth.service";

import Image from "next/image"; // Import Image component

>>>>>>> origin/main
export function SignupForm({
  className,
  title = "Create Account.",
  description = "Join Calabash and start your academic journey.",
  defaultRole = "student",
  loginUrl,
<<<<<<< HEAD
}: SignupFormProps) {
=======
  ...props
}: SignupFormProps & {
  defaultRole?: "student" | "lecturer";
  loginUrl?: string;
}) {
>>>>>>> origin/main
  const router = useRouter();
  const defaultLoginUrl =
    defaultRole === "student" ? "/auth/login/student" : "/auth/login/lecturer";
  const finalLoginUrl = loginUrl || defaultLoginUrl;
<<<<<<< HEAD
  const emailPlaceholder =
    defaultRole === "lecturer"
      ? "faculty@university.edu"
      : "student@university.edu";
  const { login } = useUserStore();
  const startRoleOnboarding = useOnboardingStore(
    (state) => state.startRoleOnboarding,
  );
=======
  const { login } = useUserStore();
>>>>>>> origin/main
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
<<<<<<< HEAD
  const [formError, setFormError] = React.useState("");
  const [needsManualSignIn, setNeedsManualSignIn] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
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

  const getStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score: 0, label: "" };

<<<<<<< HEAD
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
=======
    // 1. Length requirements
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;

    // 2. Character diversity
>>>>>>> origin/main
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    const labels = ["Weak", "Fair", "Good", "Strong", "Excellent"];
    return { score, label: labels[score - 1] || "Weak" };
  };

  const strength = getStrength(password);

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
=======
    setIsLoading(true);

    try {
      const result = await authService.signup({
        email,
        full_name: name,
        password,
        role: defaultRole as string,
      });

      // After a successful signup, the user might need to log in manually
      // or the backend might return tokens (less common for signup usually).
      // For now, let's proceed with a mock "automatic login" if details aren't sufficient
      // Or simply navigate to login if that's the preferred strategy.
      // Given the previous mock logic logged them in immediately:
      const newUser: UserProfile = {
        id: Math.random().toString(36).substr(2, 9),
        name: name, // Use local state to ensure immediate availability
        email: result.email,
        role: result.role as "student" | "lecturer",
        department: "Computer Science",
        semester: 1,
        isNewUser: true,
      };

      // Note: We'd normally need a token here to truly log in.
      // If signup doesn't return a token, we might need to call login() right after
      // or redirect to login. For consistency with previous behavior:
      login(newUser, "", "");

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Signup failed:", error);
      setEmailError(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
>>>>>>> origin/main
      setIsLoading(false);
    }
  }

<<<<<<< HEAD
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
=======
  return (
    <div className={cn("grid gap-6", className)}>
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
=======
        </a>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <FieldGroup>
          <Field>
            <FieldLabel
              htmlFor="name"
              className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80 mb-2 block"
            >
              Full Name
            </FieldLabel>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                <HugeiconsIcon icon={UserIcon} size={18} />
              </div>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11 pl-12 rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-all"
              />
            </div>
          </Field>

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
            <FieldLabel
              htmlFor="password"
              className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80 mb-2 block"
            >
              Password
            </FieldLabel>
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
                placeholder="Min. 8 characters"
                className="h-11 pl-12 pr-12 rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <HugeiconsIcon
                  icon={showPassword ? ViewOffIcon : ViewIcon}
                  size={18}
                />
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="flex gap-1.5 h-1">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div
                      key={step}
                      className={cn(
                        "h-full flex-1 rounded-full transition-all duration-300",
                        step <= strength.score
                          ? strength.score <= 1
                            ? "bg-destructive"
                            : strength.score <= 2
                              ? "bg-amber-500"
                              : strength.score <= 3
                                ? "bg-emerald-500"
                                : strength.score <= 4
                                  ? "bg-blue-500"
                                  : "bg-primary"
                          : "bg-border/30",
                      )}
                    />
                  ))}
                </div>
                <p className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="text-muted-foreground/60">
                    Password strength:
                  </span>
                  <span
                    className={cn(
                      strength.score <= 1
                        ? "text-destructive"
                        : strength.score <= 2
                          ? "text-amber-600"
                          : strength.score <= 3
                            ? "text-emerald-600"
                            : strength.score <= 4
                              ? "text-blue-600"
                              : "text-primary transition-all duration-500 scale-105 origin-left",
                    )}
                  >
                    {strength.label}
                  </span>
                </p>
              </div>
            )}
          </Field>
        </FieldGroup>

        <div className="grid gap-3 mt-4">
          <Button
            type="submit"
            isLoading={isLoading}
            loadingText="Creating Account..."
            className="h-11 rounded-xl text-lg font-bold shadow-lg shadow-primary/10 bg-primary hover:bg-primary/90 text-primary-foreground"
            icon={ArrowLeft01Icon}
            iconPlacement="right"
          >
            Sign Up
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
            Sign Up With Google
          </Button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Already have an account?{" "}
          <a
            href={finalLoginUrl}
            className="text-primary font-bold hover:underline"
          >
            Sign In.
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

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

interface SignupFormProps extends React.ComponentProps<"form"> {
  title?: string;
  description?: string;
}

import { useUserStore } from "@/store/useUserStore";
import { UserProfile } from "@/services/api";
import { authService } from "@/services/auth.service";

import Image from "next/image"; // Import Image component

export function SignupForm({
  className,
  title = "Create Account.",
  description = "Join Calabash and start your academic journey.",
  defaultRole = "student",
  loginUrl,
  ...props
}: SignupFormProps & {
  defaultRole?: "student" | "lecturer";
  loginUrl?: string;
}) {
  const router = useRouter();
  const defaultLoginUrl =
    defaultRole === "student" ? "/auth/login/student" : "/auth/login/lecturer";
  const finalLoginUrl = loginUrl || defaultLoginUrl;
  const { login } = useUserStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
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

    // 1. Length requirements
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;

    // 2. Character diversity
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    const labels = ["Weak", "Fair", "Good", "Strong", "Excellent"];
    return { score, label: labels[score - 1] || "Weak" };
  };

  const strength = getStrength(password);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)}>
      <div className="mb-8">
        <a
          href="/auth"
          className="inline-flex items-center gap-2 text-base font-semibold text-muted-foreground hover:text-primary transition-colors mb-6 group"
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Selection
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
        </p>
      </div>
    </div>
  );
}
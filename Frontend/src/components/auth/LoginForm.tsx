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

interface LoginFormProps extends React.ComponentProps<"form"> {
  signupUrl?: string;
  role?: "student" | "lecturer";
}

import Image from "next/image"; // Import Image component

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
  const { login } = useUserStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const validateEmail = (val: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!val) return "";
    return regex.test(val) ? "" : "Please enter a valid email address";
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
        </p>
      </div>
    </div>
  );
}

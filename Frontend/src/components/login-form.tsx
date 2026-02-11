"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  LibraryIcon,
  Mail01Icon,
  LockPasswordIcon,
  ViewIcon,
  ViewOffIcon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";
import {
  Button,
  Input,
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/core";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
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

    // Mock login delay
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
  }

  return (
    <div className={cn("grid gap-6", className)}>
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome Back.
        </h1>
        <p className="text-muted-foreground mt-2">
          Let&apos;s sign in to your account and get started.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6">
        <FieldGroup>
          <Field>
            <FieldLabel
              htmlFor="email"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 mb-2 block"
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
                  "h-12 pl-12 rounded-full border-border/60 bg-muted/20 focus:bg-background transition-all",
                  emailError &&
                    "border-destructive focus-visible:ring-destructive",
                )}
              />
            </div>
            {emailError && (
              <p className="text-[10px] text-destructive font-bold mt-1.5 ml-4 uppercase tracking-widest">
                {emailError}
              </p>
            )}
          </Field>

          <Field>
            <div className="flex items-center justify-between mb-2">
              <FieldLabel
                htmlFor="password"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80"
              >
                Password
              </FieldLabel>
              <a
                href="#"
                className="text-xs font-bold text-primary hover:underline"
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
                required
                className="h-12 pl-12 pr-12 rounded-full border-border/60 bg-muted/20 focus:bg-background transition-all"
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
              className="text-sm font-semibold text-muted-foreground cursor-pointer"
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
            className="h-12 rounded-full text-base font-bold shadow-lg shadow-primary/10 bg-primary hover:bg-primary/90 text-primary-foreground"
            icon={ArrowLeft01Icon}
            iconPlacement="right"
          >
            Sign In
          </Button>

          <Button
            variant="outline"
            type="button"
            className="h-12 rounded-full border-border/60 font-bold bg-background hover:bg-muted/30 transition-all gap-3"
          >
            <img
              src="/google.svg"
              alt="Google"
              className="h-5 w-5"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            Sign In With Google
          </Button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Don&apos;t have an account?{" "}
          <a href="/auth" className="text-primary font-bold hover:underline">
            Sign Up.
          </a>
        </p>
      </div>
    </div>
  );
}

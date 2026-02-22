"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft01Icon,
  Mail01Icon,
  SentIcon,
} from "@/lib/icons/material-icons";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";

import {
  M3Button,
  Field,
  FieldGroup,
  FieldLabel,
  Input,
} from "@/components/core";
import { cn } from "@/lib/utils";

interface ForgotPasswordFormProps {
  role: "student" | "lecturer";
}

export function ForgotPasswordForm({ role }: ForgotPasswordFormProps) {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const loginUrl =
    role === "student" ? "/auth/login/student" : "/auth/login/lecturer";
  const emailPlaceholder =
    role === "lecturer"
      ? "faculty@university.edu"
      : "student@university.edu";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 700));

    setSubmitted(true);
    setIsLoading(false);
  }

  return (
    <div className="grid gap-6">
      <div className="mb-6">
        <Link
          href={loginUrl}
          className="inline-flex items-center gap-2 text-[16px] font-semibold text-muted-foreground hover:text-primary transition-colors mb-6 group"
        >
          <MaterialSymbol
            icon={ArrowLeft01Icon}
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Sign In
        </Link>

        <h1 className="text-[30px] font-bold tracking-tight text-foreground">
          Forgot Password?
        </h1>
        <p className="text-muted-foreground mt-2">
          Enter your {role} account email and we&apos;ll send a reset link.
        </p>
      </div>

      {submitted ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
              <MaterialSymbol icon={SentIcon} size={16} />
            </div>
            <div className="space-y-2">
              <p className="text-[16px] font-bold text-foreground">
                Reset link sent
              </p>
              <p className="text-[14px] text-muted-foreground">
                If an account exists for{" "}
                <span className="font-semibold">{email}</span>, a password reset
                link has been sent.
              </p>
              <Link href={loginUrl}>
                <M3Button className="mt-2 h-10 px-5">
                  Return to Sign In
                </M3Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-6">
          <FieldGroup>
            <Field>
              <FieldLabel
                htmlFor="email"
                className="text-[14px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-2 block"
              >
                Email Address
              </FieldLabel>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                  <MaterialSymbol icon={Mail01Icon} size={18} />
                </div>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={emailPlaceholder}
                  required
                  className={cn(
                    "h-11 pl-12 rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-all",
                  )}
                />
              </div>
            </Field>
          </FieldGroup>

          <div className="grid gap-3">
            <M3Button
              type="submit"
              isLoading={isLoading}
              className="h-11 rounded-xl text-[16px] font-bold"
            >
              Send Reset Link
            </M3Button>
            <Link href={loginUrl}>
              <M3Button
                type="button"
                variant="outlined"
                className="w-full h-11 rounded-xl font-bold"
              >
                Cancel
              </M3Button>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

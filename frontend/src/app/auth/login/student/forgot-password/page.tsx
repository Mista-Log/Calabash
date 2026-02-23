"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Input } from "@/components/core";
import { MdFilledButton } from "@/components/core/md-button";
import { MdIcon } from "@/components/core/md-icon";
import { MdEmptyState } from "@/components/core/md-empty-state";
import { useToast } from "@/components/core/toast";
import { authService } from "@/services/auth.service";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await authService.requestPasswordReset(email);
      setIsSubmitted(true);
      addToast("Reset link sent! Check your email.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send reset link. Please try again.";
      setError(message);
      addToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout showNavigation={false} showFooter={false}>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-[color:var(--md-sys-color-surface-container-low)] rounded-[28px] border border-[color:var(--md-sys-color-outline-variant)] p-8">
            {!isSubmitted ? (
              <>
                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[color:var(--md-sys-color-primary-container)] mb-6">
                  <MdIcon className="text-[32px] text-[color:var(--md-sys-color-primary)]">
                    lock_reset
                  </MdIcon>
                </div>

                {/* Header */}
                <h1 className="m3-headline-small text-[color:var(--md-sys-color-on-surface)] text-center mb-2">
                  Reset Password
                </h1>
                <p className="m3-body-large text-[color:var(--md-sys-color-on-surface-variant)] text-center mb-8">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    id="forgot-password-student-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="student@university.edu"
                    leadingIcon="mail"
                    className="w-full"
                    required
                  />

                  {error && (
                    <p className="text-[13px] font-semibold text-[color:var(--md-sys-color-error)] flex items-center gap-2">
                      <MdIcon>error</MdIcon>
                      {error}
                    </p>
                  )}

                  <MdFilledButton
                    type="submit"
                    fullWidth
                    loading={isLoading}
                    disabled={!email}
                  >
                    Send Reset Link
                  </MdFilledButton>
                </form>

                {/* Back to Login */}
                <div className="mt-6 text-center">
                  <Link
                    href="/auth/login"
                    className="m3-label-large text-[color:var(--md-sys-color-primary)] hover:underline"
                  >
                    ← Back to Login
                  </Link>
                </div>
              </>
            ) : (
              <MdEmptyState
                icon="check_circle"
                title="Check Your Email"
                description={`We've sent a password reset link to ${email}. The link will expire in 24 hours.`}
                actionLabel="Back to Login"
                onAction={() => router.push("/auth/login")}
              />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

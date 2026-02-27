"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/core";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { useUserStore } from "@/store/useUserStore";

export default function OnboardingIndexPage() {
  const router = useRouter();
  const { user, hasHydrated } = useUserStore();

  React.useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!user) {
      router.replace("/auth");
      return;
    }

    router.replace(`/onboarding/${user.role}`);
  }, [hasHydrated, router, user]);

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <Card
        variant="outlined"
        className="w-full max-w-[500px] border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]"
      >
        <CardContent className="py-10 text-center">
          <MaterialSymbol
            icon="progress_activity"
            size={28}
            className="mx-auto mb-3 animate-spin text-[color:var(--md-sys-color-primary)]"
          />
          <p className="m3-title-medium text-[color:var(--md-sys-color-on-surface)]">
            Loading your onboarding flow...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


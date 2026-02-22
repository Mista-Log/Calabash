"use client";

import * as React from "react";
import {
  CustomerService01Icon,
  Message01Icon,
  BookOpen01Icon,
  SecurityIcon,
} from "@/lib/icons/material-icons";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { Card, CardContent, M3Button, useToast } from "@/components/core";
import { mockActionsService } from "@/services/mock-actions.service";

export default function SupportPage() {
  const { addToast } = useToast();
  const [isStartingChat, setIsStartingChat] = React.useState(false);
  const [isRequestingEmail, setIsRequestingEmail] = React.useState(false);
  const categories = [
    {
      title: "Technical Support",
      icon: CustomerService01Icon,
      desc: "Issues with accessing materials or video playback.",
    },
    {
      title: "Academic Help",
      icon: BookOpen01Icon,
      desc: "Clarifications on course content and resource library.",
    },
    {
      title: "Account & Safety",
      icon: SecurityIcon,
      desc: "Privacy settings, password resets, and security.",
    },
  ];

  const handleStartChat = React.useCallback(async () => {
    setIsStartingChat(true);
    try {
      const result = await mockActionsService.startSupportLiveChat();
      addToast(`Live chat started (${result.referenceId}).`, "success");
    } catch {
      addToast("Unable to start live chat.", "error");
    } finally {
      setIsStartingChat(false);
    }
  }, [addToast]);

  const handleEmailSupport = React.useCallback(async () => {
    setIsRequestingEmail(true);
    try {
      const result = await mockActionsService.requestSupportEmail();
      addToast(
        `Support email ticket created (${result.referenceId}).`,
        "info",
      );
    } catch {
      addToast("Unable to create support email ticket.", "error");
    } finally {
      setIsRequestingEmail(false);
    }
  }, [addToast]);

  return (
    <div className="w-full px-3 py-5 sm:px-5 sm:py-7 lg:px-7 lg:py-9">
      <div className="mx-auto w-full max-w-[1360px] space-y-10">
      <div className="space-y-3 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--md-sys-color-on-surface)]">
            How can we help?
        </h1>
        <p className="mx-auto max-w-2xl text-base font-medium text-[color:var(--md-sys-color-on-surface-variant)]">
          Search our knowledge base or contact a support representative for help
          with your academic experience.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {categories.map((cat) => (
          <Card
            key={cat.title}
            className="group cursor-pointer border-[color:var(--md-sys-color-outline-variant)] text-center transition-colors hover:bg-[color:var(--md-sys-color-surface-container-low)]"
          >
            <CardContent className="space-y-4 p-7">
              <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)] transition-transform group-hover:scale-105">
                <MaterialSymbol icon={cat.icon} size={32} />
              </div>
              <h3 className="text-lg font-semibold text-[color:var(--md-sys-color-on-surface)]">
                {cat.title}
              </h3>
              <p className="text-sm leading-relaxed text-[color:var(--md-sys-color-on-surface-variant)]">
                {cat.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]">
        <CardContent className="space-y-6 p-8 text-center">
          <h2 className="text-2xl font-semibold text-[color:var(--md-sys-color-on-surface)]">
            Still need help?
          </h2>
          <p className="mx-auto max-w-xl text-[color:var(--md-sys-color-on-surface-variant)]">
            Our support team is available Monday - Friday, 8am to 6pm for
            real-time assistance.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
            <M3Button
              className="h-12 w-full gap-2 px-8 sm:w-auto"
              onClick={() => void handleStartChat()}
              isLoading={isStartingChat}
            >
              <MaterialSymbol icon={Message01Icon} size={20} />
              Start Live Chat
            </M3Button>
            <M3Button
              variant="outlined"
              className="h-12 w-full px-8 sm:w-auto"
              onClick={() => void handleEmailSupport()}
              isLoading={isRequestingEmail}
            >
              Email Support
            </M3Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}


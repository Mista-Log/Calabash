"use client";

import * as React from "react";
import {
  CustomerService01Icon,
  Message01Icon,
  BookOpen01Icon,
  SecurityIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, Button } from "@/components/core";

export default function SupportPage() {
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

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-12 py-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black tracking-tight">
            How can we help?
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
            Search our knowledge base or contact a support representative for
            help with your academic experience.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((cat, i) => (
            <Card
              key={i}
              className="text-center hover:shadow-xl transition-all border-border/40 cursor-pointer group"
            >
              <CardContent className="p-8 space-y-4">
                <div className="size-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <HugeiconsIcon icon={cat.icon} size={32} />
                </div>
                <h3 className="font-bold text-lg">{cat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  {cat.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-card rounded-3xl p-10 border border-primary/10 text-center space-y-6">
          <h2 className="text-2xl font-bold">Still need help?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Our support team is available Monday - Friday, 8am to 6pm for
            real-time assistance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button className="w-full sm:w-auto gap-2 px-8 h-12 rounded-xl shadow-lg shadow-primary/20">
              <HugeiconsIcon icon={Message01Icon} size={20} />
              Start Live Chat
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto h-12 rounded-xl px-8 font-bold"
            >
              Email Support
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

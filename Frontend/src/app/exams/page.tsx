"use client";

import * as React from "react";
import {
  Knowledge01Icon,
  Calendar03Icon,
  Timer02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, Button, Badge } from "@/components/core";

export default function ExamsPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Assessments & Exams
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your upcoming tests, quizzes, and examination schedules.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold">Upcoming Assessments</h2>
            {[
              {
                title: "Mid-Semester Quiz",
                course: "CSC 102",
                date: "Feb 20, 2025",
                time: "10:00 AM",
              },
              {
                title: "GNS 101 Final Project",
                course: "GNS 101",
                date: "Mar 05, 2025",
                time: "11:59 PM",
              },
            ].map((exam, i) => (
              <Card
                key={i}
                className="border-border/40 hover:border-primary/30 transition-colors"
              >
                <CardContent className="p-6 flex items-center gap-6">
                  <div className="size-14 rounded-2xl bg-accent/10 flex flex-col items-center justify-center text-accent">
                    <span className="text-xs font-black leading-none">
                      {exam.date.split(" ")[1].replace(",", "")}
                    </span>
                    <span className="text-xs font-bold uppercase">
                      {exam.date.split(" ")[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-primary/5 text-primary border-none text-xs font-bold">
                        {exam.course}
                      </Badge>
                      <span className="text-xs font-bold text-orange-500">
                        Upcoming
                      </span>
                    </div>
                    <h3 className="font-bold text-lg">{exam.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <HugeiconsIcon icon={Timer02Icon} size={14} />
                        {exam.time}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <HugeiconsIcon icon={Calendar03Icon} size={14} />
                        {exam.date}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-xl font-bold text-xs h-10 px-6"
                  >
                    View Syllabus
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold">Past Results</h2>
            <Card className="bg-accent/5 border-none shadow-none">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Mock Exam 1</span>
                  <span className="text-sm font-black text-primary">
                    88/100
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Weekly Quiz 4</span>
                  <span className="text-sm font-black text-primary">
                    92/100
                  </span>
                </div>
                <Button
                  variant="ghost"
                  className="w-full text-xs font-bold text-primary mt-4"
                >
                  View All Results
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

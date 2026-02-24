"use client";

import React from "react";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BookOpen01Icon,
  Search01Icon,
  CircleArrowRight01Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/core/button";
import { Card, CardContent } from "@/components/core/card";
import Link from "next/link";

interface EmptyCoursesStateProps {
  role: "student" | "lecturer";
}

export function EmptyCoursesState({ role }: EmptyCoursesStateProps) {
  return (
    <Card className="border-dashed border-2 border-muted/50 bg-muted/5 py-12">
      <CardContent className="flex flex-col items-center justify-center text-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary"
        >
          <HugeiconsIcon icon={BookOpen01Icon} size={48} />
        </motion.div>

        <div className="space-y-2 max-w-[400px]">
          <h2 className="text-2xl font-bold tracking-tight">
            {role === "student"
              ? "No Courses Enrolled Yet"
              : "No Taught Courses Found"}
          </h2>
          <p className="text-muted-foreground font-medium">
            {role === "student"
              ? "Enrolling in courses gives you access to lecture materials, assignments, and study groups. Start your academic journey today."
              : "It looks like you haven't been assigned any modules to teach this semester. If this is an error, please contact the department."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          {role === "student" ? (
            <>
              <Link href="/library">
                <Button className="rounded-xl px-8 h-12 font-bold shadow-lg shadow-primary/20 gap-2">
                  <HugeiconsIcon icon={Search01Icon} size={20} />
                  Browse Library
                </Button>
              </Link>
              <Button
                variant="outline"
                className="rounded-xl px-8 h-12 font-bold gap-2"
              >
                Join Course by Code
                <HugeiconsIcon icon={CircleArrowRight01Icon} size={20} />
              </Button>
            </>
          ) : (
            <Link href="/courses/add">
              <Button className="rounded-xl px-8 h-12 font-bold shadow-lg shadow-primary/20 gap-2">
                <HugeiconsIcon icon={PlusSignIcon} size={20} />
                Create a Module
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 w-full border-t border-muted/20 mt-8">
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest font-black text-muted-foreground/40 mb-1">
              Tip 01
            </p>
            <p className="text-xs font-bold text-muted-foreground px-4">
              Search by course code or title
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest font-black text-muted-foreground/40 mb-1">
              Tip 02
            </p>
            <p className="text-xs font-bold text-muted-foreground px-4">
              Follow lecturers to see their uploads
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest font-black text-muted-foreground/40 mb-1">
              Tip 03
            </p>
            <p className="text-xs font-bold text-muted-foreground px-4">
              Collect materials in your library
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import React from "react";
import { motion } from "@/lib/motion-foundations";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { BookOpen01Icon } from "@/lib/icons/material-icons";
import { M3Button } from "@/components/core";
import { Card, CardContent } from "@/components/core";
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
          <MaterialSymbol icon={BookOpen01Icon} size={48} />
        </motion.div>

        <div className="space-y-2 max-w-[400px]">
          <h2 className="text-[24px] font-bold tracking-tight">
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
                <M3Button className="rounded-xl px-8 h-12 font-bold gap-2">
                  Browse Library
                </M3Button>
              </Link>
              <M3Button
                variant="outlined"
                className="rounded-xl px-8 h-12 font-bold gap-2"
              >
                Join Course by Code
              </M3Button>
            </>
          ) : (
            <Link href="/courses/add">
              <M3Button className="rounded-xl px-8 h-12 font-bold gap-2">
                Create a Module
              </M3Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 w-full border-t border-muted/20 mt-8">
          <div className="text-center">
            <p className="text-[13px] uppercase tracking-widest font-black text-muted-foreground/40 mb-1">
              Tip 01
            </p>
            <p className="text-[13px] font-bold text-muted-foreground px-4">
              Search by course code or title
            </p>
          </div>
          <div className="text-center">
            <p className="text-[13px] uppercase tracking-widest font-black text-muted-foreground/40 mb-1">
              Tip 02
            </p>
            <p className="text-[13px] font-bold text-muted-foreground px-4">
              Follow lecturers to see their uploads
            </p>
          </div>
          <div className="text-center">
            <p className="text-[13px] uppercase tracking-widest font-black text-muted-foreground/40 mb-1">
              Tip 03
            </p>
            <p className="text-[13px] font-bold text-muted-foreground px-4">
              Collect materials in your library
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

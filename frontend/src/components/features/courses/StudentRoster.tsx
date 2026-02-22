"use client";

import * as React from "react";
import {
  Sorting05Icon,
  Message01Icon,
  ArrowRight01Icon,
  InformationCircleIcon,
} from "@/lib/icons/material-icons";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import {
  Card,
  M3Button,
  Badge,
  SearchInput,
  Avatar,
  AvatarFallback,
} from "@/components/core";
import { motion } from "@/lib/motion-foundations";

interface Student {
  id: string;
  name: string;
  email: string;
  lastActive: string;
  engagement: number;
  status: "active" | "away" | "inactive";
}

const MOCK_STUDENTS: Student[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@university.edu",
    lastActive: "2 mins ago",
    engagement: 92,
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@university.edu",
    lastActive: "1 hour ago",
    engagement: 88,
    status: "active",
  },
  {
    id: "3",
    name: "Samuel Jackson",
    email: "s.jackson@university.edu",
    lastActive: "Yesterday",
    engagement: 45,
    status: "away",
  },
  {
    id: "4",
    name: "Emily Blunt",
    email: "e.blunt@university.edu",
    lastActive: "3 days ago",
    engagement: 12,
    status: "inactive",
  },
];

export function StudentRoster() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredStudents = MOCK_STUDENTS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold tracking-tight">
            Enrolled Students
          </h2>
          <Badge className="bg-primary/10 text-primary border-none font-bold">
            {MOCK_STUDENTS.length} Total
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <SearchInput
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 rounded-xl w-64"
          />
          <M3Button size="sm" className="h-11 w-11 rounded-xl">
            <MaterialSymbol icon={Sorting05Icon} size={20} />
          </M3Button>
        </div>
      </div>

      <Card className="border-muted/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/5 border-b border-muted/10">
                <th className="py-4 px-6 text-[13px] font-bold uppercase tracking-widest text-muted-foreground">
                  Student
                </th>
                <th className="py-4 px-6 text-[13px] font-bold uppercase tracking-widest text-muted-foreground">
                  Status
                </th>
                <th className="py-4 px-6 text-[13px] font-bold uppercase tracking-widest text-muted-foreground text-center">
                  Engagement
                </th>
                <th className="py-4 px-6 text-[13px] font-bold uppercase tracking-widest text-muted-foreground">
                  Last Active
                </th>
                <th className="py-4 px-6 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/5">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="group hover:bg-muted/5 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-muted/10">
                        <AvatarFallback className="bg-primary/5 text-primary text-[13px] font-bold">
                          {student.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "ST"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-[14px] font-bold text-foreground truncate">
                          {student.name}
                        </p>
                        <p className="text-[13px] font-medium text-muted-foreground truncate">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          student.status === "active"
                            ? "bg-[color:var(--md-sys-color-secondary)]"
                            : student.status === "away"
                              ? "bg-[color:var(--md-sys-color-tertiary)]"
                              : "bg-muted-foreground/30"
                        }`}
                      />
                      <span className="text-[13px] font-bold capitalize text-muted-foreground">
                        {student.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col items-center gap-1.5 min-w-[100px]">
                      <div className="flex items-center justify-between w-full text-[13px] font-bold text-muted-foreground/60">
                        <span>{student.engagement}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted/20 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${student.engagement}%` }}
                          className={`h-full ${
                            student.engagement > 80
                              ? "bg-[color:var(--md-sys-color-secondary)]"
                              : student.engagement > 40
                                ? "bg-[color:var(--md-sys-color-tertiary)]"
                                : "bg-[color:var(--md-sys-color-error)]"
                          }`}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[13px] font-bold text-muted-foreground">
                    {student.lastActive}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <M3Button
                        size="sm"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                      >
                        <MaterialSymbol icon={Message01Icon} size={18} />
                      </M3Button>
                      <M3Button
                        size="sm"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                      >
                        <MaterialSymbol icon={ArrowRight01Icon} size={18} />
                      </M3Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="p-8 border-2 border-dashed border-muted/10 rounded-3xl bg-muted/5 flex flex-col items-center text-center space-y-4">
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <MaterialSymbol icon={InformationCircleIcon} size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold tracking-tight">
            Need a full report?
          </h3>
          <p className="text-[14px] text-muted-foreground max-w-md">
            Generate a comprehensive performance report for all enrolled
            students to identify potential learning gaps.
          </p>
        </div>
        <M3Button className="h-11 px-8 rounded-xl font-bold bg-primary text-primary-foreground">
          Export Full Roster (CSV)
        </M3Button>
      </div>
    </div>
  );
}

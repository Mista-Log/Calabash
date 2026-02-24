"use client";

import * as React from "react";
import {
  Search01Icon,
  Sorting05Icon,
  Message01Icon,
  UserIcon,
  Settings02Icon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Card,
  CardContent,
  Button,
  Badge,
  SearchInput,
  Avatar,
  AvatarFallback,
} from "@/components/core";
import { motion } from "framer-motion";

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
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 rounded-xl"
          >
            <HugeiconsIcon icon={Sorting05Icon} size={20} />
          </Button>
        </div>
      </div>

      <Card className="border-muted/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/5 border-b border-muted/10">
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Student
                </th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Status
                </th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">
                  Engagement
                </th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
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
                        <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                          {student.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "ST"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">
                          {student.name}
                        </p>
                        <p className="text-xs font-medium text-muted-foreground truncate">
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
                            ? "bg-green-500"
                            : student.status === "away"
                              ? "bg-amber-500"
                              : "bg-muted-foreground/30"
                        }`}
                      />
                      <span className="text-xs font-bold capitalize text-muted-foreground">
                        {student.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col items-center gap-1.5 min-w-[100px]">
                      <div className="flex items-center justify-between w-full text-xs font-bold text-muted-foreground/60">
                        <span>{student.engagement}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted/20 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${student.engagement}%` }}
                          className={`h-full ${
                            student.engagement > 80
                              ? "bg-green-500"
                              : student.engagement > 40
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }`}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-xs font-bold text-muted-foreground">
                    {student.lastActive}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                      >
                        <HugeiconsIcon icon={Message01Icon} size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                      >
                        <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                      </Button>
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
          <HugeiconsIcon icon={InformationCircleIcon} size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold tracking-tight">
            Need a full report?
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Generate a comprehensive performance report for all enrolled
            students to identify potential learning gaps.
          </p>
        </div>
        <Button className="h-11 px-8 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          Export Full Roster (CSV)
        </Button>
      </div>
    </div>
  );
}

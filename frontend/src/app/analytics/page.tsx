"use client";

import * as React from "react";
import {
  AnalyticsUpIcon,
  UserGroupIcon,
  ViewIcon,
  Download01Icon,
  ArrowUpRight01Icon,
  ArrowDown01Icon,
  CourseIcon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "framer-motion";

import { MainLayout } from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Separator,
} from "@/components/core";

export default function AnalyticsPage() {
  return (
    <MainLayout>
      <div className="space-y-10">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              Performance Analytics
            </h1>
            <p className="text-muted-foreground mt-1 font-medium">
              Track engagement across your courses and materials.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-xl font-bold text-xs h-11 px-6"
            >
              Export CSV
            </Button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Total Views",
              value: "12.4k",
              trend: "+12%",
              up: true,
              icon: ViewIcon,
              color: "text-blue-500",
              bg: "bg-blue-500/10",
            },
            {
              label: "Downloads",
              value: "3.8k",
              trend: "+8%",
              up: true,
              icon: Download01Icon,
              color: "text-primary",
              bg: "bg-primary/10",
            },
            {
              label: "Active Students",
              value: "842",
              trend: "+5%",
              up: true,
              icon: UserGroupIcon,
              color: "text-accent",
              bg: "bg-accent/10",
            },
            {
              label: "Avg. Duration",
              value: "42m",
              trend: "-2%",
              up: false,
              icon: AnalyticsUpIcon,
              color: "text-orange-500",
              bg: "bg-orange-500/10",
            },
          ].map((stat, i) => (
            <Card
              key={i}
              className="border-border/40 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`size-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}
                  >
                    <HugeiconsIcon icon={stat.icon} size={20} />
                  </div>
                  <Badge
                    variant="outline"
                    className={`border-none font-bold text-xs ${stat.up ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"}`}
                  >
                    <HugeiconsIcon
                      icon={stat.up ? ArrowUpRight01Icon : ArrowDown01Icon}
                      size={12}
                      className="mr-1"
                    />
                    {stat.trend}
                  </Badge>
                </div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  {stat.label}
                </h3>
                <p className="text-2xl font-black mt-1 leading-none">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts & Top Materials */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Engagement Chart (Visual Shell) */}
          <Card className="lg:col-span-2 border-border/40 overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-lg font-bold">
                Engagement Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[400px] w-full bg-accent/5 relative flex items-end justify-around px-10 pb-10">
                {/* Mock Chart Bars */}
                {[45, 60, 40, 75, 55, 90, 65, 80, 50, 70, 85, 95].map(
                  (h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 1, delay: i * 0.05 }}
                      className="w-4 md:w-8 rounded-t-lg bg-linear-to-t from-primary/40 to-primary/80 relative group"
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {Math.floor(h * 12.4)} views
                      </div>
                    </motion.div>
                  ),
                )}
              </div>
              <div className="flex items-center justify-between px-10 py-6 bg-muted/20 border-t">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Jan 2025
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">
                  Engagement Growth: 24%
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Dec 2025
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Top Materials List */}
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Top Performing Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {[
                {
                  title: "Intro to Algorithms PDF",
                  views: 2405,
                  course: "CSC 102",
                },
                {
                  title: "React Context API Video",
                  views: 1892,
                  course: "CSC 101",
                },
                {
                  title: "Semester 1 Past Questions",
                  views: 1450,
                  course: "GNS 101",
                },
                {
                  title: "Database Systems PPT",
                  views: 980,
                  course: "CSC 201",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 group cursor-pointer"
                >
                  <div className="size-10 rounded-xl bg-accent/5 flex flex-col items-center justify-center text-accent font-black text-xs">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs font-bold text-muted-foreground uppercase">
                      {item.course}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black">
                      {item.views.toLocaleString()}
                    </p>
                    <p className="text-xs font-bold text-muted-foreground uppercase">
                      Views
                    </p>
                  </div>
                </div>
              ))}
              <Separator />
              <Button
                variant="ghost"
                className="w-full font-bold text-xs text-primary"
              >
                View All Material Stats
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Course Engagement Heatmap (Mobile/Simple Style) */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Course Engagement Heatmap</h2>
          <Card className="border-border/40 overflow-hidden shadow-none bg-accent/5">
            <CardContent className="p-8 grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: "CSC 101", score: 92 },
                { name: "CSC 102", score: 85 },
                { name: "MTH 101", score: 45 },
                { name: "GNS 101", score: 78 },
                { name: "CSC 201", score: 62 },
              ].map((course, i) => (
                <div
                  key={i}
                  className="bg-background/50 backdrop-blur-sm p-4 rounded-2xl border border-border/40 text-center space-y-3"
                >
                  <p className="text-xs font-black">{course.name}</p>
                  <div className="h-2 w-full bg-accent/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.score}%` }}
                      className={`h-full ${course.score > 80 ? "bg-primary" : course.score > 50 ? "bg-orange-500" : "bg-red-500"}`}
                    />
                  </div>
                  <p className="text-xs font-bold uppercase text-muted-foreground">
                    {course.score}% Engagement
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

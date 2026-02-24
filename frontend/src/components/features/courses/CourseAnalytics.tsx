"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from "@/components/core";
import { CourseDetails } from "@/services/api";

interface CourseAnalyticsProps {
  courseDetails: CourseDetails;
}

const weeklyData = [
  { day: "Mon", views: 120, unique: 80 },
  { day: "Tue", views: 150, unique: 95 },
  { day: "Wed", views: 280, unique: 140 },
  { day: "Thu", views: 210, unique: 110 },
  { day: "Fri", views: 180, unique: 90 },
  { day: "Sat", views: 90, unique: 45 },
  { day: "Sun", views: 110, unique: 55 },
];

const gradeDistribution = [
  { range: "A", count: 45 },
  { range: "B", count: 120 },
  { range: "C", count: 180 },
  { range: "D", count: 60 },
  { range: "F", count: 15 },
];

export function CourseAnalytics({ courseDetails }: CourseAnalyticsProps) {
  return (
    <div className="space-y-10">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Engagement Trend */}
        <Card className="lg:col-span-2 border-muted/10 bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold tracking-tight">
                  Weekly Engagement
                </CardTitle>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                  Material views vs Unique student interactions
                </p>
              </div>
              <Badge
                variant="outline"
                className="text-[#f59e0b] border-[#f59e0b]/20 bg-[#f59e0b]/5 font-bold"
              >
                +24%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="areaViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(0,0,0,0.05)"
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "rgba(0,0,0,0.4)",
                      fontSize: 10,
                      fontWeight: 900,
                    }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "rgba(0,0,0,0.4)",
                      fontSize: 10,
                      fontWeight: 900,
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#areaViews)"
                  />
                  <Area
                    type="monotone"
                    dataKey="unique"
                    stroke="#3d1a04"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="transparent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Insights */}
        <Card className="border-muted/10 bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-bold tracking-tight">
              Material Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
                <span>Top Material</span>
                <span className="text-primary">824 Views</span>
              </div>
              <p className="text-sm font-bold">
                Lecture 1: Intro to Silicon.pdf
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                <span>Highest Activity</span>
                <span className="text-primary">Wednesday</span>
              </div>
              <p className="text-sm font-bold">280 Student Accesses</p>
            </div>
            <div className="pt-4 border-t border-muted/5">
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                Students are most active between{" "}
                <span className="text-foreground font-bold">8 PM - 11 PM</span>.
                Consider scheduling material releases during this window.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Attendance/Access Bar Chart */}
        <Card className="border-muted/10 bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-bold tracking-tight">
              Access Regularity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistribution}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(0,0,0,0.05)"
                  />
                  <XAxis
                    dataKey="range"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "rgba(0,0,0,0.4)",
                      fontSize: 10,
                      fontWeight: 900,
                    }}
                  />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.02)" }}
                    contentStyle={{ borderRadius: "12px", border: "none" }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#3d1a04"
                    radius={[6, 6, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Mini-Feed */}
        <Card className="border-muted/10 bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-bold tracking-tight">
              Recent Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {courseDetails.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-4 p-3 rounded-xl hover:bg-muted/5 transition-colors"
              >
                <div
                  className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${
                    activity.type === "upload"
                      ? "bg-green-500/10 text-green-500"
                      : activity.type === "view"
                        ? "bg-primary/10 text-primary"
                        : "bg-blue-500/10 text-blue-500"
                  }`}
                >
                  <div className="h-5 w-5 bg-current opacity-20 rounded-full" />
                </div>
                <div>
                  <p className="text-sm font-bold">{activity.description}</p>
                  <p className="text-xs text-muted-foreground font-medium">
                    {activity.date}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

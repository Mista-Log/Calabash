"use client";

import * as React from "react";
import {
  Upload02Icon,
  CourseIcon,
  Note01Icon,
  VideoReplayIcon,
  FileZipIcon,
  CheckmarkCircle02Icon,
  PlusSignIcon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, Button, Separator, Badge } from "@/components/core";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const types = [
    {
      id: "pdf",
      label: "PDF Document",
      icon: Note01Icon,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      id: "video",
      label: "Video Lecture",
      icon: VideoReplayIcon,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      id: "zip",
      label: "Study Materials (Zip)",
      icon: FileZipIcon,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      id: "past-question",
      label: "Past Questions",
      icon: CourseIcon,
      color: "text-accent",
      bg: "bg-accent/10",
    },
  ];

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      setIsSuccess(true);
    }, 2500);
  };

  if (isSuccess) {
    return (
      <MainLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <Card className="max-w-md w-full border-none shadow-2xl text-center overflow-hidden">
            <div className="h-2 bg-primary" />
            <CardContent className="p-10 space-y-6">
              <div className="size-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 animate-bounce">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={40} />
              </div>
              <h1 className="text-3xl font-black">Upload Complete!</h1>
              <p className="text-muted-foreground font-medium">
                Your material has been successfully processed and is now
                available in the Resource Library.
              </p>
              <div className="flex flex-col gap-3 pt-4">
                <Button
                  className="w-full h-12 rounded-xl shadow-lg shadow-primary/20"
                  onClick={() => router.push("/dashboard")}
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="w-full h-12 font-bold"
                  onClick={() => setIsSuccess(false)}
                >
                  Upload Another Resource
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-10 py-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight">
            Upload Resource
          </h1>
          <p className="text-muted-foreground text-lg font-medium italic">
            {" "}
            Share your knowledge with the student community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-3 space-y-8">
            <Card className="border-border/40 shadow-xl">
              <CardContent className="p-8 space-y-8">
                {/* File Dropzone */}
                <div className="border-2 border-dashed border-primary/20 rounded-3xl p-12 text-center bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group">
                  <div className="size-16 rounded-full bg-background flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                    <HugeiconsIcon
                      icon={Upload02Icon}
                      size={32}
                      className="text-primary"
                    />
                  </div>
                  <h3 className="text-xl font-bold">Select a file to upload</h3>
                  <p className="text-sm text-muted-foreground mt-2 font-medium">
                    Drag & drop or click to browse
                  </p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-6">
                    PDF, MP4, MOV, or ZIP • Max 500MB
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2 px-1">
                    <label className="text-xs uppercase tracking-widest font-black text-muted-foreground">
                      Resource Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Introduction to Advanced Algorithms"
                      className="w-full h-12 rounded-xl bg-accent/5 border border-border/40 px-4 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 px-1">
                      <label className="text-xs uppercase tracking-widest font-black text-muted-foreground">
                        Course Code
                      </label>
                      <select className="w-full h-12 rounded-xl bg-accent/5 border border-border/40 px-4 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all font-bold text-sm">
                        <option>CSC 101</option>
                        <option>CSC 102</option>
                        <option>GNS 101</option>
                        <option>MTH 101</option>
                      </select>
                    </div>
                    <div className="space-y-2 px-1">
                      <label className="text-xs uppercase tracking-widest font-black text-muted-foreground">
                        Semester
                      </label>
                      <select className="w-full h-12 rounded-xl bg-accent/5 border border-border/40 px-4 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all font-bold text-sm">
                        <option>Semester 1</option>
                        <option>Semester 2</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-4 pt-2">
                  <Button
                    variant="ghost"
                    className="rounded-xl px-8 h-12 font-bold"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 h-12 rounded-xl shadow-lg shadow-primary/20 gap-3 font-bold text-base"
                    onClick={handleUpload}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <div className="size-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <HugeiconsIcon icon={PlusSignIcon} size={20} />
                        Publish Resource
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar / Tips */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <HugeiconsIcon
                icon={InformationCircleIcon}
                size={24}
                className="text-primary"
              />
              Resource Type
            </h2>
            <div className="grid gap-4">
              {types.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center gap-4 p-5 rounded-3xl border transition-all text-left group ${selectedType === type.id ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-border/40 hover:bg-accent/5"}`}
                >
                  <div
                    className={`size-12 rounded-2xl ${selectedType === type.id ? "bg-primary text-primary-foreground" : `${type.bg} ${type.color}`} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <HugeiconsIcon icon={type.icon} size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{type.label}</h4>
                  </div>
                </button>
              ))}
            </div>

            <Card className="bg-orange-500/5 border-orange-500/20 shadow-none mt-8">
              <CardContent className="p-6">
                <h4 className="flex items-center gap-2 text-orange-600 font-black text-xs uppercase tracking-widest mb-3">
                  <HugeiconsIcon icon={InformationCircleIcon} size={16} />
                  Lecturer Tip
                </h4>
                <p className="text-sm text-orange-700/80 font-medium italic leading-relaxed">
                  Adding a clear title and description helps students find your
                  materials 40% faster. Try to include keywords from your
                  syllabus!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

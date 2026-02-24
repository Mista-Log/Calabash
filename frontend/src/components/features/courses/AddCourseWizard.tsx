"use client";

import {
  PlusSignIcon,
  Cancel01Icon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
  BookOpen01Icon,
  InformationCircleIcon,
  Upload01Icon,
  ViewIcon,
  FolderIcon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";
import {
  Button,
  Input,
  Card,
  CardContent,
  Separator,
  Badge,
} from "@/components/core";

interface AddCourseWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (courseData: any) => void;
  isFullPage?: boolean;
}

const STEPS = [
  "Course Identity",
  "Academic Schedule",
  "Course Description",
  "Initial Materials",
  "Visibility Settings",
  "Review & Confirm",
];

export function AddCourseWizard({
  isOpen,
  onClose,
  onSuccess,
  isFullPage = false,
}: AddCourseWizardProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    title: "",
    code: "",
    department: "Computer Science",
    semester: "Semester 1",
    creditHours: "3",
    year: "300 Level",
    description: "",
    objectives: "",
    materials: [] as File[],
    status: "published",
    visibility: "public",
  });

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const updateData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleComplete = () => {
    onSuccess(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "fixed inset-0 z-50 bg-[#0a0c10]/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-8",
            isFullPage &&
              "relative inset-auto z-0 p-0 bg-transparent backdrop-blur-none",
          )}
        >
          <motion.div
            initial={isFullPage ? false : { scale: 0.95, y: 20 }}
            animate={isFullPage ? false : { scale: 1, y: 0 }}
            exit={isFullPage ? undefined : { scale: 0.95, y: 20 }}
            className={cn(
              "w-full max-w-5xl bg-card border border-muted/20 shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]",
              isFullPage &&
                "max-w-none rounded-none border-none shadow-none max-h-screen h-screen",
            )}
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-muted/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <HugeiconsIcon icon={PlusSignIcon} size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">
                    Add New Course
                  </h2>
                  <p className="text-sm text-muted-foreground font-medium">
                    Step {currentStep + 1} of {STEPS.length}:{" "}
                    {STEPS[currentStep]}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-muted/10"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={20} />
              </Button>
            </div>

            {/* Stepper Progress */}
            <div className="px-8 mt-6">
              <div className="flex items-center justify-between gap-2">
                {STEPS.map((step, i) => (
                  <div key={i} className="flex-1 flex flex-col gap-2">
                    <div
                      className={cn(
                        "h-1 rounded-full transition-all duration-500",
                        i <= currentStep ? "bg-primary" : "bg-muted/10",
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs font-bold uppercase tracking-widest hidden md:block",
                        i === currentStep
                          ? "text-primary"
                          : i < currentStep
                            ? "text-foreground/60"
                            : "text-muted-foreground/30",
                      )}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 pt-12">
              <div className="max-w-2xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {currentStep === 0 && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                            Course Title
                          </label>
                          <Input
                            placeholder="e.g. Advanced Database Systems"
                            value={formData.title}
                            onChange={(e) =>
                              updateData({ title: e.target.value })
                            }
                            className="h-12 text-lg font-semibold"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                              Course Code
                            </label>
                            <Input
                              placeholder="e.g. CSC 401"
                              value={formData.code}
                              onChange={(e) =>
                                updateData({ code: e.target.value })
                              }
                              className="h-12 font-mono uppercase"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                              Department
                            </label>
                            <Input
                              value={formData.department}
                              onChange={(e) =>
                                updateData({ department: e.target.value })
                              }
                              className="h-12"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                              Semester
                            </label>
                            <select
                              className="w-full h-12 rounded-xl bg-muted/10 border border-muted/20 px-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                              value={formData.semester}
                              onChange={(e) =>
                                updateData({ semester: e.target.value })
                              }
                            >
                              <option>Semester 1</option>
                              <option>Semester 2</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                              Credit Hours
                            </label>
                            <Input
                              type="number"
                              value={formData.creditHours}
                              onChange={(e) =>
                                updateData({ creditHours: e.target.value })
                              }
                              className="h-12"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                              Year/Level
                            </label>
                            <Input
                              placeholder="e.g. 400 Level"
                              value={formData.year}
                              onChange={(e) =>
                                updateData({ year: e.target.value })
                              }
                              className="h-12"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                            Course Description
                          </label>
                          <textarea
                            rows={4}
                            placeholder="Briefly describe the course..."
                            className="w-full rounded-2xl bg-muted/10 border border-muted/20 p-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                            value={formData.description}
                            onChange={(e) =>
                              updateData({ description: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                            Learning Objectives
                          </label>
                          <textarea
                            rows={4}
                            placeholder="What will students learn?"
                            className="w-full rounded-2xl bg-muted/10 border border-muted/20 p-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                            value={formData.objectives}
                            onChange={(e) =>
                              updateData({ objectives: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div className="border-2 border-dashed border-muted/20 rounded-3xl p-12 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors group cursor-pointer">
                          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 transition-transform group-hover:scale-110">
                            <HugeiconsIcon icon={Upload01Icon} size={32} />
                          </div>
                          <h3 className="text-lg font-bold">
                            Upload Course Materials
                          </h3>
                          <p className="text-muted-foreground mt-2 max-w-[280px]">
                            Drag and drop syllabus, lecture notes, or slides
                            here to get started.
                          </p>
                          <input type="file" className="hidden" multiple />
                          <Button variant="outline" className="mt-8 gap-2">
                            Browse Files
                          </Button>
                        </div>
                      </div>
                    )}

                    {currentStep === 4 && (
                      <div className="space-y-8">
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            {
                              id: "published",
                              label: "Published",
                              desc: "Visible to all students immediately",
                              icon: ViewIcon,
                            },
                            {
                              id: "draft",
                              label: "Draft",
                              desc: "Only visible to you while you setup",
                              icon: FolderIcon,
                            },
                          ].map((option) => (
                            <div
                              key={option.id}
                              onClick={() => updateData({ status: option.id })}
                              className={cn(
                                "p-6 rounded-2xl border transition-all cursor-pointer",
                                formData.status === option.id
                                  ? "bg-primary/5 border-primary ring-1 ring-primary"
                                  : "bg-muted/5 border-muted/10 hover:border-muted/30",
                              )}
                            >
                              <div
                                className={cn(
                                  "h-10 w-10 rounded-xl flex items-center justify-center mb-4",
                                  formData.status === option.id
                                    ? "bg-primary text-white"
                                    : "bg-muted/20 text-muted-foreground",
                                )}
                              >
                                <HugeiconsIcon icon={option.icon} size={20} />
                              </div>
                              <h4 className="font-bold">{option.label}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {option.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            {
                              id: "public",
                              label: "Public Enrollment",
                              desc: "Any student can enroll",
                              icon: CheckmarkCircle02Icon,
                            },
                            {
                              id: "private",
                              label: "Private (By Approval)",
                              desc: "Students must request access",
                              icon: InformationCircleIcon,
                            },
                          ].map((option) => (
                            <div
                              key={option.id}
                              onClick={() =>
                                updateData({ visibility: option.id })
                              }
                              className={cn(
                                "p-6 rounded-2xl border transition-all cursor-pointer",
                                formData.visibility === option.id
                                  ? "bg-[#6366f1]/5 border-[#6366f1] ring-1 ring-[#6366f1]"
                                  : "bg-muted/5 border-muted/10 hover:border-muted/30",
                              )}
                            >
                              <div
                                className={cn(
                                  "h-10 w-10 rounded-xl flex items-center justify-center mb-4",
                                  formData.visibility === option.id
                                    ? "bg-[#6366f1] text-white"
                                    : "bg-muted/20 text-muted-foreground",
                                )}
                              >
                                <HugeiconsIcon icon={option.icon} size={20} />
                              </div>
                              <h4 className="font-bold">{option.label}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {option.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentStep === 5 && (
                      <div className="space-y-6">
                        <Card className="border-muted/20 bg-muted/5">
                          <CardContent className="p-8 space-y-6">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-4">
                                <div>
                                  <h3 className="text-2xl font-bold">
                                    {formData.title || "Untitled Course"}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                      variant="outline"
                                      className="font-mono text-xs"
                                    >
                                      {formData.code || "CODE"}
                                    </Badge>
                                    <Badge className="bg-[#f59e0b] text-white border-none">
                                      {formData.semester}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Separator className="bg-muted/10" />
                            <div className="grid grid-cols-3 gap-6">
                              <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
                                  Department
                                </p>
                                <p className="font-semibold">
                                  {formData.department}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
                                  Credit Hours
                                </p>
                                <p className="font-semibold">
                                  {formData.creditHours} Units
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
                                  Level
                                </p>
                                <p className="font-semibold">{formData.year}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/20">
                          <HugeiconsIcon
                            icon={InformationCircleIcon}
                            size={20}
                            className="text-primary shrink-0"
                          />
                          <p className="text-xs text-primary/80 leading-relaxed">
                            By confirming, this course will be created and{" "}
                            {formData.status === "published"
                              ? "made visible to eligible students."
                              : "saved as a draft for later editing."}
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-muted/10 bg-muted/5 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="gap-2 font-bold"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={18} /> Back
              </Button>
              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={onClose} className="font-bold">
                  Cancel
                </Button>
                {currentStep === STEPS.length - 1 ? (
                  <Button
                    onClick={handleComplete}
                    className="h-12 px-8 font-bold gap-2 shadow-lg shadow-primary/20"
                  >
                    Confirm & Create Course{" "}
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} />
                  </Button>
                ) : (
                  <Button
                    onClick={nextStep}
                    className="h-12 px-8 font-bold gap-2 shadow-lg shadow-primary/20"
                  >
                    Continue <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

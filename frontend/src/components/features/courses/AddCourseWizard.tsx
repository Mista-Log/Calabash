<<<<<<< HEAD
﻿"use client";

import * as React from "react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  BookOpen01Icon,
  Calendar03Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  CodeFolderIcon,
  Delete02Icon,
  File01Icon,
  InformationCircleIcon,
  Link01Icon,
  PlusSignIcon,
  Upload01Icon,
  ViewIcon,
} from "@/lib/icons/material-icons";
import { motion, AnimatePresence } from "@/lib/motion-foundations";

import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { cn } from "@/lib/utils";
import {
  Badge,
  M3Button,
  Card,
  CardContent,
  Input,
  Separator,
} from "@/components/core";
import { ModuleEditor, Module } from "./ModuleEditor";
=======
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
>>>>>>> origin/main

interface AddCourseWizardProps {
  isOpen: boolean;
  onClose: () => void;
<<<<<<< HEAD
  onSuccess: (courseData: AddCourseWizardData) => void;
  isFullPage?: boolean;
}

type WizardFormData = {
  title: string;
  code: string;
  department: string;
  semester: string;
  creditHours: string;
  year: string;
  description: string;
  objectives: string;
  modules: Module[];
  materials: File[];
  status: "published" | "draft";
  visibility: "public" | "private";
};

export type AddCourseWizardData = WizardFormData;

const STEPS = [
  {
    title: "Course Identity",
    description: "Name, code, and department metadata",
    icon: BookOpen01Icon,
  },
  {
    title: "Academic Schedule",
    description: "Semester, level, and unit load",
    icon: Calendar03Icon,
  },
  {
    title: "Course Description",
    description: "Purpose and learning outcomes",
    icon: InformationCircleIcon,
  },
  {
    title: "Course Modules",
    description: "Build structured learning sequence",
    icon: Link01Icon,
  },
  {
    title: "Initial Materials",
    description: "Attach supplemental resources",
    icon: Upload01Icon,
  },
  {
    title: "Visibility Settings",
    description: "Publishing and enrollment behavior",
    icon: ViewIcon,
  },
  {
    title: "Review & Confirm",
    description: "Validate and create",
    icon: CheckmarkCircle02Icon,
  },
] as const;

const INITIAL_FORM: WizardFormData = {
  title: "",
  code: "",
  department: "Computer Science",
  semester: "Semester 1",
  creditHours: "3",
  year: "300 Level",
  description: "",
  objectives: "",
  modules: [],
  materials: [],
  status: "published",
  visibility: "public",
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[color:var(--md-sys-color-on-surface-variant)]">
      {children}
    </label>
  );
}

function StepRailItem({
  index,
  title,
  description,
  icon,
  active,
  complete,
  onClick,
}: {
  index: number;
  title: string;
  description: string;
  icon: string;
  active: boolean;
  complete: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-2xl border px-4 py-3 text-left transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
        active
          ? "border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]"
          : "border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] hover:bg-[color:var(--md-sys-color-surface-container)]",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            active
              ? "bg-[color:var(--md-sys-color-primary)] text-[color:var(--md-sys-color-on-primary)]"
              : complete
                ? "bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]"
                : "bg-[color:var(--md-sys-color-surface-container-high)] text-[color:var(--md-sys-color-on-surface-variant)]",
          )}
        >
          <MaterialSymbol
            icon={complete ? CheckmarkCircle02Icon : icon}
            size={18}
            fill={active}
          />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--md-sys-color-on-surface-variant)]">
            Step {index + 1}
          </p>
          <p className="truncate text-sm font-semibold">{title}</p>
          <p className="mt-0.5 text-xs text-[color:var(--md-sys-color-on-surface-variant)]">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}
=======
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
>>>>>>> origin/main

export function AddCourseWizard({
  isOpen,
  onClose,
  onSuccess,
  isFullPage = false,
}: AddCourseWizardProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
<<<<<<< HEAD
  const [formData, setFormData] = React.useState<WizardFormData>(INITIAL_FORM);
  const [isDragActive, setIsDragActive] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const stepValidations = React.useMemo(
    () => [
      formData.title.trim().length >= 3 && formData.code.trim().length >= 2,
      formData.semester.length > 0 &&
        formData.creditHours.length > 0 &&
        formData.year.length > 0,
      formData.description.trim().length >= 12 &&
        formData.objectives.trim().length >= 12,
      formData.modules.length > 0,
      true,
      formData.status.length > 0 && formData.visibility.length > 0,
      true,
    ],
    [formData],
  );

  const fileTypeSummary = React.useMemo(() => {
    const buckets = new Set<string>();
    formData.materials.forEach((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase() || "";
      if (["pdf"].includes(extension)) buckets.add("PDF");
      else if (["doc", "docx"].includes(extension)) buckets.add("DOC");
      else if (["ppt", "pptx"].includes(extension)) buckets.add("PPT");
      else if (["zip", "rar", "7z"].includes(extension)) buckets.add("Archive");
      else if (["jpg", "jpeg", "png", "webp"].includes(extension))
        buckets.add("Image");
      else if (["mp4", "mov", "avi", "mkv"].includes(extension))
        buckets.add("Video");
      else buckets.add("File");
    });
    return Array.from(buckets);
  }, [formData.materials]);

  const canProceed = stepValidations[currentStep];
  const progress = Math.round(((currentStep + 1) / STEPS.length) * 100);

  const updateData = (data: Partial<WizardFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (canProceed && currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
=======
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
>>>>>>> origin/main
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

<<<<<<< HEAD
  const selectStep = (index: number) => {
    const canJump = stepValidations.slice(0, index).every(Boolean);
    if (index <= currentStep || canJump) setCurrentStep(index);
=======
  const updateData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
>>>>>>> origin/main
  };

  const handleComplete = () => {
    onSuccess(formData);
    onClose();
  };

<<<<<<< HEAD
  const materialKey = (file: File) =>
    `${file.name}-${file.size}-${file.lastModified}`;

  const mergeMaterials = (incoming: File[]) => {
    if (incoming.length === 0) return;
    updateData({
      materials: (() => {
        const map = new Map<string, File>();
        [...formData.materials, ...incoming].forEach((file) => {
          map.set(materialKey(file), file);
        });
        return Array.from(map.values());
      })(),
    });
  };

  const removeMaterial = (target: File) => {
    updateData({
      materials: formData.materials.filter(
        (file) => materialKey(file) !== materialKey(target),
      ),
    });
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    const kb = size / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const getMaterialType = (name: string) => {
    const extension = name.split(".").pop()?.toLowerCase() || "";
    if (extension === "pdf") return "PDF";
    if (["doc", "docx"].includes(extension)) return "DOC";
    if (["ppt", "pptx"].includes(extension)) return "PPT";
    if (["zip", "rar", "7z"].includes(extension)) return "Archive";
    if (["jpg", "jpeg", "png", "webp"].includes(extension)) return "Image";
    if (["mp4", "mov", "avi", "mkv"].includes(extension)) return "Video";
    return "File";
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    mergeMaterials(files);
    event.target.value = "";
  };

  const onUploadDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    const files = Array.from(event.dataTransfer.files || []);
    mergeMaterials(files);
  };

=======
>>>>>>> origin/main
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
<<<<<<< HEAD
          className={
            isFullPage
              ? "relative z-0 h-[calc(100vh-4rem)] bg-transparent p-0"
              : "app-overlay-root"
          }
        >
          {!isFullPage ? <div aria-hidden="true" className="app-overlay-scrim" /> : null}
          <div className={isFullPage ? "contents" : "app-overlay-center"}>
            <motion.div
              initial={isFullPage ? false : { scale: 0.96, y: 12 }}
              animate={isFullPage ? false : { scale: 1, y: 0 }}
              exit={isFullPage ? undefined : { scale: 0.96, y: 12 }}
              className={
                isFullPage
                  ? "mx-auto flex h-full w-full max-w-none flex-col overflow-hidden rounded-none border-none bg-[color:var(--md-sys-color-surface-container-low)] shadow-none"
                  : "app-overlay-panel flex w-full max-w-6xl max-h-[calc(100dvh-2rem)] flex-col overflow-hidden bg-[color:var(--md-sys-color-surface-container-low)]"
              }
            >
            <header className="flex items-center justify-between border-b border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)] px-4 py-3 md:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]">
                  <MaterialSymbol icon={PlusSignIcon} size={22} />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold md:text-xl">
                    Create Course
                  </h2>
                  <p className="truncate text-xs text-[color:var(--md-sys-color-on-surface-variant)] md:text-sm">
                    Step {currentStep + 1} of {STEPS.length}:{" "}
                    {STEPS[currentStep].title}
                  </p>
                </div>
              </div>
              <M3Button size="sm" onClick={onClose}>
                <MaterialSymbol icon={Cancel01Icon} size={18} />
              </M3Button>
            </header>

            <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)]">
              <aside className="hidden border-r border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] lg:flex lg:flex-col">
                <div className="border-b border-[color:var(--md-sys-color-outline-variant)] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--md-sys-color-on-surface-variant)]">
                    Progress
                  </p>
                  <p className="mt-1.5 text-xl font-semibold">{progress}%</p>
                  <div className="mt-3 h-2 w-full rounded-full bg-[color:var(--md-sys-color-surface-container-high)]">
                    <div
                      className="h-2 rounded-full bg-[color:var(--md-sys-color-primary)] transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-2 overflow-y-auto p-4">
                  {STEPS.map((step, index) => (
                    <StepRailItem
                      key={step.title}
                      index={index}
                      title={step.title}
                      description={step.description}
                      icon={step.icon}
                      active={index === currentStep}
                      complete={index < currentStep && stepValidations[index]}
                      onClick={() => selectStep(index)}
                    />
                  ))}
                </div>
              </aside>

              <section className="flex min-h-0 flex-col">
                <div className="border-b border-[color:var(--md-sys-color-outline-variant)] px-4 py-3 lg:hidden">
                  <div className="h-1.5 w-full rounded-full bg-[color:var(--md-sys-color-surface-container-high)]">
                    <div
                      className="h-1.5 rounded-full bg-[color:var(--md-sys-color-primary)] transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
                  <div className="mx-auto w-full max-w-3xl">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.24 }}
                        className="space-y-6"
                      >
                        {currentStep === 0 && (
                          <Card variant="outlined" className="rounded-3xl">
                            <CardContent className="space-y-5 p-6 md:p-7">
                              <FieldLabel>Course Title</FieldLabel>
                              <Input
                                placeholder="e.g. Advanced Database Systems"
                                value={formData.title}
                                onChange={(e) =>
                                  updateData({ title: e.target.value })
                                }
                                className="text-lg font-semibold"
                              />
                              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div className="space-y-2">
                                  <FieldLabel>Course Code</FieldLabel>
                                  <Input
                                    placeholder="e.g. CSC 401"
                                    value={formData.code}
                                    onChange={(e) =>
                                      updateData({
                                        code: e.target.value.toUpperCase(),
                                      })
                                    }
                                    className="font-mono uppercase"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <FieldLabel>Department</FieldLabel>
                                  <Input
                                    value={formData.department}
                                    onChange={(e) =>
                                      updateData({ department: e.target.value })
                                    }
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {currentStep === 1 && (
                          <Card variant="outlined" className="rounded-3xl">
                            <CardContent className="grid grid-cols-1 gap-5 p-6 md:grid-cols-3 md:p-7">
                              <div className="space-y-2">
                                <FieldLabel>Semester</FieldLabel>
                                <select
                                  className="m3-input h-12 w-full px-4 text-sm font-medium"
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
                                <FieldLabel>Credit Hours</FieldLabel>
                                <select
                                  className="m3-input h-12 w-full px-4 text-sm font-medium"
                                  value={formData.creditHours}
                                  onChange={(e) =>
                                    updateData({ creditHours: e.target.value })
                                  }
                                >
                                  <option value="1">1 Unit</option>
                                  <option value="2">2 Units</option>
                                  <option value="3">3 Units</option>
                                  <option value="4">4 Units</option>
                                  <option value="5">5 Units</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <FieldLabel>Year / Level</FieldLabel>
                                <select
                                  className="m3-input h-12 w-full px-4 text-sm font-medium"
                                  value={formData.year}
                                  onChange={(e) =>
                                    updateData({ year: e.target.value })
                                  }
                                >
                                  <option>100 Level</option>
                                  <option>200 Level</option>
                                  <option>300 Level</option>
                                  <option>400 Level</option>
                                  <option>500 Level</option>
                                </select>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {currentStep === 2 && (
                          <Card variant="outlined" className="rounded-3xl">
                            <CardContent className="space-y-5 p-6 md:p-7">
                              <div className="space-y-2">
                                <FieldLabel>Course Description</FieldLabel>
                                <textarea
                                  rows={5}
                                  placeholder="Describe the course scope and value..."
                                  className="m3-input w-full resize-none rounded-[var(--md-sys-shape-corner-large)] p-4 text-sm"
                                  value={formData.description}
                                  onChange={(e) =>
                                    updateData({ description: e.target.value })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <FieldLabel>Learning Objectives</FieldLabel>
                                <textarea
                                  rows={5}
                                  placeholder="List measurable learning outcomes..."
                                  className="m3-input w-full resize-none rounded-[var(--md-sys-shape-corner-large)] p-4 text-sm"
                                  value={formData.objectives}
                                  onChange={(e) =>
                                    updateData({ objectives: e.target.value })
                                  }
                                />
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {currentStep === 3 && (
                          <Card variant="outlined" className="rounded-3xl">
                            <CardContent className="p-6 md:p-7">
                              <ModuleEditor
                                courseCode={formData.code}
                                initialModules={formData.modules}
                                onChange={(modules) => updateData({ modules })}
                              />
                            </CardContent>
                          </Card>
                        )}

                        {currentStep === 4 && (
                          <Card variant="outlined" className="rounded-3xl">
                            <CardContent className="space-y-4 p-6 md:p-7">
                              <div
                                role="button"
                                tabIndex={0}
                                onClick={openFilePicker}
                                onKeyDown={(event) => {
                                  if (
                                    event.key === "Enter" ||
                                    event.key === " "
                                  ) {
                                    event.preventDefault();
                                    openFilePicker();
                                  }
                                }}
                                onDragEnter={(event) => {
                                  event.preventDefault();
                                  setIsDragActive(true);
                                }}
                                onDragOver={(event) => {
                                  event.preventDefault();
                                  setIsDragActive(true);
                                }}
                                onDragLeave={(event) => {
                                  event.preventDefault();
                                  setIsDragActive(false);
                                }}
                                onDrop={onUploadDrop}
                                className={cn(
                                  "w-full rounded-3xl border-2 border-dashed p-10 text-center transition-colors",
                                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
                                  isDragActive
                                    ? "border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-primary-container)]/35"
                                    : "border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] hover:bg-[color:var(--md-sys-color-surface-container)]",
                                )}
                              >
                                <div className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]">
                                  <MaterialSymbol
                                    icon={Upload01Icon}
                                    size={28}
                                  />
                                </div>
                                <p className="text-base font-semibold">
                                  {isDragActive
                                    ? "Drop files to upload"
                                    : "Upload Supplemental Materials"}
                                </p>
                                <p className="mt-1 text-sm text-[color:var(--md-sys-color-on-surface-variant)]">
                                  {formData.materials.length > 0
                                    ? `${formData.materials.length} file(s) selected`
                                    : "Attach references, syllabus, or starter files"}
                                </p>
                                <p className="mt-4 text-xs text-[color:var(--md-sys-color-on-surface-variant)]">
                                  Supported: PDF, DOCX, PPTX, ZIP, Images,
                                  Videos
                                </p>
                              </div>
                              <input
                                id="supplement-upload"
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                multiple
                                onChange={onFileInputChange}
                              />
                              {formData.materials.length > 0 && (
                                <div className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-3">
                                  <div className="mb-3 flex flex-wrap items-center gap-2">
                                    {fileTypeSummary.map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="rounded-full"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateData({ materials: [] })
                                      }
                                      className="ml-auto text-xs font-semibold text-[color:var(--md-sys-color-primary)] hover:underline"
                                    >
                                      Clear all
                                    </button>
                                  </div>
                                  <div className="max-h-64 space-y-2 overflow-y-auto">
                                    {formData.materials.map((file) => (
                                      <div
                                        key={materialKey(file)}
                                        className="flex items-center justify-between rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)] px-3 py-2"
                                      >
                                        <div className="flex min-w-0 items-center gap-2">
                                          <MaterialSymbol
                                            icon={File01Icon}
                                            size={16}
                                          />
                                          <div className="min-w-0">
                                            <p className="truncate text-sm font-medium">
                                              {file.name}
                                            </p>
                                            <p className="text-xs text-[color:var(--md-sys-color-on-surface-variant)]">
                                              {getMaterialType(file.name)} ·{" "}
                                              {formatFileSize(file.size)}
                                            </p>
                                          </div>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => removeMaterial(file)}
                                          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[color:var(--md-sys-color-on-surface-variant)] transition-colors hover:bg-[color:var(--md-sys-color-error)]/12 hover:text-[color:var(--md-sys-color-error)]"
                                          aria-label={`Remove ${file.name}`}
                                        >
                                          <MaterialSymbol
                                            icon={Delete02Icon}
                                            size={16}
                                          />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="mt-3 flex items-center justify-between">
                                    <p className="text-xs text-[color:var(--md-sys-color-on-surface-variant)]">
                                      Total files: {formData.materials.length}
                                    </p>
                                    <button
                                      type="button"
                                      onClick={openFilePicker}
                                      className="text-xs font-semibold text-[color:var(--md-sys-color-primary)] hover:underline"
                                    >
                                      Add more files
                                    </button>
                                  </div>
                                </div>
                              )}
                              {formData.materials.length === 0 && (
                                <div className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)] p-3 text-xs text-[color:var(--md-sys-color-on-surface-variant)]">
                                  Uploading starter materials helps students
                                  begin quickly before module content is
                                  finalized.
                                </div>
                              )}
                              {formData.materials.length > 8 && (
                                <div className="rounded-2xl border border-[color:var(--md-sys-color-tertiary)]/30 bg-[color:var(--md-sys-color-tertiary-container)]/35 p-3 text-xs text-[color:var(--md-sys-color-on-tertiary-container)]">
                                  Large batches are selected. Consider
                                  organizing module-specific files later in
                                  module setup for better student navigation.
                                </div>
                              )}
                              {formData.materials.length > 0 && (
                                <div className="flex gap-2">
                                  <M3Button
                                    type="button"
                                    variant="outlined"
                                    onClick={openFilePicker}
                                    className="gap-2"
                                  >
                                    <MaterialSymbol
                                      icon={Upload01Icon}
                                      size={16}
                                    />
                                    Add Files
                                  </M3Button>
                                  <M3Button
                                    variant="text"
                                    onClick={() =>
                                      updateData({ materials: [] })
                                    }
                                    className="gap-2"
                                  >
                                    <MaterialSymbol
                                      icon={Delete02Icon}
                                      size={16}
                                    />
                                    Remove All
                                  </M3Button>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )}

                        {currentStep === 5 && (
                          <Card variant="outlined" className="rounded-3xl">
                            <CardContent className="space-y-5 p-6 md:p-7">
                              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {[
                                  {
                                    id: "published" as const,
                                    label: "Published",
                                    desc: "Visible to students immediately",
                                    icon: ViewIcon,
                                  },
                                  {
                                    id: "draft" as const,
                                    label: "Draft",
                                    desc: "Only visible to lecturers",
                                    icon: CodeFolderIcon,
                                  },
                                ].map((option) => (
                                  <button
                                    key={option.id}
                                    type="button"
                                    onClick={() =>
                                      updateData({ status: option.id })
                                    }
                                    className={cn(
                                      "rounded-2xl border p-4 text-left transition-colors",
                                      formData.status === option.id
                                        ? "border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-primary-container)]"
                                        : "border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]",
                                    )}
                                  >
                                    <MaterialSymbol
                                      icon={option.icon}
                                      size={18}
                                    />
                                    <p className="mt-2 text-sm font-semibold">
                                      {option.label}
                                    </p>
                                    <p className="text-xs text-[color:var(--md-sys-color-on-surface-variant)]">
                                      {option.desc}
                                    </p>
                                  </button>
                                ))}
                              </div>
                              <Separator />
                              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {[
                                  {
                                    id: "public" as const,
                                    label: "Public Enrollment",
                                    desc: "Any eligible student can enroll",
                                  },
                                  {
                                    id: "private" as const,
                                    label: "Private Approval",
                                    desc: "Enrollment requires permission",
                                  },
                                ].map((option) => (
                                  <button
                                    key={option.id}
                                    type="button"
                                    onClick={() =>
                                      updateData({ visibility: option.id })
                                    }
                                    className={cn(
                                      "rounded-2xl border p-4 text-left transition-colors",
                                      formData.visibility === option.id
                                        ? "border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-primary-container)]"
                                        : "border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]",
                                    )}
                                  >
                                    <p className="text-sm font-semibold">
                                      {option.label}
                                    </p>
                                    <p className="text-xs text-[color:var(--md-sys-color-on-surface-variant)]">
                                      {option.desc}
                                    </p>
                                  </button>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {currentStep === 6 && (
                          <div className="space-y-4">
                            <Card variant="outlined" className="rounded-3xl">
                              <CardContent className="space-y-4 p-6 md:p-7">
                                <h3 className="text-xl font-semibold">
                                  {formData.title || "Untitled Course"}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  <Badge className="font-mono">
                                    {formData.code || "CODE"}
                                  </Badge>
                                  <Badge variant="secondary">
                                    {formData.semester}
                                  </Badge>
                                  <Badge variant="secondary">
                                    {formData.year}
                                  </Badge>
                                </div>
                                <p className="text-sm text-[color:var(--md-sys-color-on-surface-variant)]">
                                  {formData.description ||
                                    "No description provided."}
                                </p>
                              </CardContent>
                            </Card>
                            <div className="flex items-start gap-3 rounded-2xl border border-[color:var(--md-sys-color-primary)]/25 bg-[color:var(--md-sys-color-primary-container)]/40 p-4">
                              <MaterialSymbol
                                icon={InformationCircleIcon}
                                size={18}
                                className="mt-0.5 text-[color:var(--md-sys-color-on-primary-container)]"
                              />
                              <p className="text-sm text-[color:var(--md-sys-color-on-primary-container)]">
                                Creating this course will{" "}
                                {formData.status === "published"
                                  ? "make it visible immediately according to enrollment settings."
                                  : "save it as draft for later publishing."}
                              </p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                <footer className="flex items-center justify-between border-t border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] px-4 py-3 md:px-8">
                  <M3Button
                    variant="text"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="gap-2 font-semibold"
                  >
                    <MaterialSymbol icon={ArrowLeft01Icon} size={18} /> Back
                  </M3Button>
                  <div className="flex items-center gap-2 md:gap-3">
                    <M3Button
                      variant="text"
                      onClick={onClose}
                      className="font-semibold"
                    >
                      Cancel
                    </M3Button>
                    {currentStep === STEPS.length - 1 ? (
                      <M3Button
                        onClick={handleComplete}
                        icon={CheckmarkCircle02Icon}
                        iconPlacement="right"
                        className="h-11 px-6 font-semibold md:h-12 md:px-8"
                      >
                        Create Course
                      </M3Button>
                    ) : (
                      <M3Button
                        onClick={nextStep}
                        disabled={!canProceed}
                        icon={ArrowRight01Icon}
                        iconPlacement="right"
                        className="h-11 px-6 font-semibold md:h-12 md:px-8"
                      >
                        Continue
                      </M3Button>
                    )}
                  </div>
                </footer>
              </section>
            </div>
            </motion.div>
          </div>
=======
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
>>>>>>> origin/main
        </motion.div>
      )}
    </AnimatePresence>
  );
}

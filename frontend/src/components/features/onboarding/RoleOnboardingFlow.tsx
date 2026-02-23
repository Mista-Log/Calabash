"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  M3Button,
} from "@/components/core";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  LibraryIcon,
  Mortarboard01Icon,
} from "@/lib/icons/material-icons";
import type { UserProfile } from "@/services/api";
import {
  type OnboardingAnswers,
  type OnboardingRole,
  useOnboardingStore,
} from "@/store/useOnboardingStore";
import { useUserStore } from "@/store/useUserStore";

type QuestionType = "single" | "multi" | "text";

interface QuestionOption {
  value: string;
  label: string;
  help: string;
  icon: string;
  recommended?: boolean;
}

interface RoleQuestion {
  id: string;
  title: string;
  hint: string;
  type: QuestionType;
  options?: QuestionOption[];
  required?: boolean;
  maxSelections?: number;
  placeholder?: string;
  helper?: string;
  fieldLabel?: string;
  autoComplete?: string;
}

interface RoleTheme {
  badge: string;
  title: string;
  subtitle: string;
  icon: string;
  completionLabel: string;
}

const ROLE_THEME: Record<OnboardingRole, RoleTheme> = {
  student: {
    badge: "Student Setup",
    title: "Let’s shape your learning experience.",
    subtitle:
      "Answer 4 short questions so your dashboard feels relevant from day one.",
    icon: Mortarboard01Icon,
    completionLabel: "Open Student Workspace",
  },
  lecturer: {
    badge: "Lecturer Setup",
    title: "Let’s shape your teaching workspace.",
    subtitle:
      "Answer 4 short questions so your course operations and communication tools are prioritized.",
    icon: LibraryIcon,
    completionLabel: "Open Lecturer Workspace",
  },
};

const ROLE_QUESTIONS: Record<OnboardingRole, RoleQuestion[]> = {
  student: [
    {
      id: "study_level",
      title: "What level are you currently in?",
      hint: "Used to tune your semester defaults and study timeline.",
      type: "single",
      required: true,
      options: [
        {
          value: "level_100",
          label: "100 Level",
          help: "Foundational modules and early-term planning.",
          icon: "filter_1",
        },
        {
          value: "level_200",
          label: "200 Level",
          help: "Core modules with increasing practical work.",
          icon: "filter_2",
          recommended: true,
        },
        {
          value: "level_300_plus",
          label: "300+ / Postgraduate",
          help: "Advanced modules, projects, and research focus.",
          icon: "school",
        },
      ],
    },
    {
      id: "primary_goal",
      title: "What is your primary goal this term?",
      hint: "We prioritize recommendations around this goal.",
      type: "single",
      required: true,
      options: [
        {
          value: "coursework",
          label: "Stay on top of coursework",
          help: "Weekly structure for modules, notes, and tasks.",
          icon: "task_alt",
          recommended: true,
        },
        {
          value: "exam_prep",
          label: "Prepare for exams",
          help: "Revision-focused flow and readiness tracking.",
          icon: "quiz",
        },
        {
          value: "project_execution",
          label: "Deliver better projects",
          help: "Resources geared toward assignments and projects.",
          icon: "developer_board",
        },
      ],
    },
    {
      id: "resource_preference",
      title: "Which resources help you learn fastest?",
      hint: "Choose up to 2 so your feed stays focused.",
      type: "multi",
      required: true,
      maxSelections: 2,
      options: [
        {
          value: "lecture_notes",
          label: "Lecture notes",
          help: "Concise documents and quick references.",
          icon: "description",
          recommended: true,
        },
        {
          value: "past_questions",
          label: "Past questions",
          help: "Practice by exam pattern and difficulty.",
          icon: "help",
        },
        {
          value: "video_lessons",
          label: "Video lessons",
          help: "Walkthroughs and visual explanations.",
          icon: "play_circle",
        },
      ],
    },
    {
      id: "department",
      title: "Which department are you in?",
      hint: "Department context improves course and resource relevance.",
      type: "text",
      required: true,
      fieldLabel: "Department",
      placeholder: "e.g. Computer Science",
      helper: "You can update this later in settings.",
      autoComplete: "organization",
    },
  ],
  lecturer: [
    {
      id: "teaching_role",
      title: "Which role best describes you?",
      hint: "Used to prioritize shortcuts and management actions.",
      type: "single",
      required: true,
      options: [
        {
          value: "course_lecturer",
          label: "Course Lecturer",
          help: "Owns delivery and outcomes for one or more courses.",
          icon: "co_present",
          recommended: true,
        },
        {
          value: "assistant_lecturer",
          label: "Assistant Lecturer",
          help: "Supports labs, sessions, and content updates.",
          icon: "supervisor_account",
        },
        {
          value: "program_coordinator",
          label: "Program Coordinator",
          help: "Coordinates curriculum quality across courses.",
          icon: "hub",
        },
      ],
    },
    {
      id: "active_courses",
      title: "How many active courses are you handling?",
      hint: "We tune workload visibility and action queues from this.",
      type: "single",
      required: true,
      options: [
        {
          value: "one_to_two",
          label: "1-2 courses",
          help: "Focused load with lightweight operations.",
          icon: "looks_one",
          recommended: true,
        },
        {
          value: "three_to_four",
          label: "3-4 courses",
          help: "Balanced delivery with steady publishing.",
          icon: "looks_3",
        },
        {
          value: "five_plus",
          label: "5+ courses",
          help: "High-load setup with stronger workflow support.",
          icon: "add_chart",
        },
      ],
    },
    {
      id: "instructional_priority",
      title: "What should Calabash optimize first?",
      hint: "Your quick actions and dashboard emphasis will follow this.",
      type: "single",
      required: true,
      options: [
        {
          value: "content_organization",
          label: "Organize materials faster",
          help: "Structure modules and uploads with less friction.",
          icon: "inventory_2",
          recommended: true,
        },
        {
          value: "student_engagement",
          label: "Boost student engagement",
          help: "Improve communication and participation flow.",
          icon: "groups",
        },
        {
          value: "performance_tracking",
          label: "Track performance clearly",
          help: "Monitor class outcomes with clearer insights.",
          icon: "monitoring",
        },
      ],
    },
    {
      id: "department",
      title: "Which department should we attach to your profile?",
      hint: "This helps with course grouping and analytics context.",
      type: "text",
      required: true,
      fieldLabel: "Department",
      placeholder: "e.g. Electrical Engineering",
      helper: "You can update this later in profile settings.",
      autoComplete: "organization",
    },
  ],
};

const STUDENT_LEVEL_TO_SEMESTER: Record<string, number> = {
  level_100: 1,
  level_200: 3,
  level_300_plus: 5,
};

function hasAnswer(question: RoleQuestion, answers: OnboardingAnswers): boolean {
  const answer = answers[question.id];

  if (!question.required) {
    return true;
  }

  if (question.type === "text") {
    return typeof answer === "string" && answer.trim().length > 0;
  }

  if (question.type === "single") {
    return typeof answer === "string" && answer.trim().length > 0;
  }

  return Array.isArray(answer) && answer.length > 0;
}

function resolveAnswerLabels(
  role: OnboardingRole,
  answers: OnboardingAnswers,
): string[] {
  const labels: string[] = [];

  ROLE_QUESTIONS[role].forEach((question) => {
    const answer = answers[question.id];
    if (!answer) {
      return;
    }

    if (question.type === "text") {
      if (typeof answer === "string" && answer.trim().length > 0) {
        labels.push(answer.trim());
      }
      return;
    }

    const optionByValue = new Map(
      (question.options ?? []).map((option) => [option.value, option.label]),
    );

    if (typeof answer === "string") {
      const label = optionByValue.get(answer);
      if (label) {
        labels.push(label);
      }
      return;
    }

    if (Array.isArray(answer)) {
      answer.forEach((value) => {
        const label = optionByValue.get(value);
        if (label) {
          labels.push(label);
        }
      });
    }
  });

  return labels;
}

function toUserUpdates(
  role: OnboardingRole,
  answers: OnboardingAnswers,
): Partial<UserProfile> {
  const updates: Partial<UserProfile> = {
    isNewUser: false,
  };

  const departmentValue = answers.department;
  if (typeof departmentValue === "string" && departmentValue.trim().length > 0) {
    updates.department = departmentValue.trim();
  }

  if (role === "student") {
    const levelValue = answers.study_level;
    if (
      typeof levelValue === "string" &&
      STUDENT_LEVEL_TO_SEMESTER[levelValue] !== undefined
    ) {
      updates.semester = STUDENT_LEVEL_TO_SEMESTER[levelValue];
    }
  }

  return updates;
}

export function RoleOnboardingFlow({ role }: { role: OnboardingRole }) {
  const router = useRouter();
  const theme = ROLE_THEME[role];
  const questions = ROLE_QUESTIONS[role];

  const { user, hasHydrated, updateUser } = useUserStore();
  const roleState = useOnboardingStore((state) => state[role]);
  const upsertRoleAnswers = useOnboardingStore((state) => state.upsertRoleAnswers);
  const completeRoleOnboarding = useOnboardingStore(
    (state) => state.completeRoleOnboarding,
  );

  const [stepIndex, setStepIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<OnboardingAnswers>({});
  const [isSaving, setIsSaving] = React.useState(false);
  const [hydratedAnswers, setHydratedAnswers] = React.useState(false);

  React.useEffect(() => {
    if (!hasHydrated || hydratedAnswers) {
      return;
    }

    setAnswers(roleState.answers);

    const firstIncomplete = questions.findIndex(
      (question) => !hasAnswer(question, roleState.answers),
    );

    setStepIndex(firstIncomplete === -1 ? questions.length - 1 : firstIncomplete);
    setHydratedAnswers(true);
  }, [hasHydrated, hydratedAnswers, questions, roleState.answers]);

  React.useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!user) {
      router.replace(`/auth/login/${role}`);
      return;
    }

    if (user.role !== role) {
      router.replace(`/onboarding/${user.role}`);
      return;
    }

    if (roleState.completed) {
      router.replace("/dashboard");
    }
  }, [hasHydrated, role, roleState.completed, router, user]);

  if (!hasHydrated || !user || user.role !== role || roleState.completed) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <Card
          variant="outlined"
          className="w-full max-w-[520px] border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]"
        >
          <CardContent className="py-10 text-center">
            <MaterialSymbol
              icon="progress_activity"
              size={28}
              className="mx-auto mb-3 animate-spin text-[color:var(--md-sys-color-primary)]"
            />
            <p className="m3-title-medium text-[color:var(--md-sys-color-on-surface)]">
              Preparing your onboarding flow...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[stepIndex];
  const isLastStep = stepIndex === questions.length - 1;
  const canContinue = hasAnswer(currentQuestion, answers);
  const completionPercent = Math.round(((stepIndex + 1) / questions.length) * 100);
  const selectedLabels = resolveAnswerLabels(role, answers);

  const updateAnswer = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    upsertRoleAnswers(role, { [questionId]: value });
  };

  const onMultiToggle = (value: string) => {
    const existing = answers[currentQuestion.id];
    const selected = Array.isArray(existing) ? existing : [];

    if (selected.includes(value)) {
      updateAnswer(
        currentQuestion.id,
        selected.filter((entry) => entry !== value),
      );
      return;
    }

    if (currentQuestion.maxSelections && selected.length >= currentQuestion.maxSelections) {
      return;
    }

    updateAnswer(currentQuestion.id, [...selected, value]);
  };

  const onContinue = () => {
    if (!canContinue) {
      return;
    }

    if (!isLastStep) {
      setStepIndex((prev) => Math.min(prev + 1, questions.length - 1));
      return;
    }

    setIsSaving(true);
    completeRoleOnboarding(role, answers);

    const updates = toUserUpdates(role, answers);
    if (Object.keys(updates).length > 0) {
      updateUser(updates);
    }

    router.replace("/dashboard");
  };

  return (
    <div
      className="min-h-dvh"
      style={{
        background: [
          "radial-gradient(100% 120% at 0% 0%, color-mix(in oklab, var(--md-sys-color-primary-container) 45%, transparent) 0%, transparent 70%)",
          "radial-gradient(100% 120% at 100% 100%, color-mix(in oklab, var(--md-sys-color-tertiary-container) 35%, transparent) 0%, transparent 72%)",
          "var(--md-sys-color-surface)",
        ].join(", "),
      }}
    >
      <main className="mx-auto w-full max-w-[960px] px-4 py-8 sm:py-10">
        <header className="mb-5 space-y-3 sm:mb-6">
          <div className="inline-flex items-center gap-2 rounded-[var(--md-sys-shape-corner-full)] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] px-4 py-2">
            <MaterialSymbol
              icon={theme.icon}
              size={18}
              className="text-[color:var(--md-sys-color-primary)]"
              fill
            />
            <span className="m3-label-large text-[color:var(--md-sys-color-on-surface)]">
              {theme.badge}
            </span>
          </div>

          <h1 className="m3-headline-large text-[color:var(--md-sys-color-on-surface)]">
            {theme.title}
          </h1>
          <p className="m3-body-large max-w-[68ch] text-[color:var(--md-sys-color-on-surface-variant)]">
            {theme.subtitle}
          </p>
        </header>

        <Card
          variant="outlined"
          className="border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-lowest)]"
        >
          <CardHeader className="pb-3">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="m3-label-large rounded-[var(--md-sys-shape-corner-full)] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] px-3 py-1 text-[color:var(--md-sys-color-on-surface-variant)]">
                Step {stepIndex + 1} of {questions.length}
              </span>
              <span className="m3-label-large text-[color:var(--md-sys-color-primary)]">
                {completionPercent}% complete
              </span>
            </div>

            <div className="mb-3 h-2 overflow-hidden rounded-[var(--md-sys-shape-corner-full)] bg-[color:var(--md-sys-color-surface-container-high)]">
              <div
                className="h-full rounded-[var(--md-sys-shape-corner-full)] bg-[color:var(--md-sys-color-primary)] transition-[width] duration-300 ease-out"
                style={{ width: `${completionPercent}%` }}
              />
            </div>

            <CardTitle className="m3-headline-small text-[color:var(--md-sys-color-on-surface)]">
              {currentQuestion.title}
            </CardTitle>
            <CardDescription className="m3-body-medium text-[color:var(--md-sys-color-on-surface-variant)]">
              {currentQuestion.hint}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {currentQuestion.type === "text" ? (
              <div className="space-y-2">
                <label
                  htmlFor={currentQuestion.id}
                  className="m3-label-large text-[color:var(--md-sys-color-on-surface-variant)]"
                >
                  {currentQuestion.fieldLabel ?? "Answer"}
                </label>
                <Input
                  id={currentQuestion.id}
                  type="text"
                  autoComplete={currentQuestion.autoComplete}
                  placeholder={currentQuestion.placeholder}
                  value={
                    typeof answers[currentQuestion.id] === "string"
                      ? answers[currentQuestion.id]
                      : ""
                  }
                  onChange={(event) =>
                    updateAnswer(currentQuestion.id, event.target.value)
                  }
                  leadingIcon="apartment"
                  className="w-full"
                  style={
                    {
                      "--md-filled-text-field-container-color":
                        "var(--md-sys-color-surface-container-high)",
                      "--md-filled-text-field-hover-container-color":
                        "var(--md-sys-color-surface-container-highest)",
                      "--md-filled-text-field-focus-container-color":
                        "var(--md-sys-color-surface-container-highest)",
                      "--md-filled-text-field-container-shape":
                        "var(--md-sys-shape-corner-extra-large)",
                      "--md-outlined-text-field-container-shape":
                        "var(--md-sys-shape-corner-extra-large)",
                    } as React.CSSProperties
                  }
                />
                {currentQuestion.helper ? (
                  <p className="m3-body-small text-[color:var(--md-sys-color-on-surface-variant)]">
                    {currentQuestion.helper}
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {(currentQuestion.options ?? []).map((option) => {
                  const currentValue = answers[currentQuestion.id];
                  const selected =
                    typeof currentValue === "string"
                      ? currentValue === option.value
                      : Array.isArray(currentValue)
                        ? currentValue.includes(option.value)
                        : false;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        currentQuestion.type === "single"
                          ? updateAnswer(currentQuestion.id, option.value)
                          : onMultiToggle(option.value)
                      }
                      aria-pressed={selected}
                      className={[
                        "w-full rounded-[var(--md-sys-shape-corner-large)] border p-4 text-left transition-colors",
                        selected
                          ? "border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-primary-container)]"
                          : "border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] hover:bg-[color:var(--md-sys-color-surface-container)]",
                      ].join(" ")}
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={[
                              "flex h-8 w-8 items-center justify-center rounded-full",
                              selected
                                ? "bg-[color:var(--md-sys-color-primary)] text-[color:var(--md-sys-color-on-primary)]"
                                : "bg-[color:var(--md-sys-color-surface-container-high)] text-[color:var(--md-sys-color-on-surface-variant)]",
                            ].join(" ")}
                          >
                            <MaterialSymbol icon={option.icon} size={16} />
                          </div>
                          <p className="m3-title-medium text-[color:var(--md-sys-color-on-surface)]">
                            {option.label}
                          </p>
                        </div>
                        {selected ? (
                          <MaterialSymbol
                            icon={CheckmarkCircle01Icon}
                            size={18}
                            className="text-[color:var(--md-sys-color-primary)]"
                            fill
                          />
                        ) : option.recommended ? (
                          <span className="m3-label-small rounded-[var(--md-sys-shape-corner-full)] border border-[color:var(--md-sys-color-outline-variant)] px-2 py-0.5 text-[color:var(--md-sys-color-on-surface-variant)]">
                            Recommended
                          </span>
                        ) : null}
                      </div>
                      <p className="m3-body-small text-[color:var(--md-sys-color-on-surface-variant)]">
                        {option.help}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === "multi" && currentQuestion.maxSelections ? (
              <p className="m3-body-small text-[color:var(--md-sys-color-on-surface-variant)]">
                Select up to {currentQuestion.maxSelections} options.
              </p>
            ) : null}

            {selectedLabels.length > 0 ? (
              <div className="rounded-[var(--md-sys-shape-corner-large)] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-3">
                <p className="m3-label-large mb-2 text-[color:var(--md-sys-color-on-surface)]">
                  Selected preferences
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedLabels.slice(-4).map((label) => (
                    <span
                      key={label}
                      className="m3-label-medium rounded-[var(--md-sys-shape-corner-full)] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)] px-3 py-1 text-[color:var(--md-sys-color-on-surface)]"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-3 border-t border-[color:var(--md-sys-color-outline-variant)] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/auth"
                className="inline-flex items-center gap-1 text-[color:var(--md-sys-color-on-surface-variant)] transition-colors hover:text-[color:var(--md-sys-color-primary)]"
              >
                <MaterialSymbol icon={ArrowLeft01Icon} size={14} />
                <span className="m3-label-large">Back to auth portal</span>
              </Link>

              <div className="m3-action-row m3-action-row--end">
                {stepIndex > 0 ? (
                  <M3Button
                    variant="outlined"
                    onClick={() => setStepIndex((prev) => Math.max(prev - 1, 0))}
                  >
                    Previous
                  </M3Button>
                ) : null}
                <M3Button
                  variant={role === "student" ? "filled" : "tonal"}
                  onClick={onContinue}
                  disabled={!canContinue || isSaving}
                  isLoading={isSaving}
                  trailingIcon={isLastStep ? "rocket_launch" : ArrowRight01Icon}
                >
                  {isLastStep ? theme.completionLabel : "Continue"}
                </M3Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

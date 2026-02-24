<<<<<<< HEAD
import {
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  GraduationScrollIcon,
  LibraryIcon,
  Mortarboard01Icon,
  UserGroupIcon,
} from "@/lib/icons/material-icons";

import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import Link from "next/link";
import {
  M3Button,
=======
import { ArrowRight01Icon, LibraryIcon, Mortarboard01Icon } from '@hugeicons/core-free-icons';

import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import {
  Button,
>>>>>>> origin/main
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/core";

<<<<<<< HEAD
type RoleOption = {
  id: "student" | "lecturer";
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: string;
  points: [string, string];
  buttonVariant: "filled" | "tonal";
  featured?: boolean;
};

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: "student",
    title: "I'm a Student",
    description:
      "I want quick access to course notes, deadlines, and study materials.",
    href: "/auth/student",
    cta: "Continue as a Student",
    icon: Mortarboard01Icon,
    points: [
      "See everything for your courses in one place",
      "Track what is due and what to revise next",
    ],
    buttonVariant: "filled",
    featured: true,
  },
  {
    id: "lecturer",
    title: "I'm a Lecturer",
    description:
      "I need to manage course content and keep my class informed.",
    href: "/auth/lecturer",
    cta: "Continue as a Lecturer",
    icon: LibraryIcon,
    points: [
      "Publish notes and resources for each module",
      "Guide students with clear updates and structure",
    ],
    buttonVariant: "tonal",
  },
];

function RoleCard({
  title,
  description,
  href,
  cta,
  icon,
  points,
  buttonVariant,
  featured,
}: RoleOption) {
  return (
    <Card
      variant={featured ? "filled" : "outlined"}
      className={[
        "transition-colors duration-200",
        featured
          ? "border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-primary-container)]"
          : "border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]",
      ].join(" ")}
    >
      <CardHeader className="pb-3">
        <div className="mb-3 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-[var(--md-sys-shape-corner-large)]"
            style={{
              backgroundColor: featured
                ? "color-mix(in oklab, var(--md-sys-color-primary) 20%, transparent)"
                : "var(--md-sys-color-secondary-container)",
              color: featured
                ? "var(--md-sys-color-primary)"
                : "var(--md-sys-color-on-secondary-container)",
            }}
          >
            <MaterialSymbol icon={icon} size={20} fill />
          </div>
          <CardTitle className="m3-title-large text-[color:var(--md-sys-color-on-surface)]">
            {title}
          </CardTitle>
        </div>
        <CardDescription className="m3-body-medium text-[color:var(--md-sys-color-on-surface-variant)]">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {points.map((point) => (
            <li
              key={point}
              className="m3-label-large flex items-center gap-2 text-[color:var(--md-sys-color-on-surface-variant)]"
            >
              <MaterialSymbol
                icon={CheckmarkCircle01Icon}
                size={16}
                className="text-[color:var(--md-sys-color-primary)]"
              />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <Link href={href} className="block">
          <M3Button
            variant={buttonVariant}
            className="w-full"
            trailingIcon={ArrowRight01Icon}
          >
            {cta}
          </M3Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function AuthSelectionPage() {
  return (
    <div
      className="relative min-h-dvh overflow-hidden"
      style={{
        background: [
          "radial-gradient(110% 120% at 8% 8%, color-mix(in oklab, var(--md-sys-color-primary-container) 65%, transparent) 0%, transparent 65%)",
          "radial-gradient(100% 100% at 92% 86%, color-mix(in oklab, var(--md-sys-color-tertiary-container) 50%, transparent) 0%, transparent 70%)",
          "var(--md-sys-color-surface)",
        ].join(", "),
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-24 h-64 w-64 rounded-full border border-[color:var(--md-sys-color-outline-variant)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full border border-[color:var(--md-sys-color-outline-variant)]"
      />

      <main className="relative mx-auto grid min-h-dvh w-full max-w-[1500px] items-center gap-8 px-3 py-8 sm:px-5 sm:py-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-6 xl:px-8">
        <section className="space-y-7">
          <div className="inline-flex items-center gap-3 rounded-[var(--md-sys-shape-corner-full)] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] px-4 py-2">
            <MaterialSymbol
              icon={LibraryIcon}
              size={22}
              className="text-[color:var(--md-sys-color-primary)]"
              fill
            />
            <span className="m3-title-medium text-[color:var(--md-sys-color-on-surface)]">
              Calabash
            </span>
          </div>

          <header className="space-y-3">
            <h1 className="m3-display-small text-[color:var(--md-sys-color-on-surface)]">
              Welcome to Calabash.
            </h1>
            <p className="m3-body-large max-w-[64ch] text-[color:var(--md-sys-color-on-surface-variant)]">
              Choose the role that matches what you are doing right now. We
              will take you to the right onboarding and sign-in flow.
            </p>
          </header>

          <Card
            variant="outlined"
            className="border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]"
          >
            <CardHeader className="pb-2">
              <CardTitle className="m3-title-large text-[color:var(--md-sys-color-on-surface)]">
                Get started in under a minute
              </CardTitle>
              <CardDescription className="m3-body-medium text-[color:var(--md-sys-color-on-surface-variant)]">
                No long setup. Pick a role and continue.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-[var(--md-sys-shape-corner-large)] bg-[color:var(--md-sys-color-surface-container)] p-4">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--md-sys-shape-corner-full)] bg-[color:var(--md-sys-color-primary-container)]">
                    <span className="m3-label-large text-[color:var(--md-sys-color-on-primary-container)]">
                      1
                    </span>
                  </div>
                  <div>
                    <p className="m3-title-medium text-[color:var(--md-sys-color-on-surface)]">
                      Select your role
                    </p>
                    <p className="m3-body-medium text-[color:var(--md-sys-color-on-surface-variant)]">
                      Student or lecturer based on your current task.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-[var(--md-sys-shape-corner-large)] bg-[color:var(--md-sys-color-surface-container)] p-4">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--md-sys-shape-corner-full)] bg-[color:var(--md-sys-color-primary-container)]">
                    <span className="m3-label-large text-[color:var(--md-sys-color-on-primary-container)]">
                      2
                    </span>
                  </div>
                  <div>
                    <p className="m3-title-medium text-[color:var(--md-sys-color-on-surface)]">
                      Sign up or sign in
                    </p>
                    <p className="m3-body-medium text-[color:var(--md-sys-color-on-surface-variant)]">
                      Use the flow that fits your role.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-[var(--md-sys-shape-corner-large)] bg-[color:var(--md-sys-color-surface-container)] p-4">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--md-sys-shape-corner-full)] bg-[color:var(--md-sys-color-primary-container)]">
                    <span className="m3-label-large text-[color:var(--md-sys-color-on-primary-container)]">
                      3
                    </span>
                  </div>
                  <div>
                    <p className="m3-title-medium text-[color:var(--md-sys-color-on-surface)]">
                      Start learning or teaching
                    </p>
                    <p className="m3-body-medium text-[color:var(--md-sys-color-on-surface-variant)]">
                      Jump straight into your workspace.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-2 rounded-[var(--md-sys-shape-corner-full)] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)] px-3 py-1.5">
                  <MaterialSymbol
                    icon={GraduationScrollIcon}
                    size={16}
                    className="text-[color:var(--md-sys-color-primary)]"
                  />
                  <p className="m3-label-large text-[color:var(--md-sys-color-on-surface)]">
                    Student-ready
                  </p>
                </span>
                <span className="inline-flex items-center gap-2 rounded-[var(--md-sys-shape-corner-full)] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)] px-3 py-1.5">
                  <MaterialSymbol
                    icon={UserGroupIcon}
                    size={16}
                    className="text-[color:var(--md-sys-color-secondary)]"
                  />
                  <p className="m3-label-large text-[color:var(--md-sys-color-on-surface)]">
                    Faculty-ready
                  </p>
                </span>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="w-full">
          <Card
            variant="outlined"
            className="border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-lowest)]"
          >
            <CardHeader className="pb-2">
              <CardTitle className="m3-headline-small text-[color:var(--md-sys-color-on-surface)]">
                How would you like to continue?
              </CardTitle>
              <CardDescription className="m3-body-medium text-[color:var(--md-sys-color-on-surface-variant)]">
                New to Calabash? Start with a role below. You can switch paths
                later if needed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 xl:grid-cols-2">
                {ROLE_OPTIONS.map((option) => (
                  <RoleCard key={option.id} {...option} />
                ))}
              </div>

              <div className="rounded-[var(--md-sys-shape-corner-large)] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-4">
                <p className="m3-body-medium mb-3 text-[color:var(--md-sys-color-on-surface-variant)]">
                  Already have an account?
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Link href="/auth/login/student" className="block">
                    <M3Button
                      variant="outlined"
                      className="w-full"
                      trailingIcon={ArrowRight01Icon}
                    >
                      Sign in as Student
                    </M3Button>
                  </Link>
                  <Link href="/auth/login/lecturer" className="block">
                    <M3Button
                      variant="outlined"
                      className="w-full"
                      trailingIcon={ArrowRight01Icon}
                    >
                      Sign in as Lecturer
                    </M3Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
=======
export default function AuthSelectionPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-bold text-primary text-2xl">
          <HugeiconsIcon icon={LibraryIcon} size={32} />
          Calabash
        </div>

        <div className="flex flex-col gap-4">
          <Card className="hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Mortarboard01Icon}
                  size={20}
                  className="text-primary"
                />
                I am a Student
              </CardTitle>
              <CardDescription>
                Access course materials and study resources.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/auth/student">
                <Button
                  className="w-full"
                  icon={<HugeiconsIcon icon={ArrowRight01Icon} size={18} />}
                  iconPlacement="right"
                >
                  Continue as Student
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={LibraryIcon}
                  size={20}
                  className="text-primary"
                />
                I am a Lecturer
              </CardTitle>
              <CardDescription>
                Manage courses and upload academic materials.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/auth/lecturer">
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary/5"
                  icon={<HugeiconsIcon icon={ArrowRight01Icon} size={18} />}
                  iconPlacement="right"
                >
                  Continue as Lecturer
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
>>>>>>> origin/main
    </div>
  );
}

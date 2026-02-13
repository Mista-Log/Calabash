import {
  ArrowRight01Icon,
  LibraryIcon,
  Mortarboard01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/core";

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
    </div>
  );
}

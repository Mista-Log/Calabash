import { AuthLayout } from "@/components/layout/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";

export default function GlobalSignupPage() {
  return (
    <AuthLayout
      video="https://ouq07ad0ckrnn7nu.public.blob.vercel-storage.com/student%20cover.mp4"
      testimonial={{
        quote:
          "Starting my journey on Calabash was the best decision I made this semester. Everything I need is just a login away.",
        author: "Amara Okeke",
        role: "Architecture Student",
        avatar: "https://i.pravatar.cc/150?u=amara",
      }}
    >
      <SignupForm />
    </AuthLayout>
  );
}

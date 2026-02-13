import { AuthLayout } from "@/components/layout/AuthLayout";
import { SignupForm } from "@/components/signup-form";

export default function GlobalSignupPage() {
  return (
    <AuthLayout
      image="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop"
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

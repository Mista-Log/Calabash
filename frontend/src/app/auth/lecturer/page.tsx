import { AuthLayout } from "@/components/layout/AuthLayout";
import { SignupForm } from "@/components/signup-form";

export default function LecturerSignupPage() {
  return (
    <AuthLayout
      image="https://images.unsplash.com/photo-1524178232363-1fb280714553?q=80&w=2070&auto=format&fit=crop"
      testimonial={{
        quote:
          "Calabash has revolutionized how I communicate with my students and manage course materials. It's the digital archive we've always needed.",
        author: "Prof. Michael Chen",
        role: "Head of Engineering, PlanetTech",
        avatar: "https://i.pravatar.cc/150?u=michael",
      }}
    >
      <SignupForm
        title="Faculty Access."
        description="Join our network of educators and contribute to the collective knowledge."
      />
    </AuthLayout>
  );
}
